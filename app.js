(() => {
  'use strict';

  const PROFILE_KEY = 'ufs_profile_v1';
  const states = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
  ];

  const forms = [
    {id:'admission', name:'Admission Form', type:'Education', icon:'graduation-cap', accent:'#7154F4', tint:'#EEE9FF', description:'Student, institute, school and coaching admission paperwork.', detail:'Student and guardian fields, organization branding, photo area, declarations and signature sections — shaped around your sample.'},
    {id:'fees', name:'Fees Receipt', type:'Education', icon:'receipt-text', accent:'#D95D45', tint:'#FFE9E2', description:'A clear, professional receipt for fees and other payments.', detail:'Receipt number, payment details and totals will be arranged to match your reference. No payment ledger or financial records will be stored.'},
    {id:'admit', name:'Admit Card', type:'Examination', icon:'contact-round', accent:'#168C80', tint:'#DDF8F2', description:'Exam entry cards, coaching tests and hall tickets.', detail:'Candidate identity, roll number, exam information, instructions and signature areas — using your chosen structure.'},
    {id:'report', name:'Report Card', type:'Education', icon:'chart-no-axes-column-increasing', accent:'#B27A12', tint:'#FFF1C9', description:'Subject-wise marks, grades and academic summaries.', detail:'Marks tables, totals, grading rules and remarks will be customized after reviewing your report-card sample.'},
    {id:'invoice', name:'Business Invoice', type:'Business', icon:'file-spreadsheet', accent:'#596FE8', tint:'#E7EAFF', description:'Itemized bills for products, services and small businesses.', detail:'Business identity, client details, item rows, totals and optional tax fields. Tax compliance will need separate verification.'},
    {id:'receipt', name:'Any Bill / Receipt', type:'General', icon:'file-check-2', accent:'#D24D96', tint:'#FFE4F2', description:'A flexible base for custom bills, vouchers and receipts.', detail:'A purpose-built document that can use the labels, fields and table structure you actually need.'}
  ];

  const iconPaths = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    sparkles:'<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z"/><path d="m5 2 .8 2.2L8 5l-2.2.8L5 8l-.8-2.2L2 5l2.2-.8z"/>',
    sliders:'<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="10" y1="8" x2="14" y2="8"/><line x1="18" y1="16" x2="22" y2="16"/>',
    'circle-help':'<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 4.8.8c0 1.7-2.4 2-2.4 3.7"/><path d="M12 17h.01"/>',
    'shield-check':'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
    'more-horizontal':'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    menu:'<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
    'calendar-days':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/><path d="M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01"/>',
    'wand-sparkles':'<path d="m15 4 5 5M4 20l11-11"/><path d="m14 5 5 5"/><path d="m5 4 1.2 2.8L9 8l-2.8 1.2L5 12l-1.2-2.8L1 8l2.8-1.2z"/><path d="m18 14 .9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>' ,
    'arrow-up-right':'<path d="M7 17 17 7M7 7h10v10"/>',
    'arrow-right':'<path d="M5 12h14M12 5l7 7-7 7"/>',
    'file-check-2':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 15l2 2 5-5"/>',
    'scan-line':'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M3 12h18"/>',
    'image-plus':'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21M16 5h5M18.5 2.5v5"/>',
    route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h6a3 3 0 0 0 0-6h-6a3 3 0 0 1 0-6h6"/><circle cx="18" cy="5" r="3"/>',
    'graduation-cap':'<path d="m2 10 10-5 10 5-10 5z"/><path d="M6 12v5c4 3 8 3 12 0v-5M22 10v6"/>',
    'receipt-text':'<path d="M4 2 6 4l3-2 3 2 3-2 3 2 2-2v20l-3-2-3 2-3-2-3 2-2-2z"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    'contact-round':'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M5.5 16a3.5 3.5 0 0 1 7 0M15 8h3M15 12h3M15 16h3"/>',
    'chart-no-axes-column-increasing':'<path d="M3 3v18h18"/><path d="M8 16v-4M13 16V8M18 16V5"/>',
    'file-spreadsheet':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 12h8M8 16h8M12 12v7"/>',
    'calendar-check':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 16l2 2 4-4"/>',
    'arrow-down':'<path d="M12 5v14M19 12l-7 7-7-7"/>',
    'palette':'<path d="M12 3a9 9 0 1 0 0 18h1.4a1.8 1.8 0 0 0 1.2-3.1 1.8 1.8 0 0 1 1.2-3.1H18a3 3 0 0 0 3-3c0-4.9-4-8.8-9-8.8Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="6.5" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    files:'<path d="M15 2H6a2 2 0 0 0-2 2v14"/><path d="M18 6h-9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z"/><path d="M14 6V2l6 6"/>',
    'panels-top-left':'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    printer:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6zM18 12h.01"/>',
    'message-circle':'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    'check-circle-2':'<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>',
    'user-round':'<circle cx="12" cy="8" r="4"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/>',
    smartphone:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    zap:'<path d="m13 2-3 8H4l7 12 3-8h6z"/>',
    'wifi-off':'<path d="M3 3l18 18M10.6 10.6a3 3 0 0 1 3.8 3.8M5 9a11 11 0 0 1 2-1.5M9 5.5A16 16 0 0 1 21 9M2 5c1-.7 2-1.2 3-1.5M2 13c1.5-1 3.2-1.7 5-2M12 20h.01"/>',
    'database-zap':'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3M20 5v5M4 11v6c0 1.7 3.6 3 8 3"/><path d="m19 13-3 5h4l-3 4"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    x:'<path d="m18 6-12 12M6 6l12 12"/>',
    'cloud-off':'<path d="m2 2 20 20M5 5a7 7 0 0 1 12 4M5 12H4a4 4 0 0 0 2 7h10M16 16a4 4 0 0 0 2 3h1a3 3 0 0 0 1-5.8"/>',
    'file-text':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    'circle-check':'<circle cx="12" cy="12" r="10"/><path d="m8 12 2.5 2.5L16 9"/>',
    'external-link':'<path d="M15 3h6v6M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'arrow-left':'<path d="M19 12H5M12 19l-7-7 7-7"/>',
    'clock':'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'file-plus':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 12v6M9 15h6"/>',
    'circle-plus':'<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>',
    'check-square':'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m7 12 3 3 7-7"/>',
    'book-open':'<path d="M12 7v14M3 18V5a1 1 0 0 1 1-1h3a5 5 0 0 1 5 5 5 5 0 0 1 5-5h3a1 1 0 0 1 1 1v13h-4a5 5 0 0 0-5 3 5 5 0 0 0-5-3z"/>',
    'list-check':'<path d="m3 6 2 2 4-4M3 13l2 2 4-4M3 20l2 2 4-4M13 6h8M13 13h8M13 20h8"/>',
    'heart-handshake':'<path d="M8.5 11.5 12 15a3 3 0 0 0 4 0l3-3"/><path d="m8 11 3-3a3 3 0 0 1 4 0l2 2"/><path d="M2 12V5l5-3 5 3M22 12V5l-5-3-3 2"/><path d="m2 12 5 8a2 2 0 0 0 3 0l2-2 2 1a2 2 0 0 0 3-2l2-3"/>' ,
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'
  };

  let profile = null;
  let deferredInstallPrompt = null;
  let installAvailable = false;
  let forcedProfileSetup = false;
  let activeFilter = 'All';
  let lastFocused = null;
  let toastTimer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function icon(name, className = '') {
    const path = iconPaths[name] || iconPaths['file-text'];
    return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  }
  function fillIcons(root = document) {
    $$('[data-icon]', root).forEach(el => {
      const name = el.getAttribute('data-icon');
      el.innerHTML = iconPaths[name] ? icon(name) : icon('file-text');
      el.removeAttribute('data-icon');
    });
  }

  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.name === 'string' && typeof parsed.state === 'string') return parsed;
    } catch (error) {
      console.warn('Profile preferences are unavailable in this browser.', error);
    }
    return null;
  }
  function persistProfile(nextProfile) {
    profile = {name: nextProfile.name.trim(), state: nextProfile.state};
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
    catch (error) { console.warn('Could not persist local profile.', error); }
    updateProfileUI();
  }
  function clearProfile() {
    profile = null;
    try { localStorage.removeItem(PROFILE_KEY); } catch (error) { console.warn(error); }
    updateProfileUI();
  }
  function initials(name) {
    const trimmed = (name || 'U').trim();
    return trimmed.split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || 'U';
  }
  function updateProfileUI() {
    const name = profile?.name || 'Your profile';
    const state = profile?.state || 'Set up your space';
    $('#sidebarAvatar').textContent = initials(profile?.name || 'U');
    $('#topAvatar').textContent = initials(profile?.name || 'U');
    $('#sidebarName').textContent = name;
    $('#sidebarState').textContent = state;
    const firstName = (profile?.name || '').trim().split(/\s+/)[0];
    $('#welcomeTitle').innerHTML = profile?.name ? `Hey, ${escapeHTML(firstName)}! <span>Let’s make it happen.</span>` : `Hey there, <span>let’s make it happen.</span>`;
    $('#welcomeSubtitle').textContent = profile?.state ? `A fresh space for ${profile.state}. What are we creating today?` : 'Beautiful paperwork starts here. What are we creating today?';
    const settingsName = $('#settingsName');
    const settingsState = $('#settingsState');
    if (settingsName && document.activeElement !== settingsName) settingsName.value = profile?.name || '';
    if (settingsState) settingsState.value = profile?.state || '';
  }
  function populateStateSelect(select) {
    if (!select) return;
    select.innerHTML = `<option value="">Choose your state / UT</option>` + states.map(state => `<option value="${escapeHTML(state)}">${escapeHTML(state)}</option>`).join('');
  }

  function categoryCard(form, context = 'dashboard') {
    const status = form.id === 'custom' ? 'MAKE YOUR OWN' : 'SAMPLE NEEDED';
    return `<button class="category-card" type="button" data-formid="${form.id}" style="--accent:${form.accent};--tint:${form.tint}" aria-label="Explore ${escapeHTML(form.name)}">
      <span class="category-topline"><span class="category-icon">${icon(form.icon)}</span><span class="category-status">${status}</span></span>
      <h3>${escapeHTML(form.name)}</h3><p>${escapeHTML(form.description)}</p>
      <span class="category-bottom"><span>${form.id === 'custom' ? 'Build your brief' : 'Explore this form'}</span><span class="arrow-circle">${icon('arrow-up-right')}</span></span>
    </button>`;
  }
  function renderCategories() {
    const custom = {id:'custom', name:'Something else', type:'General', icon:'file-plus', accent:'#647b30', tint:'#EFFBD9', description:'Have a document idea that doesn’t fit these categories?'};
    $('#dashboardCategories').innerHTML = forms.map(form => categoryCard(form)).join('') + categoryCard(custom);
    renderLibrary();
  }
  function renderLibrary() {
    const query = ($('#librarySearch')?.value || $('#globalSearch')?.value || '').trim().toLowerCase();
    const filtered = forms.filter(form => {
      const matchesFilter = activeFilter === 'All' || form.type === activeFilter || (activeFilter === 'Education' && form.type === 'Examination');
      const matchesQuery = !query || `${form.name} ${form.type} ${form.description}`.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
    const custom = {id:'custom', name:'Something else', type:'General', icon:'file-plus', accent:'#647b30', tint:'#EFFBD9', description:'Need a different kind of form? Start by describing it.'};
    const customMatchesFilter = activeFilter === 'All' || activeFilter === 'General';
    const customMatchesQuery = !query || `${custom.name} ${custom.description}`.toLowerCase().includes(query);
    const items = filtered.concat(customMatchesFilter && customMatchesQuery ? [custom] : []);
    $('#libraryCategories').innerHTML = items.length ? items.map(form => categoryCard(form, 'library')).join('') : `<div class="empty-results">${icon('search')}<strong>No matching categories</strong><p>Try another search term or choose “All forms”.</p></div>`;
    fillIcons($('#libraryCategories'));
  }
  function setDate() {
    const now = new Date();
    $('#todayDate').textContent = new Intl.DateTimeFormat('en-IN', {weekday:'short', day:'numeric', month:'short'}).format(now);
  }

  function switchView(viewName) {
    const safeView = ['dashboard', 'library', 'process', 'preferences'].includes(viewName) ? viewName : 'dashboard';
    $$('.view').forEach(view => view.classList.toggle('is-visible', view.dataset.view === safeView));
    $$('[data-nav]').forEach(link => link.classList.toggle('is-active', link.dataset.nav === safeView));
    const titles = {dashboard:'Dashboard', library:'Form library', process:'Design process', preferences:'Preferences'};
    $('#crumbCurrent').textContent = titles[safeView];
    $('#sidebar').classList.remove('is-open');
    $('#mobileScrim').classList.remove('is-visible');
    $('#mobileMenu').setAttribute('aria-expanded', 'false');
    if (safeView === 'library') renderLibrary();
    window.scrollTo({top:0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }

  function openModal(content, options = {}) {
    lastFocused = document.activeElement;
    forcedProfileSetup = Boolean(options.force);
    $('#modal').classList.toggle('modal-wide', Boolean(options.wide));
    $('#modalBackdrop').classList.toggle('welcome-backdrop', Boolean(options.welcome));
    $('#modal').classList.toggle('welcome-panel', Boolean(options.welcome));
    $('#modalContent').innerHTML = content;
    $('#modalClose').hidden = Boolean(options.force);
    $('#modalBackdrop').hidden = false;
    document.body.style.overflow = 'hidden';
    fillIcons($('#modalContent'));
    const focusTarget = $('#modalContent input, #modalContent select, #modalContent button, #modalContent textarea');
    window.setTimeout(() => (focusTarget || $('#modal')).focus(), 30);
  }
  function closeModal(force = false) {
    if (forcedProfileSetup && !force) return;
    $('#modalBackdrop').hidden = true;
    $('#modalBackdrop').classList.remove('welcome-backdrop');
    $('#modal').classList.remove('welcome-panel', 'modal-wide');
    document.body.style.overflow = '';
    forcedProfileSetup = false;
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }
  function showToast(message, iconName = 'check-circle-2') {
    const region = $('#toastRegion');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${icon(iconName)}<span>${escapeHTML(message)}</span>`;
    region.appendChild(toast);
    window.setTimeout(() => {
      toast.classList.add('is-leaving');
      window.setTimeout(() => toast.remove(), 230);
    }, 3200);
  }

  function showProfileModal(isWelcome = false) {
    const existing = profile || {name:'', state:''};
    const heading = isWelcome
      ? `<div class="welcome-banner"><div class="welcome-brand"><span class="brand-mark"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M11 10.5h18v5H16.2v4.1h11.1v4.8H16.2v5.1H11z" fill="currentColor"/><path d="M27.8 8.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2" fill="#D8FF80"/></svg></span>formstudio.</div><h2 id="modalTitle">First, let’s make this <span>your space.</span></h2><p>No login. No account. Just your name and state to personalize the dashboard.</p></div>`
      : `<div class="modal-icon">${icon('user-round')}</div><h2 id="modalTitle">Your <span>display profile.</span></h2><p>Update your name or state. These preferences stay in this browser only.</p>`;
    const content = `${heading}<form id="profileModalForm" class="welcome-form" autocomplete="on"><label for="modalName">What should we call you?</label><input id="modalName" name="name" maxlength="60" placeholder="Your name" required value="${escapeHTML(existing.name)}"><label for="modalState">Which state or Union Territory?</label><select id="modalState" name="state" required></select><button class="button button-primary" type="submit">${icon('sparkles')} ${isWelcome ? 'Make it mine' : 'Save preferences'} ${icon('arrow-right')}</button><div class="privacy-note">${icon('shield-check')}<span>Your profile is saved only in this browser. No form data, bills or receipts are saved by this app.</span></div></form>`;
    openModal(content, {force:isWelcome, welcome:isWelcome, wide:false});
    populateStateSelect($('#modalState'));
    $('#modalState').value = existing.state || '';
    $('#modalName').focus();
  }

  function showCreateChooser() {
    const content = `<div class="modal-icon">${icon('wand-sparkles')}</div><h2 id="modalTitle">What are we <span>making today?</span></h2><p>Pick a starting point. We’ll build the actual template around the real sample you send — no random form design.</p><div class="modal-category-grid">${forms.map(form => `<button class="modal-category" type="button" data-formid="${form.id}" style="--accent:${form.accent};--tint:${form.tint}"><span class="category-icon" style="background:${form.tint};color:${form.accent}">${icon(form.icon)}</span><span><strong>${escapeHTML(form.name)}</strong><small>${escapeHTML(form.type)}</small></span>${icon('arrow-up-right')}</button>`).join('')}<button class="modal-category" type="button" data-formid="custom" style="--accent:#647b30;--tint:#EFFBD9"><span class="category-icon" style="background:#EFFBD9;color:#647b30">${icon('file-plus')}</span><span><strong>Custom document</strong><small>Something else</small></span>${icon('arrow-up-right')}</button></div>`;
    openModal(content, {wide:true});
  }

  function showFormIntro(formId) {
    // The first real reference is now an editable template, not a placeholder brief.
    if (formId === 'admission') {
      window.location.href = './builder.html?template=admission';
      return;
    }
    if (formId === 'custom') {
      window.location.href = './builder.html?template=custom';
      return;
    }
    const form = forms.find(item => item.id === formId);
    if (!form) return;
    const content = `<div class="modal-icon" style="background:${form.tint};color:${form.accent}">${icon(form.icon)}</div><div class="eyebrow eyebrow-muted">${escapeHTML(form.type.toUpperCase())} / TEMPLATE BRIEF</div><h2 id="modalTitle">${escapeHTML(form.name)}<br><span>starts with your sample.</span></h2><p>${escapeHTML(form.detail)}</p><div class="feature-list"><div class="feature-row"><span>${icon('image-plus')}</span><div><b>Bring your reference</b><small>Photo, screenshot or PDF of the form you want us to recreate or improve.</small></div></div><div class="feature-row"><span>${icon('sliders-horizontal')}</span><div><b>Keep it editable</b><small>Organization name, logo, fields, labels and layout will be designed to be customizable.</small></div></div><div class="feature-row"><span>${icon('printer')}</span><div><b>Design for real output</b><small>We’ll account for A4 spacing and print/PDF behavior from the beginning.</small></div></div></div><div class="modal-actions"><button class="button button-primary" data-action="sample-guide">${icon('image-plus')} How to share the sample</button><button class="button button-quiet" data-action="back-to-library">Back to categories</button></div><div class="privacy-note">${icon('shield-check')}<span>This dashboard does not create or save a form record yet. The template will be designed after you share its sample in this chat.</span></div>`;
    openModal(content, {wide:false});
  }

  function showCustomBrief() {
    const content = `<div class="modal-icon">${icon('file-plus')}</div><h2 id="modalTitle">Let’s make something <span>specific.</span></h2><p>Describe the document you need. This brief is temporary and won’t be saved in the app.</p><form id="customBriefForm" class="modal-form-grid"><label class="full" for="customTitle">Document name<input id="customTitle" name="title" required maxlength="70" placeholder="e.g. Library card, stock issue slip"></label><label for="customAudience">Used by<select id="customAudience" name="audience"><option>School / coaching</option><option>Business</option><option>Office / organization</option><option>Personal use</option><option>Other</option></select></label><label for="customOutput">Final output<select id="customOutput" name="output"><option>A4 print / PDF</option><option>Small receipt</option><option>ID card</option><option>Multiple cards per page</option><option>Not sure yet</option></select></label><label class="full" for="customNotes">What should it include? (optional)<textarea id="customNotes" name="notes" maxlength="400" placeholder="Fields, tables, sections, signatures..."></textarea></label><div class="full modal-actions"><button class="button button-primary" type="submit">Prepare design brief ${icon('arrow-right')}</button><button class="button button-quiet" type="button" data-action="back-to-library">Cancel</button></div></form>`;
    openModal(content, {wide:false});
  }

  function showSampleGuide() {
    const content = `<div class="modal-icon">${icon('image-plus')}</div><h2 id="modalTitle">Good references make <span>great forms.</span></h2><p>Send the reference directly in this ChatGPT conversation, not inside this standalone dashboard. We’ll use it to design your first actual form.</p><div class="feature-list"><div class="feature-row"><span>${icon('image')}</span><div><b>Photo or screenshot</b><small>Keep the whole page visible and try to avoid blur or glare.</small></div></div><div class="feature-row"><span>${icon('file-text')}</span><div><b>PDF or existing document</b><small>Upload the document if you have it; mention which parts must stay the same.</small></div></div><div class="feature-row"><span>${icon('palette')}</span><div><b>Tell me what to improve</b><small>For example: more readable, better spacing, stronger branding, editable fields or print-friendly layout.</small></div></div></div><div class="modal-actions"><button class="button button-primary" data-action="back-to-library">Got it <span>${icon('check')}</span></button></div>`;
    openModal(content);
  }

  function showHelp() {
    const content = `<div class="modal-icon">${icon('circle-help')}</div><h2 id="modalTitle">Quick help, <span>no fuss.</span></h2><p>This version is the working dashboard and installable app shell. The actual form designs will be added one at a time from your samples.</p><div class="feature-list"><div class="feature-row"><span>${icon('user-round')}</span><div><b>Personalized welcome</b><small>Your name and state are stored locally in this browser only.</small></div></div><div class="feature-row"><span>${icon('file-check-2')}</span><div><b>No saved records</b><small>This version does not save generated forms, students, bills or payments.</small></div></div><div class="feature-row"><span>${icon('download')}</span><div><b>Installable when supported</b><small>Host over HTTPS, open it in a supported browser, then tap Install app. Offline shell is cached after the first successful load.</small></div></div></div><div class="modal-actions"><button class="button button-primary" data-action="sample-guide">How to share a form sample</button><button class="button button-quiet" data-action="back-to-library">Explore categories</button></div>`;
    openModal(content);
  }

  function showInstallGuide() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (standalone) {
      showToast('Universal Form Studio is already installed.', 'check-circle-2');
      return;
    }
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(choice => {
        if (choice?.outcome === 'accepted') {
          showToast('App installation started.', 'download');
          setInstallStatus('Installation accepted by your browser.');
        } else {
          showToast('No problem — you can install it any time.', 'smartphone');
        }
        deferredInstallPrompt = null;
        updateInstallButton();
      }).catch(() => {
        showManualInstallGuide();
      });
      return;
    }
    showManualInstallGuide();
  }
  function showManualInstallGuide() {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);
    const steps = isIOS
      ? 'Open this site in Safari, tap Share, then choose “Add to Home Screen”.'
      : isAndroid
        ? 'Open this site in Chrome. Use the browser menu (⋮) and choose “Install app” or “Add to Home screen” if shown.'
        : 'Open the deployed HTTPS site in Chrome or Edge and use the browser’s Install app option, or the install icon in the address bar if it appears.';
    openModal(`<div class="modal-icon">${icon('download')}</div><h2 id="modalTitle">Install it on <span>your device.</span></h2><p>${escapeHTML(steps)}</p><div class="feature-list"><div class="feature-row"><span>${icon('check-circle-2')}</span><div><b>Use the deployed website</b><small>Progressive Web App installation requires HTTPS (localhost is allowed for development).</small></div></div><div class="feature-row"><span>${icon('wifi-off')}</span><div><b>First load needs internet</b><small>After the first successful load, the core app shell is available offline; external font downloads may not be.</small></div></div></div><div class="modal-actions"><button class="button button-primary" data-action="back-to-library">Understood ${icon('check')}</button></div>`);
  }
  function setInstallStatus(message) {
    const status = $('#installStatus');
    if (status) status.textContent = message;
  }
  function updateInstallButton() {
    const installed = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const button = $('#installButton');
    const label = $('#installButtonText');
    if (installed) {
      label.textContent = 'App installed';
      button.disabled = true;
      button.setAttribute('aria-label', 'App already installed');
      setInstallStatus('Universal Form Studio is installed on this device.');
    } else {
      label.textContent = 'Install app';
      button.disabled = false;
      button.setAttribute('aria-label', 'Install Universal Form Studio');
    }
    if (installAvailable && !installed) setInstallStatus('Your browser supports the one-tap install prompt.');
  }

  function syncSearch(query, source = 'global') {
    const value = query || '';
    if (source === 'global') {
      const librarySearch = $('#librarySearch');
      if (librarySearch) librarySearch.value = value;
      if (value.trim()) {
        if (!$('#view-library').classList.contains('is-visible')) switchView('library');
        renderLibrary();
      } else if ($('#view-library').classList.contains('is-visible')) renderLibrary();
      else renderCategoriesSearch();
    } else {
      const globalSearch = $('#globalSearch');
      if (globalSearch) globalSearch.value = value;
      renderLibrary();
    }
  }
  function renderCategoriesSearch() {
    const query = ($('#globalSearch')?.value || '').trim().toLowerCase();
    const filtered = forms.filter(form => !query || `${form.name} ${form.type} ${form.description}`.toLowerCase().includes(query));
    const custom = {id:'custom', name:'Something else', type:'General', icon:'file-plus', accent:'#647b30', tint:'#EFFBD9', description:'Have a document idea that doesn’t fit these categories?'};
    $('#dashboardCategories').innerHTML = filtered.map(form => categoryCard(form)).join('') + (!query || custom.name.toLowerCase().includes(query) ? categoryCard(custom) : '');
    fillIcons($('#dashboardCategories'));
  }

  function handleAction(action) {
    switch (action) {
      case 'create-form': showCreateChooser(); break;
      case 'edit-profile': showProfileModal(false); break;
      case 'help': showHelp(); break;
      case 'sample-guide': showSampleGuide(); break;
      case 'custom-form': showCustomBrief(); break;
      case 'back-to-library': closeModal(true); switchView('library'); break;
      default: break;
    }
  }

  function bindEvents() {
    document.addEventListener('click', event => {
      const nav = event.target.closest('[data-nav]');
      if (nav) {
        event.preventDefault();
        switchView(nav.dataset.nav);
        return;
      }
      const action = event.target.closest('[data-action]');
      if (action) {
        handleAction(action.dataset.action);
        return;
      }
      const formCard = event.target.closest('[data-formid]');
      if (formCard) {
        showFormIntro(formCard.dataset.formid);
        return;
      }
    });

    $('#modalContent').addEventListener('submit', event => {
      if (event.target.id === 'profileModalForm') {
        event.preventDefault();
        const form = new FormData(event.target);
        const name = String(form.get('name') || '').trim();
        const state = String(form.get('state') || '').trim();
        if (!name || !state) return showToast('Please enter your name and state.', 'circle-help');
        persistProfile({name, state});
        closeModal(true);
        showToast(`Welcome, ${name.split(/\s+/)[0]}! Your space is ready.`, 'sparkles');
        if ($('#settingsName')) $('#settingsName').value = name;
        if ($('#settingsState')) $('#settingsState').value = state;
      }
      if (event.target.id === 'customBriefForm') {
        event.preventDefault();
        const form = new FormData(event.target);
        const title = String(form.get('title') || '').trim();
        const audience = String(form.get('audience') || '').trim();
        const output = String(form.get('output') || '').trim();
        const notes = String(form.get('notes') || '').trim();
        if (!title) return showToast('Please add a document name.', 'circle-help');
        const content = `<div class="modal-icon">${icon('check-circle-2')}</div><div class="eyebrow eyebrow-muted">DESIGN BRIEF PREPARED — NOT SAVED</div><h2 id="modalTitle">Nice. That’s a <span>clear starting point.</span></h2><p>Nothing has been saved in the app. Use the summary below when you share the document sample in this ChatGPT conversation.</p><div class="feature-list"><div class="feature-row"><span>${icon('file-text')}</span><div><b>${escapeHTML(title)}</b><small>Document name</small></div></div><div class="feature-row"><span>${icon('users')}</span><div><b>${escapeHTML(audience)}</b><small>Intended use</small></div></div><div class="feature-row"><span>${icon('printer')}</span><div><b>${escapeHTML(output)}</b><small>Preferred output</small></div></div>${notes ? `<div class="feature-row"><span>${icon('list-check')}</span><div><b>Notes</b><small>${escapeHTML(notes)}</small></div></div>` : ''}</div><div class="modal-actions"><button class="button button-primary" id="copyBriefButton" type="button">${icon('file-text')} Copy brief</button><button class="button button-quiet" data-action="sample-guide">Sample tips</button></div>`;
        openModal(content);
        $('#copyBriefButton').addEventListener('click', async () => {
          const brief = `Universal Form Studio — design brief\nDocument: ${title}\nUse: ${audience}\nOutput: ${output}${notes ? `\nRequirements: ${notes}` : ''}\nPlease design it from the sample I will attach. Keep fields and branding editable; no app-side records are needed.`;
          try {
            await navigator.clipboard.writeText(brief);
            showToast('Design brief copied. Nothing was saved.', 'check-circle-2');
          } catch (error) {
            const temp = document.createElement('textarea'); temp.value = brief; document.body.appendChild(temp); temp.select();
            try { document.execCommand('copy'); showToast('Design brief copied. Nothing was saved.', 'check-circle-2'); }
            catch (copyError) { showToast('Clipboard access is unavailable here. You can select and copy the brief manually.', 'circle-help'); }
            temp.remove();
          }
        });
      }
    });

    $('#modalClose').addEventListener('click', () => closeModal());
    $('#modalBackdrop').addEventListener('click', event => { if (event.target === $('#modalBackdrop')) closeModal(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (!$('#modalBackdrop').hidden && !forcedProfileSetup) closeModal();
        else if ($('#sidebar').classList.contains('is-open')) toggleMobileMenu(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (window.innerWidth <= 620) $('.searchbox').classList.add('is-expanded');
        $('#globalSearch').focus();
      }
    });

    $('.searchbox').addEventListener('click', event => {
      if (window.innerWidth <= 620 && !$('.searchbox').classList.contains('is-expanded')) {
        event.preventDefault();
        $('.searchbox').classList.add('is-expanded');
        $('#globalSearch').focus();
      }
    });
    $('#globalSearch').addEventListener('blur', () => {
      if (window.innerWidth <= 620 && !$('#globalSearch').value.trim()) window.setTimeout(() => $('.searchbox').classList.remove('is-expanded'), 120);
    });
    $('#globalSearch').addEventListener('input', event => syncSearch(event.target.value, 'global'));
    $('#librarySearch').addEventListener('input', event => syncSearch(event.target.value, 'library'));
    $$('.filter-tab').forEach(tab => tab.addEventListener('click', () => {
      activeFilter = tab.dataset.filter;
      $$('.filter-tab').forEach(other => other.classList.toggle('is-active', other === tab));
      renderLibrary();
    }));
    $('#installButton').addEventListener('click', showInstallGuide);
    $('#settingsInstall').addEventListener('click', showInstallGuide);
    $('#mobileMenu').addEventListener('click', () => toggleMobileMenu());
    $('#mobileScrim').addEventListener('click', () => toggleMobileMenu(false));
    $('#profileForm').addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.target);
      const name = String(form.get('name') || '').trim();
      const state = String(form.get('state') || '').trim();
      if (!name || !state) return showToast('Please enter your name and state.', 'circle-help');
      persistProfile({name, state});
      showToast('Your profile preferences have been updated.', 'check-circle-2');
    });
    $('#resetProfile').addEventListener('click', () => {
      if (window.confirm('Clear your locally stored name and state? No forms or other records are stored by this app.')) {
        clearProfile();
        showToast('Your local profile has been cleared.', 'check-circle-2');
      }
    });
  }

  function toggleMobileMenu(force) {
    const next = typeof force === 'boolean' ? force : !$('#sidebar').classList.contains('is-open');
    $('#sidebar').classList.toggle('is-open', next);
    $('#mobileScrim').classList.toggle('is-visible', next);
    $('#mobileMenu').setAttribute('aria-expanded', String(next));
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      setInstallStatus('This browser does not support service workers, so offline caching is unavailable.');
      return;
    }
    if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      setInstallStatus('Serve the app over HTTPS to enable installation and offline caching.');
      return;
    }
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', {scope:'./'})
        .then(registration => {
          registration.addEventListener('updatefound', () => {
            const worker = registration.installing;
            if (!worker) return;
            worker.addEventListener('statechange', () => {
              if (worker.state === 'installed' && navigator.serviceWorker.controller) showToast('An app update is ready. Reload to use the latest version.', 'check-circle-2');
            });
          });
          if (navigator.serviceWorker.controller) setInstallStatus('Offline app shell is active for this browser.');
          else setInstallStatus('App shell will be cached for offline use after this load completes.');
        })
        .catch(error => {
          console.warn('Service worker registration failed.', error);
          setInstallStatus('Offline caching could not be enabled. Check that sw.js is deployed beside index.html.');
        });
    });
  }

  function init() {
    fillIcons(document);
    populateStateSelect($('#settingsState'));
    profile = loadProfile();
    updateProfileUI();
    setDate();
    renderCategories();
    bindEvents();
    updateInstallButton();
    registerServiceWorker();

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      deferredInstallPrompt = event;
      installAvailable = true;
      updateInstallButton();
    });
    window.addEventListener('appinstalled', () => {
      deferredInstallPrompt = null;
      installAvailable = false;
      updateInstallButton();
      showToast('Universal Form Studio has been installed.', 'check-circle-2');
    });
    if (!profile?.name || !profile?.state) showProfileModal(true);
  }

  init();
})();
