(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const appLogo = './assets/ev-logo.png';
  const query = new URLSearchParams(location.search);
  const templateKind = query.get('template') || 'admission';
  let toastTimeout = null;
  let uploadedLogo = null;

  const id = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  const field = (label, width = 'full', type = 'line', extra = {}) => ({ id:id('field'), label, width, type, options:'Option 1, Option 2', ...extra });
  const section = (title, fields = [], note = '', extra = {}) => ({ id:id('section'), title, fields, note, ...extra });

  function defaultDesign(kind = 'admission') {
    if (kind === 'custom') {
      return {
        templateKind:'custom',
        brand:{
          orgName:'YOUR ORGANIZATION', orgAddress:'', orgContact:'', docTitle:'CUSTOM FORM',
          applicationLabel:'Reference No.', dateLabel:'Date', footerText:'', signatureLeft:'Applicant Signature',
          signatureRight:'Authorized Signature', officeDateLabel:'Date:', officeUseLabel:'For Office Use:'
        },
        style:{headerColor:'#142f66',accentColor:'#2454a6',bandColor:'#dce8fb',titleInk:'#142f66',density:'balanced',pageFont:'modern',doubleBorder:true,showPhoto:false,showMeta:true,showSignatures:true},
        logoData:null,
        sections:[section('GENERAL DETAILS',[field('Full Name'),field('Date','half','date'),field('Contact Number','half','phone')])]
      };
    }
    return {
      templateKind:'admission',
      brand:{
        orgName:'EZEE VISION CHAMPUA',
        orgAddress:'Opposite to Swagat Guest House, Champua',
        orgContact:'Contact: +91 89172 25693  |  +91 77499 16815  |  +91 91244 78453',
        docTitle:'STUDENT ADMISSION FORM',
        applicationLabel:'Application No.',
        dateLabel:'Date',
        footerText:'EZEE VISION CHAMPUA  |  Simple Concepts • Doubt Solving • Best Explanation',
        signatureLeft:'Student / Parent / Guardian Signature',
        signatureRight:'Authorized Signature',
        officeDateLabel:'Date:',
        officeUseLabel:'For Office Use - Admission No.:'
      },
      style:{headerColor:'#142f66',accentColor:'#2454a6',bandColor:'#dce8fb',titleInk:'#142f66',density:'balanced',pageFont:'modern',doubleBorder:true,showPhoto:true,showMeta:true,showSignatures:true},
      logoData:appLogo,
      sections:[
        section('STUDENT INFORMATION',[
          field('Full Name of Student','full'),
          field('Date of Birth','half','date'),
          field('Gender','half'),
          field("Student's Contact No.",'full','phone'),
          field('Email Address','full','email')
        ],'',{photoSlot:true}),
        section('PARENT / GUARDIAN DETAILS',[
          field("Father's Name",'half'),field('Mobile Number','half','phone'),
          field("Mother's Name",'half'),field('Mobile Number','half','phone'),
          field('Guardian Name (if applicable)','half'),field('Relationship','half')
        ]),
        section('ADDRESS DETAILS',[
          field('Present Address','full','multiline'),
          field('Permanent Address (if different)','full','multiline')
        ]),
        section('ACADEMIC BACKGROUND',[
          field('Previous Tuition / Coaching Name','full'),
          field('Last Class Completed','half'),field('Last Exam / Result','half')
        ]),
        section('CLASS & SUBJECT DETAILS',[
          field('Class','full'),field('Subjects','full')
        ]),
        section('DECLARATION',[], 'I hereby declare that the information provided above is true and correct to the best of my knowledge.\nI agree to follow the coaching rules, maintain discipline, and cooperate with the teachers.')
      ]
    };
  }

  let design = defaultDesign(templateKind);

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function showToast(message) {
    const el = $('#builderToast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('show'), 2800);
  }
  function currentLogo() { return uploadedLogo || design.logoData || null; }
  function optionList(value) {
    return String(value || '').split(',').map(item => item.trim()).filter(Boolean);
  }

  function renderBrandControls() {
    const brandKeys = ['orgName','orgAddress','orgContact','docTitle','applicationLabel','dateLabel','footerText','signatureLeft','signatureRight','officeDateLabel','officeUseLabel'];
    brandKeys.forEach(key => {
      const input = $(`[data-brand="${key}"]`);
      if (input) input.value = design.brand[key] ?? '';
    });
    Object.entries(design.style).forEach(([key, value]) => {
      const input = $(`[data-style="${key}"]`);
      if (!input) return;
      if (input.type === 'checkbox') input.checked = Boolean(value);
      else input.value = value;
    });
    const logoPreview = $('#logoMiniPreview');
    const logo = currentLogo();
    logoPreview.innerHTML = logo ? `<img src="${escapeHTML(logo)}" alt="Logo preview">` : '＋';
    $('#logoStatusText').textContent = logo ? 'Ready to print · replace anytime' : 'No logo selected';
  }

  function renderSectionControls() {
    const container = $('#sectionsEditor');
    container.innerHTML = design.sections.map((s, si) => {
      const sectionFields = s.fields.map((f, fi) => `
        <div class="field-editor-row" data-field-row="${escapeHTML(f.id)}">
          <div class="field-editor-head">
            <input class="field-name-input" aria-label="Field label" data-field-prop="label" data-section-id="${escapeHTML(s.id)}" data-field-id="${escapeHTML(f.id)}" maxlength="100" value="${escapeHTML(f.label)}" placeholder="Field label">
            <button class="icon-action" title="Move field up" aria-label="Move field up" data-action="field-up" data-section-id="${escapeHTML(s.id)}" data-field-id="${escapeHTML(f.id)}" ${fi === 0 ? 'disabled' : ''}>↑</button>
            <button class="icon-action" title="Move field down" aria-label="Move field down" data-action="field-down" data-section-id="${escapeHTML(s.id)}" data-field-id="${escapeHTML(f.id)}" ${fi === s.fields.length-1 ? 'disabled' : ''}>↓</button>
            <button class="icon-action delete" title="Remove field" aria-label="Remove field" data-action="delete-field" data-section-id="${escapeHTML(s.id)}" data-field-id="${escapeHTML(f.id)}">×</button>
          </div>
          <div class="field-editor-config">
            <label>Field width<select data-field-prop="width" data-section-id="${escapeHTML(s.id)}" data-field-id="${escapeHTML(f.id)}">
              <option value="full" ${f.width==='full'?'selected':''}>Full row</option><option value="half" ${f.width==='half'?'selected':''}>Half row</option><option value="third" ${f.width==='third'?'selected':''}>One-third</option>
            </select></label>
            <label>Field style<select data-field-prop="type" data-section-id="${escapeHTML(s.id)}" data-field-id="${escapeHTML(f.id)}">
              <option value="line" ${f.type==='line'?'selected':''}>Write-in line</option><option value="date" ${f.type==='date'?'selected':''}>Date line</option><option value="phone" ${f.type==='phone'?'selected':''}>Phone line</option><option value="email" ${f.type==='email'?'selected':''}>Email line</option><option value="multiline" ${f.type==='multiline'?'selected':''}>Multi-line answer</option><option value="options" ${f.type==='options'?'selected':''}>Checkbox options</option>
            </select></label>
          </div>
          ${f.type === 'options' ? `<label class="field-options-control"><span class="control-label">Options (comma-separated)</span><input data-field-prop="options" data-section-id="${escapeHTML(s.id)}" data-field-id="${escapeHTML(f.id)}" value="${escapeHTML(f.options || '')}" placeholder="Male, Female, Other"></label>` : ''}
        </div>`).join('');
      return `<article class="section-editor-card" data-section-card="${escapeHTML(s.id)}">
        <div class="section-editor-top">
          <input aria-label="Section heading" data-section-prop="title" data-section-id="${escapeHTML(s.id)}" maxlength="100" value="${escapeHTML(s.title)}" placeholder="Section heading">
          <button class="icon-action" title="Move section up" aria-label="Move section up" data-action="section-up" data-section-id="${escapeHTML(s.id)}" ${si===0?'disabled':''}>↑</button>
          <button class="icon-action" title="Move section down" aria-label="Move section down" data-action="section-down" data-section-id="${escapeHTML(s.id)}" ${si===design.sections.length-1?'disabled':''}>↓</button>
          <button class="icon-action delete" title="Remove section" aria-label="Remove section" data-action="delete-section" data-section-id="${escapeHTML(s.id)}">×</button>
        </div>
        <div class="section-note-editor"><label class="section-photo-toggle"><input type="checkbox" data-section-prop="photoSlot" data-section-id="${escapeHTML(s.id)}" ${s.photoSlot ? 'checked' : ''}><span>Show photo box in this section</span></label><textarea data-section-prop="note" data-section-id="${escapeHTML(s.id)}" rows="${s.note ? 3 : 1}" maxlength="900" placeholder="Optional explanatory text for this section">${escapeHTML(s.note || '')}</textarea></div>
        <div class="field-editor-list">${sectionFields || '<div class="empty-fields">No fields in this section yet.</div>'}</div>
        <div class="add-field-row"><button type="button" data-action="add-field" data-section-id="${escapeHTML(s.id)}">＋ Add field to this section</button></div>
      </article>`;
    }).join('');
  }

  function renderField(f) {
    const width = `width-${['full','half','third'].includes(f.width) ? f.width : 'full'}`;
    if (f.type === 'multiline') {
      return `<div class="doc-field type-multiline ${width}"><div class="doc-field-label">${escapeHTML(f.label)}</div><div class="multiline-lines"><i></i><i></i></div></div>`;
    }
    if (f.type === 'options') {
      const opts = optionList(f.options);
      return `<div class="doc-field type-options ${width}"><span class="doc-field-label">${escapeHTML(f.label)}</span><span class="choice-options">${opts.map(option => `<span><i></i>${escapeHTML(option)}</span>`).join('') || '<span class="doc-field-line"></span>'}</span></div>`;
    }
    return `<div class="doc-field type-${escapeHTML(f.type || 'line')} ${width}"><span class="doc-field-label">${escapeHTML(f.label)}</span><span class="doc-field-line"></span></div>`;
  }

  function renderSection(s, index) {
    const showPhoto = Boolean(s.photoSlot && design.style.showPhoto);
    const fields = s.fields.map(renderField).join('');
    const body = showPhoto
      ? `<div class="student-content"><div class="doc-fields">${fields}</div><div class="photo-box">PASTE<br>PHOTO</div></div>`
      : `<div class="doc-fields">${fields}</div>`;
    return `<section class="doc-section" data-section-print="${escapeHTML(s.id)}"><div class="doc-section-heading"><span class="section-num">${String(index+1).padStart(2,'0')}</span><span>${escapeHTML(s.title || 'UNTITLED SECTION')}</span></div><div class="doc-section-content">${s.note ? `<div class="doc-section-note">${escapeHTML(s.note)}</div>` : ''}${body}</div></section>`;
  }

  let previewRenderToken = 0;

  function pageClassName() {
    const sty = design.style;
    return `document-preview${sty.doubleBorder ? ' double-border' : ''}${sty.density === 'compact' ? ' density-compact' : ''}${sty.pageFont === 'classic' ? ' font-classic' : ''}`;
  }

  function renderPageHTML(items, pageIndex, pageCount, isLast) {
    const b = design.brand;
    const sty = design.style;
    const logo = currentLogo();
    const firstPage = pageIndex === 0;
    const logoMarkup = logo ? `<div class="doc-logo-box"><img src="${escapeHTML(logo)}" alt="Organization logo"></div>` : '<div class="doc-header-spacer"></div>';
    const orgLines = [b.orgAddress, b.orgContact].filter(Boolean).map(item => `<p>${escapeHTML(item).replace(/\n/g,'<br>')}</p>`).join('');
    const meta = sty.showMeta ? `<div class="doc-meta"><label>${escapeHTML(b.applicationLabel)} <i></i></label><label>${escapeHTML(b.dateLabel)} <i></i></label></div>` : '';
    const heading = firstPage
      ? `<header class="document-header"><div class="doc-header-spacer"></div><div class="doc-brand-copy"><h2>${escapeHTML(b.orgName || 'YOUR ORGANIZATION')}</h2>${orgLines}</div>${logoMarkup}</header><div class="doc-title-band"><h1>${escapeHTML(b.docTitle || 'UNTITLED FORM')}</h1>${meta}</div>`
      : `<header class="doc-continuation-header"><b>${escapeHTML(b.orgName || 'YOUR ORGANIZATION')}</b><span>${escapeHTML(b.docTitle || 'UNTITLED FORM')} · CONTINUED</span></header>`;
    const sectionHTML = items.map(item => renderSection(item.section, item.index)).join('');
    const signatures = isLast && sty.showSignatures ? `<div class="doc-signatures"><div class="signature-unit"><div class="signature-line"></div><div class="signature-label">${escapeHTML(b.signatureLeft)}</div></div><div class="signature-unit"><div class="signature-line"></div><div class="signature-label">${escapeHTML(b.signatureRight)}</div></div></div>` : '';
    const officeRow = isLast && (b.officeDateLabel || b.officeUseLabel) ? `<div class="doc-office-row">${b.officeDateLabel ? `<div class="office-entry"><b>${escapeHTML(b.officeDateLabel)}</b><span></span></div>` : '<div></div>'}${b.officeUseLabel ? `<div class="office-entry"><b>${escapeHTML(b.officeUseLabel)}</b><span></span></div>` : '<div></div>'}</div>` : '';
    const footerLabel = pageCount > 1 ? `Page ${pageIndex + 1} of ${pageCount}` : 'Office Record';
    return `<article class="${pageClassName()}" aria-label="A4 page ${pageIndex+1}"><div class="document-frame">
      ${heading}
      <div class="doc-sections">${sectionHTML}</div>
      ${signatures}${officeRow}
      <footer class="doc-footer"><span>${escapeHTML(b.footerText || '')}</span><span>${escapeHTML(footerLabel)}</span></footer>
    </div></article>`;
  }

  function renderPreview() {
    const preview = $('#documentPreview');
    const sty = design.style;
    const token = ++previewRenderToken;
    preview.className = `document-pages${sty.density === 'compact' ? ' density-compact' : ''}${sty.pageFont === 'classic' ? ' font-classic' : ''}`;
    preview.style.setProperty('--form-header', sty.headerColor);
    preview.style.setProperty('--form-accent', sty.accentColor);
    preview.style.setProperty('--form-band', sty.bandColor);
    preview.style.setProperty('--form-title-ink', sty.titleInk);
    const items = design.sections.map((item, index) => ({section:item,index}));
    preview.innerHTML = renderPageHTML(items, 0, 1, true);

    requestAnimationFrame(() => {
      if (token !== previewRenderToken) return;
      const firstPage = preview.querySelector('.document-preview');
      const frame = firstPage?.querySelector('.document-frame');
      const sectionContainer = firstPage?.querySelector('.doc-sections');
      const sectionNodes = sectionContainer ? $$('.doc-section', sectionContainer) : [];
      if (!frame || !sectionContainer) return;

      const frameStyle = getComputedStyle(frame);
      const px = value => Number.parseFloat(value) || 0;
      const paddingTop = px(frameStyle.paddingTop);
      const paddingBottom = px(frameStyle.paddingBottom);
      const sectionStartOffset = sectionContainer.getBoundingClientRect().top - frame.getBoundingClientRect().top;
      const footer = firstPage.querySelector('.doc-footer');
      const signatures = firstPage.querySelector('.doc-signatures');
      const office = firstPage.querySelector('.doc-office-row');
      // Reserve the signatures / office row only when a page is the final page.
      // On continuation pages, spend that space on the extra fields instead of leaving large gaps.
      const outerReserve = (element) => {
        if (!element) return 0;
        const css = getComputedStyle(element);
        const parseMargin = value => value === 'auto' ? 0 : (px(value));
        return element.getBoundingClientRect().height + parseMargin(css.marginTop) + parseMargin(css.marginBottom);
      };
      const footerHeight = footer ? footer.getBoundingClientRect().height : 0;
      const signOfficeReserve = outerReserve(signatures) + outerReserve(office);
      const frameHeight = frame.clientHeight;
      const safety = sty.density === 'compact' ? 0.96 : 0.92;
      const rowGap = px(getComputedStyle(sectionContainer).rowGap);
      const sectionHeights = sectionNodes.map(el => el.getBoundingClientRect().height);
      const usedHeight = list => list.reduce((sum, item, index) => sum + sectionHeights[item.index] + (index ? rowGap : 0), 0);
      const totalSectionsHeight = usedHeight(items);
      const baseFrameSpace = frameHeight - paddingTop - paddingBottom;
      const firstBodyBudget = Math.max(80, (baseFrameSpace - sectionStartOffset - footerHeight) * safety);
      const firstLastBudget = Math.max(80, (baseFrameSpace - sectionStartOffset - signOfficeReserve - footerHeight) * safety);

      if (totalSectionsHeight <= firstLastBudget || sectionNodes.length === 0) {
        $('#fitMessage').classList.remove('fit-warning');
        $('#fitMessage').innerHTML = 'All current sections fit in this preview. Use <b>Print / Save PDF</b> for the full-size A4 output.';
        if (!$('#focusPreviewOverlay').hidden) syncFocusPreview();
        return;
      }

      // Measure a continuation heading at the same width, then calculate both regular and final-page budgets.
      const probe = document.createElement('div');
      probe.className = 'doc-continuation-header';
      probe.innerHTML = `<b>${escapeHTML(design.brand.orgName)}</b><span>${escapeHTML(design.brand.docTitle)} · CONTINUED</span>`;
      probe.style.cssText = `position:absolute;visibility:hidden;left:0;top:0;width:${firstPage.getBoundingClientRect().width}px`;
      firstPage.appendChild(probe);
      const continuationHeadHeight = probe.getBoundingClientRect().height;
      const probeStyle = getComputedStyle(probe);
      const continuationHeadMargin = px(probeStyle.marginBottom) + px(probeStyle.marginTop);
      probe.remove();
      const sectionsMarginTop = px(getComputedStyle(sectionContainer).marginTop);
      const continuationBaseSpace = baseFrameSpace - continuationHeadHeight - continuationHeadMargin - sectionsMarginTop;
      const continuationBodyBudget = Math.max(80, (continuationBaseSpace - footerHeight) * safety);
      const continuationLastBudget = Math.max(80, (continuationBaseSpace - signOfficeReserve - footerHeight) * safety);

      // First, fill ordinary pages. If the last page needs signature space, move only the final sections needed.
      const pages = [];
      let current = [];
      let used = 0;
      let budget = firstBodyBudget;
      items.forEach((item, index) => {
        const addition = sectionHeights[index] + (current.length ? rowGap : 0);
        if (current.length && used + addition > budget) {
          pages.push(current);
          current = [];
          used = 0;
          budget = continuationBodyBudget;
        }
        current.push(item);
        used += sectionHeights[index] + (current.length > 1 ? rowGap : 0);
      });
      if (current.length) pages.push(current);

      if (pages.length === 1) {
        // The full content nearly fits, but the signature block needs to remain with the last few fields.
        const spill = [pages[0].pop()];
        while (spill.length && usedHeight(spill) > continuationLastBudget && pages[0].length > 1) {
          spill.unshift(pages[0].pop());
        }
        pages.push(spill);
      } else {
        const lastPage = pages[pages.length - 1];
        const spill = [];
        while (usedHeight(lastPage) > continuationLastBudget && lastPage.length > 1) {
          spill.unshift(lastPage.pop());
        }
        if (spill.length) pages.push(spill);
      }
      preview.innerHTML = pages.map((pageItems, pageIndex) => renderPageHTML(pageItems, pageIndex, pages.length, pageIndex === pages.length - 1)).join('');
      $('#fitMessage').classList.toggle('fit-warning', pages.length > 1);
      $('#fitMessage').innerHTML = pages.length > 1
        ? `<b>Multi-page layout:</b> arranged across ${pages.length} A4 pages. Sections stay together and signatures appear on the last page.`
        : 'All current sections fit in this preview. Use <b>Print / Save PDF</b> for the full-size A4 output.';
      if (!$('#focusPreviewOverlay').hidden) syncFocusPreview();
    });
  }

  function syncFocusPreview() {
    const stage = $('#focusPreviewStage');
    stage.innerHTML = '';
    const clone = $('#documentPreview').cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-label','Focused A4 document preview');
    stage.appendChild(clone);
  }

  function renderAll() {
    renderBrandControls();
    renderSectionControls();
    renderPreview();
  }

  function findSection(sectionId) { return design.sections.find(item => item.id === sectionId); }
  function findField(sectionId, fieldId) { return findSection(sectionId)?.fields.find(item => item.id === fieldId); }

  function moveItem(list, index, amount) {
    const next = index + amount;
    if (index < 0 || next < 0 || next >= list.length) return false;
    [list[index], list[next]] = [list[next], list[index]];
    return true;
  }

  function addField(sectionId) {
    let target = findSection(sectionId);
    if (!target) {
      target = section('NEW SECTION',[field('New field')]);
      design.sections.push(target);
    } else {
      target.fields.push(field('New field'));
    }
    renderAll();
    const newest = $('#sectionsEditor .field-name-input:last-of-type');
    newest?.focus();
    showToast('Field added. Rename it and choose the layout.');
  }

  function addSection() {
    design.sections.push(section(`NEW SECTION ${String(design.sections.length+1).padStart(2,'0')}`,[field('New field')]));
    renderAll();
    $('#sectionsEditor .section-editor-card:last-child input[data-section-prop="title"]')?.focus();
    showToast('New section added.');
  }

  function openFocusPreview() {
    $('#focusPreviewOverlay').hidden = false;
    syncFocusPreview();
    document.body.style.overflow = 'hidden';
  }
  function closeFocusPreview() {
    $('#focusPreviewOverlay').hidden = true;
    document.body.style.overflow = '';
  }

  function printDocument() {
    // Print from a clean preview-only surface. The live designer remains unchanged behind it.
    openFocusPreview();
    syncFocusPreview();
    window.setTimeout(() => window.print(), 80);
  }

  function exportDesign() {
    const payload = {app:'Universal Form Studio',schemaVersion:1,exportType:'form-design-only',exportedAt:new Date().toISOString(),design:{...design,logoData:currentLogo()}};
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (design.brand.docTitle || 'custom-form').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,55) || 'custom-form';
    link.href = url; link.download = `${safeName}-design.json`; document.body.appendChild(link); link.click(); link.remove();
    URL.revokeObjectURL(url);
    showToast('Design exported. No completed form or student data is included.');
  }

  function importDesignFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || ''));
        const incoming = payload.design || payload;
        if (!incoming || !incoming.brand || !incoming.style || !Array.isArray(incoming.sections)) throw new Error('That file does not look like a Form Studio design.');
        const safe = defaultDesign('custom');
        design = {
          templateKind: incoming.templateKind || 'custom',
          brand:{...safe.brand,...incoming.brand},
          style:{...safe.style,...incoming.style},
          sections: incoming.sections.map((s, index) => ({id:s.id || id('section'),title:String(s.title || `SECTION ${index+1}`),note:String(s.note || ''),photoSlot:Boolean(s.photoSlot),fields:Array.isArray(s.fields)?s.fields.map(f=>({id:f.id||id('field'),label:String(f.label||'Field'),width:['full','half','third'].includes(f.width)?f.width:'full',type:['line','date','phone','email','multiline','options'].includes(f.type)?f.type:'line',options:String(f.options||'')})):[]})),
          logoData:typeof incoming.logoData==='string' ? incoming.logoData : null
        };
        uploadedLogo = null;
        renderAll();
        showToast('Design imported into this session. It has not been saved to the app.');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Could not import this design file.');
      }
      $('#importDesignFile').value = '';
    };
    reader.onerror = () => showToast('Could not read that design file.');
    reader.readAsText(file);
  }

  function resetDesign() {
    if (!window.confirm('Reset this form designer to its starting layout? Current unsaved design changes will be discarded.')) return;
    design = defaultDesign(templateKind === 'custom' ? 'custom' : 'admission');
    uploadedLogo = null;
    renderAll();
    showToast('Admission form design reset to the reference layout.');
  }

  function bindEvents() {
    document.addEventListener('input', event => {
      const target = event.target;
      if (target.matches('[data-brand]')) {
        design.brand[target.dataset.brand] = target.value;
        renderPreview();
      } else if (target.matches('[data-style]')) {
        const key = target.dataset.style;
        design.style[key] = target.type === 'checkbox' ? target.checked : target.value;
        renderPreview();
      } else if (target.matches('[data-section-prop]')) {
        const s = findSection(target.dataset.sectionId);
        if (!s) return;
        s[target.dataset.sectionProp] = target.type === 'checkbox' ? target.checked : target.value;
        renderPreview();
      } else if (target.matches('[data-field-prop]')) {
        const f = findField(target.dataset.sectionId,target.dataset.fieldId);
        if (!f) return;
        f[target.dataset.fieldProp] = target.value;
        renderPreview();
      }
    });

    document.addEventListener('change', event => {
      const target = event.target;
      if (target.matches('[data-style]')) {
        const key = target.dataset.style;
        design.style[key] = target.type === 'checkbox' ? target.checked : target.value;
        renderPreview();
      }
      if (target.matches('[data-field-prop="type"]')) {
        renderSectionControls(); renderPreview();
      }
      if (target.id === 'logoUpload' && target.files?.[0]) {
        const file = target.files[0];
        if (!file.type.startsWith('image/')) return showToast('Please select an image file for the logo.');
        if (file.size > 5 * 1024 * 1024) return showToast('Please use a logo image smaller than 5 MB.');
        const reader = new FileReader();
        reader.onload = () => {
          uploadedLogo = String(reader.result || '');
          $('#logoMiniPreview').innerHTML = `<img src="${escapeHTML(uploadedLogo)}" alt="Logo preview">`;
          $('#logoStatusText').textContent = `${file.name} · temporary upload`;
          renderPreview();
          showToast('Logo added to this session. Export the design if you want to reuse it.');
        };
        reader.readAsDataURL(file);
      }
    });

    document.addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      const sectionId = button.dataset.sectionId;
      const fieldId = button.dataset.fieldId;
      if (action === 'add-field') return addField(sectionId);
      if (action === 'section-up' || action === 'section-down') {
        const index = design.sections.findIndex(s => s.id === sectionId);
        if (moveItem(design.sections,index,action === 'section-up' ? -1 : 1)) { renderSectionControls(); renderPreview(); }
      }
      if (action === 'field-up' || action === 'field-down') {
        const s = findSection(sectionId); if (!s) return;
        const index = s.fields.findIndex(f => f.id === fieldId);
        if (moveItem(s.fields,index,action === 'field-up' ? -1 : 1)) { renderSectionControls(); renderPreview(); }
      }
      if (action === 'delete-field') {
        const s = findSection(sectionId); if (!s) return;
        s.fields = s.fields.filter(f => f.id !== fieldId); renderAll(); showToast('Field removed from this design.');
      }
      if (action === 'delete-section') {
        const s = findSection(sectionId); if (!s) return;
        if (!window.confirm(`Remove the “${s.title}” section and its fields from this design?`)) return;
        design.sections = design.sections.filter(item => item.id !== sectionId); renderAll(); showToast('Section removed.');
      }
    });

    $('#addSectionBtn').addEventListener('click', addSection);
    $('#removeLogoBtn').addEventListener('click', () => { uploadedLogo = null; design.logoData = null; renderBrandControls(); renderPreview(); showToast('Logo removed from this design.'); });
    $('#exportDesignBtn').addEventListener('click', exportDesign);
    $('#importDesignBtn').addEventListener('click', () => $('#importDesignFile').click());
    $('#resetDesignBtn').addEventListener('click', resetDesign);
    $('#printBtn').addEventListener('click', printDocument);
    $('#mobilePrintBtn').addEventListener('click', printDocument);
    $('#previewModeBtn').addEventListener('click', openFocusPreview);
    $('#closeFocusPreview').addEventListener('click', closeFocusPreview);
    $('#focusPreviewOverlay').addEventListener('click', event => { if (event.target === $('#focusPreviewOverlay')) closeFocusPreview(); });
    $('#mobilePreviewBtn').addEventListener('click', () => {
      $('#documentPreview').scrollIntoView({behavior:'smooth',block:'start'});
      showToast('Live A4 preview is below the design controls.');
    });
    $('#logoUpload').addEventListener('click', () => { $('#logoUpload').value = ''; });
    $('#importDesignFile').addEventListener('change', event => importDesignFile(event.target.files?.[0]));
    window.addEventListener('afterprint', () => {
      if (!$('#focusPreviewOverlay').hidden) closeFocusPreview();
    });
    window.addEventListener('beforeunload', () => {
      // Intentionally do not persist the design or any form entries.
    });
  }

  function init() {
    if (templateKind === 'custom') {
      design = defaultDesign('custom');
      document.title = 'Custom Form Designer · Universal Form Studio';
      $('.builder-heading h1').innerHTML = 'Create a form <span>your way.</span>';
      $('.builder-heading p').textContent = 'Start from a clean, editable base. Add your own sections and fields, then shape the A4 output.';
      $('#resetDesignBtn').textContent = 'Reset';
    } else {
      design = defaultDesign('admission');
    }
    renderAll();
    bindEvents();
  }
  init();
})();
