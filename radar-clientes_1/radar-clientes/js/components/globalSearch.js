/* ==========================================================================
   Busca global (Ctrl+K) — empresas salvas, notas e páginas
   ========================================================================== */
(function (RD) {
  const PAGES = [
    { path: 'dashboard', label: 'Dashboard', icon: 'home' },
    { path: 'buscar', label: 'Encontrar empresas', icon: 'search' },
    { path: 'oportunidades', label: 'Oportunidades encontradas', icon: 'target' },
    { path: 'leads', label: 'Leads salvos', icon: 'bookmark' },
    { path: 'pipeline', label: 'Pipeline', icon: 'kanban' },
    { path: 'mensagens', label: 'Mensagens', icon: 'message' },
    { path: 'configuracoes', label: 'Configurações', icon: 'settings' },
  ];

  function search(query) {
    const q = query.trim().toLowerCase();
    const state = RD.store.getState();
    const results = { paginas: [], leads: [], notas: [] };

    if (!q) {
      results.paginas = PAGES;
      return results;
    }

    results.paginas = PAGES.filter((p) => p.label.toLowerCase().includes(q));

    state.leads.forEach((lead) => {
      if (lead.nome.toLowerCase().includes(q) || lead.cidade.toLowerCase().includes(q) || (lead.categoria || '').toLowerCase().includes(q)) {
        results.leads.push(lead);
      }
      (lead.notes || []).forEach((n) => {
        if (n.text.toLowerCase().includes(q)) results.notas.push({ lead, note: n });
      });
    });

    return results;
  }

  function render(query) {
    const r = search(query);
    const sections = [];
    if (r.paginas.length) {
      sections.push(`<div class="cmdk-group-label">Páginas</div>` + r.paginas.map((p) => `
        <div class="cmdk-item" data-goto="${p.path}">${RD.icon(p.icon, { size: 16 })}<span>${p.label}</span></div>`).join(''));
    }
    if (r.leads.length) {
      sections.push(`<div class="cmdk-group-label">Leads salvos</div>` + r.leads.slice(0, 8).map((l) => `
        <div class="cmdk-item" data-lead="${l.id}">${RD.icon('bookmark', { size: 16 })}<span>${RD.utils.escapeHtml(l.nome)} <span class="text-tertiary">· ${RD.utils.escapeHtml(l.cidade)}</span></span></div>`).join(''));
    }
    if (r.notas.length) {
      sections.push(`<div class="cmdk-group-label">Notas</div>` + r.notas.slice(0, 6).map((x) => `
        <div class="cmdk-item" data-lead="${x.lead.id}">${RD.icon('note', { size: 16 })}<span>"${RD.utils.escapeHtml(x.note.text.slice(0, 60))}" <span class="text-tertiary">— ${RD.utils.escapeHtml(x.lead.nome)}</span></span></div>`).join(''));
    }
    if (!sections.length) {
      return `<div class="empty-state" style="padding:32px 16px;">${RD.icon('search', { size: 26 })}<p>Nenhum resultado para essa busca.</p></div>`;
    }
    return sections.join('');
  }

  function open() {
    const bodyHtml = `
      <div class="cmdk-input-wrap">${RD.icon('search', { size: 18 })}<input class="cmdk-input" id="cmdk-input" placeholder="Buscar empresas, leads, notas, páginas…" autofocus /></div>
      <div class="cmdk-results" id="cmdk-results"></div>
    `;
    const { panel, close } = RD.modal.open({ title: '', bodyHtml: '', wide: false });
    panel.querySelector('.modal-header').remove();
    panel.querySelector('.modal-body').outerHTML = `<div style="padding:0;">${bodyHtml}</div>`;

    const input = panel.querySelector('#cmdk-input');
    const results = panel.querySelector('#cmdk-results');
    const rerender = () => {
      results.innerHTML = render(input.value);
      results.querySelectorAll('[data-goto]').forEach((el) => el.addEventListener('click', () => { RD.router.navigate(el.dataset.goto); close(); }));
      results.querySelectorAll('[data-lead]').forEach((el) => el.addEventListener('click', () => {
        close();
        RD.router.navigate('leads');
        setTimeout(() => document.dispatchEvent(new CustomEvent('rd:open-lead', { detail: { id: el.dataset.lead } })), 60);
      }));
    };
    rerender();
    input.addEventListener('input', RD.utils.debounce(rerender, 80));
    setTimeout(() => input.focus(), 30);
  }

  RD.globalSearch = { open, search };
})(window.RD = window.RD || {});
