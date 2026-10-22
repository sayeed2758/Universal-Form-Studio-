(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
  const amount = value => Math.round((Number(value) || 0) * 100) / 100;
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  let nextMemberId = 5, nextExpenseId = 1, editingExpenseId = null, toastTimer;
  let state = freshState();

  function freshState() {
    return {
      tourName: 'Bhubaneswar Tour', budgetAmount: 12000,
      members: [{ id: 1, name: 'Shahid' }, { id: 2, name: 'Member 2' }, { id: 3, name: 'Member 3' }, { id: 4, name: 'Member 4' }],
      expenses: []
    };
  }
  function displayMember(member, index) {
    const name = String(member?.name || '').trim();
    return name || `Member ${index + 1}`;
  }
  function memberIndexById(id) { return state.members.findIndex(member => member.id === Number(id)); }
  function memberName(id) {
    const index = memberIndexById(id);
    return index < 0 ? 'Member removed' : displayMember(state.members[index], index);
  }
  function totals() {
    const spent = amount(state.expenses.reduce((sum, expense) => sum + amount(expense.amount), 0));
    const budget = Math.max(0, Number(state.budgetAmount) || 0);
    return { spent, budget, remaining: amount(budget - spent) };
  }
  function showToast(message, isError = false) {
    const toast = $('#tourToast');
    toast.textContent = message;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
  }
  function setError(message = '') {
    const error = $('#expenseError');
    error.textContent = message;
    error.hidden = !message;
  }
  function updatePayerOptions(selectedValue) {
    const select = $('#expensePayer');
    const oldValue = selectedValue ?? select.value;
    select.innerHTML = state.members.map((member, index) => `<option value="${member.id}">${escapeHTML(displayMember(member, index))}</option>`).join('');
    if (state.members.some(member => String(member.id) === String(oldValue))) select.value = String(oldValue);
    else if (state.members.length) select.value = String(state.members[0].id);
  }
  function renderMembers() {
    $('#membersList').innerHTML = state.members.map((member, index) => `
      <div class="member-row">
        <span class="member-number">${String(index + 1).padStart(2, '0')}</span>
        <input type="text" data-member-id="${member.id}" aria-label="Name of member ${index + 1}" maxlength="70" value="${escapeHTML(member.name)}" placeholder="Member ${index + 1}">
        <button type="button" class="remove-member" data-remove-member="${member.id}" aria-label="Remove member ${index + 1}" title="Remove member" ${state.members.length <= 1 ? 'disabled' : ''}>×</button>
      </div>`).join('');
    updatePayerOptions();
  }
  function renderExpenseList() {
    const holder = $('#expenseList');
    $('#entryCounter').textContent = `${state.expenses.length} ${state.expenses.length === 1 ? 'expense' : 'expenses'}`;
    if (!state.expenses.length) {
      holder.innerHTML = '<div class="empty-list"><span>₹</span><strong>No expenses yet</strong><small>Add your first expense above.</small></div>';
      return;
    }
    holder.innerHTML = state.expenses.map((expense, index) => `
      <article class="expense-item">
        <span class="expense-number">${String(index + 1).padStart(2, '0')}</span>
        <div class="expense-main"><strong>${escapeHTML(expense.name)}</strong><small>Paid by ${escapeHTML(memberName(expense.payerId))}</small></div>
        <div class="expense-side"><strong class="expense-amount">${money(expense.amount)}</strong><div class="expense-actions"><button type="button" data-edit-expense="${expense.id}">Edit</button><button type="button" class="delete-action" data-delete-expense="${expense.id}">Delete</button></div></div>
      </article>`).join('');
  }
  function renderReceipt() {
    const total = totals();
    const title = state.tourName.trim() || 'Tour';
    $('#previewTitle').textContent = `${title.toLocaleUpperCase('en-IN').replace(/\s+RECEIPT$/, '')} RECEIPT`;
    $('#receiptPreview').setAttribute('aria-label', `${title} receipt preview`);
    $('#previewMembersCount').textContent = `${state.members.length} ${state.members.length === 1 ? 'person' : 'people'}`;
    $('#previewBudget').textContent = money(total.budget);
    $('#previewSpent').textContent = money(total.spent);
    if (total.remaining < 0) {
      $('#remainingLabel').textContent = 'OVER BUDGET BY';
      $('#previewRemaining').textContent = money(Math.abs(total.remaining));
    } else {
      $('#remainingLabel').textContent = 'BUDGET REMAINING';
      $('#previewRemaining').textContent = money(total.remaining);
    }
    $('#previewTotalTable').textContent = money(total.spent);
    $('#previewExpenseRows').innerHTML = state.expenses.length ? state.expenses.map((expense, index) => `
      <tr><td>${String(index + 1).padStart(2, '0')}</td><td><strong>${escapeHTML(expense.name)}</strong></td><td>${escapeHTML(memberName(expense.payerId))}</td><td>${money(expense.amount)}</td></tr>`).join('') : '<tr class="empty-receipt-row"><td colspan="4">Your expenses will appear here.</td></tr>';
  }
  function renderAll() { renderExpenseList(); renderReceipt(); }
  function addMember() {
    if (state.members.length >= 30) return showToast('Maximum 30 members for one receipt.', true);
    nextMemberId = Math.max(nextMemberId, ...state.members.map(member => member.id + 1), 1);
    state.members.push({ id: nextMemberId++, name: '' });
    renderMembers(); renderAll();
    const input = $(`[data-member-id="${state.members[state.members.length - 1].id}"]`);
    input?.focus();
    showToast('Member added. Enter their name.');
  }
  function removeMember(id) {
    if (state.expenses.some(expense => Number(expense.payerId) === id)) return showToast('This member has an expense. Reassign or delete that expense first.', true);
    if (state.members.length <= 1) return showToast('Keep at least one group member.', true);
    state.members = state.members.filter(member => member.id !== id);
    renderMembers(); renderAll(); showToast('Member removed.');
  }
  function resetExpenseForm() {
    editingExpenseId = null;
    $('#expenseForm').reset();
    updatePayerOptions(state.members[0]?.id);
    $('#expenseSubmit').textContent = '＋ Add expense';
    $('#cancelEditButton').hidden = true;
    setError();
  }
  function addOrUpdateExpense(event) {
    event.preventDefault(); setError();
    const name = $('#expenseName').value.trim();
    const value = Number($('#expenseAmount').value);
    const payerId = Number($('#expensePayer').value);
    if (!name) return setError('Enter what you spent on, e.g. Auto or Lunch.');
    if (!Number.isFinite(value) || value <= 0 || value > 99999999) return setError('Enter a valid amount greater than zero.');
    if (!state.members.some(member => member.id === payerId)) return setError('Choose who paid for this expense.');
    const expense = { id: editingExpenseId ?? nextExpenseId++, name: name.slice(0, 100), amount: amount(value), payerId };
    if (editingExpenseId !== null) {
      const index = state.expenses.findIndex(item => item.id === editingExpenseId);
      if (index >= 0) state.expenses[index] = expense;
      showToast('Expense updated.');
    } else {
      state.expenses.push(expense);
      showToast('Expense added. Receipt updated live.');
    }
    resetExpenseForm(); renderAll();
  }
  function editExpense(id) {
    const expense = state.expenses.find(item => item.id === id);
    if (!expense) return;
    editingExpenseId = id;
    $('#expenseName').value = expense.name;
    $('#expenseAmount').value = String(expense.amount);
    updatePayerOptions(expense.payerId);
    $('#expenseSubmit').textContent = '✓ Update expense';
    $('#cancelEditButton').hidden = false;
    $('#expenseName').focus({ preventScroll: true });
    $('#expenseForm').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }
  function deleteExpense(id) {
    const expense = state.expenses.find(item => item.id === id);
    if (!expense) return;
    state.expenses = state.expenses.filter(item => item.id !== id);
    if (editingExpenseId === id) resetExpenseForm();
    renderAll(); showToast('Expense deleted. Totals updated.');
  }
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function safeFilename(value) {
    return String(value || 'tour-receipt').normalize('NFKD').replace(/[^\w\-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 65) || 'tour-receipt';
  }
  function exportJSON() {
    const payload = { version: 2, exportedAt: new Date().toISOString(), tourName: state.tourName, budgetAmount: state.budgetAmount, members: state.members, expenses: state.expenses, nextMemberId, nextExpenseId };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `${safeFilename(state.tourName)}.json`);
    showToast('Editable receipt backup exported.');
  }
  function exportCSV() {
    const fields = ['No.', 'Tour', 'Expense', 'Paid By', 'Amount INR'];
    const rows = state.expenses.map((expense, index) => [index + 1, state.tourName, expense.name, memberName(expense.payerId), amount(expense.amount).toFixed(2)]);
    const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [fields, ...rows].map(row => row.map(quote).join(',')).join('\r\n');
    downloadBlob(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), `${safeFilename(state.tourName)}-expenses.csv`);
    showToast('Expense list exported as CSV.');
  }
  async function importJSON(file) {
    if (!file) return;
    try {
      const source = JSON.parse(await file.text());
      if (!source || !Array.isArray(source.members) || !Array.isArray(source.expenses)) throw new Error('This does not look like a saved tour receipt.');
      if (source.members.length < 1 || source.members.length > 30) throw new Error('The file must contain 1–30 members.');
      const members = source.members.map((member, index) => {
        const id = Number(member.id);
        if (!Number.isInteger(id) || id < 1) throw new Error(`Member ${index + 1} has an invalid ID.`);
        return { id, name: String(member.name ?? '').slice(0, 70) };
      });
      const ids = new Set(members.map(member => member.id));
      if (ids.size !== members.length) throw new Error('Member IDs must be unique.');
      if (source.expenses.length > 10000) throw new Error('The file contains too many expenses.');
      const expenses = source.expenses.map((expense, index) => {
        const id = Number(expense.id), value = Number(expense.amount), payerId = Number(expense.payerId);
        if (!Number.isInteger(id) || id < 1 || !Number.isFinite(value) || value <= 0 || value > 99999999 || !ids.has(payerId)) throw new Error(`Expense ${index + 1} has invalid details.`);
        const name = String(expense.name ?? '').trim().slice(0, 100);
        if (!name) throw new Error(`Expense ${index + 1} needs a name.`);
        return { id, name, amount: amount(value), payerId };
      });
      let budgetAmount = Number(source.budgetAmount);
      if (!Number.isFinite(budgetAmount) || budgetAmount < 0 || budgetAmount > 999999999) throw new Error('The budget amount is invalid.');
      // Backward compatibility: older exports allowed a per-person budget.
      if (source.budgetMode === 'person') budgetAmount = amount(budgetAmount * members.length);
      if (!confirm('Import this receipt and replace the current entries? Export the current one first if you need a copy.')) return;
      state = { tourName: String(source.tourName ?? 'Bhubaneswar Tour').slice(0, 90), budgetAmount, members, expenses };
      nextMemberId = Math.max(Number(source.nextMemberId) || 1, ...members.map(member => member.id + 1));
      nextExpenseId = Math.max(Number(source.nextExpenseId) || 1, ...expenses.map(expense => expense.id + 1), 1);
      $('#tourName').value = state.tourName; $('#budgetAmount').value = String(state.budgetAmount);
      resetExpenseForm(); renderMembers(); renderAll(); showToast('Receipt imported.');
    } catch (error) { showToast(error?.message || 'Could not import this file.', true); }
    finally { $('#importJsonInput').value = ''; }
  }
  function freshReceipt() {
    if (!confirm('Start a new receipt? Current entries will be cleared from this page. Export JSON first if you need them.')) return;
    state = freshState(); nextMemberId = 5; nextExpenseId = 1;
    $('#tourName').value = state.tourName; $('#budgetAmount').value = String(state.budgetAmount);
    resetExpenseForm(); renderMembers(); renderAll(); showToast('A fresh receipt is ready.');
  }
  function bindEvents() {
    $('#tourName').addEventListener('input', event => { state.tourName = event.target.value.slice(0, 90); renderReceipt(); });
    $('#budgetAmount').addEventListener('input', event => { state.budgetAmount = Math.max(0, Number(event.target.value) || 0); renderReceipt(); });
    $('#addMemberButton').addEventListener('click', addMember);
    $('#membersList').addEventListener('input', event => {
      const input = event.target.closest('[data-member-id]'); if (!input) return;
      const member = state.members.find(item => item.id === Number(input.dataset.memberId)); if (!member) return;
      member.name = input.value.slice(0, 70); const cursor = input.selectionStart;
      updatePayerOptions(); input.focus({ preventScroll: true });
      try { input.setSelectionRange(cursor, cursor); } catch (_) {}
      renderAll();
    });
    $('#membersList').addEventListener('click', event => { const button = event.target.closest('[data-remove-member]'); if (button) removeMember(Number(button.dataset.removeMember)); });
    $('#expenseForm').addEventListener('submit', addOrUpdateExpense);
    $('#cancelEditButton').addEventListener('click', resetExpenseForm);
    $('#expenseList').addEventListener('click', event => {
      const edit = event.target.closest('[data-edit-expense]'); if (edit) return editExpense(Number(edit.dataset.editExpense));
      const del = event.target.closest('[data-delete-expense]'); if (del) deleteExpense(Number(del.dataset.deleteExpense));
    });
    $('#clearExpensesButton').addEventListener('click', () => {
      if (!state.expenses.length) return showToast('There are no expenses to clear.');
      if (!confirm('Clear all expenses? Tour name, budget and member names will stay.')) return;
      state.expenses = []; resetExpenseForm(); renderAll(); showToast('All expense entries cleared.');
    });
    const printReceipt = () => window.print();
    $('#printButton').addEventListener('click', printReceipt);
    $('#mobilePrintButton').addEventListener('click', printReceipt);
    $('#mobilePreviewButton').addEventListener('click', () => $('#previewToolbar').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }));
    $('#exportJsonButton').addEventListener('click', exportJSON);
    $('#exportCsvButton').addEventListener('click', exportCSV);
    $('#importJsonButton').addEventListener('click', () => $('#importJsonInput').click());
    $('#importJsonInput').addEventListener('change', event => importJSON(event.target.files?.[0]));
    $('#resetTourButton').addEventListener('click', freshReceipt);
    $('#helpButton').addEventListener('click', () => $('#helpDialog').showModal());
    $('#helpDialog').addEventListener('click', event => { if (event.target === $('#helpDialog')) $('#helpDialog').close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('#helpDialog').open) $('#helpDialog').close(); });
  }
  function init() {
    renderMembers(); bindEvents(); renderAll();
    if ('serviceWorker' in navigator && (window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {});
    }
  }
  document.addEventListener('DOMContentLoaded', init);
})();
