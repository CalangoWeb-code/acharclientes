/* ==========================================================================
   Página: Leads salvos
   ========================================================================== */
(function (RD) {
  let statusFilter = null;
  let query = '';

  function render(root) {
    statusFilter = null; query = '';
    document.removeEventListener('rd:leads-changed', reRenderHandler);
    document.addEventListener('rd:leads-changed', reRenderHandler);
    renderList(root);
  }

  function reRenderHandler() {
    const root = document.getElementById('page-root');
    if (RD.router.current() === 'leads') renderList(root);
  }

  function renderList(root) {
    const leads = RD.store.getState().leads;

    if (!leads.length) {
      root.innerHTML = `<div class="card">${RD.ui.emptyState({
        icon: 'bookmark', title: 'Você ainda não possui leads',
        text: 'Comece pesquisando empresas para encontrar suas primeiras oportunidades.',
        actionLabel: 'Encontrar empresas',
      })}</div>`;
      return;
    }

    const filtered = leads.filter((l) => {
      if (statusFilter && l.status !== statusFilter) return false;
      if (query && !l.nome.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    const statusCounts = {};
    leads.forEach((l) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

    root.innerHTML = `
      <div class="flex items-center justify-between mb-3" style="flex-wrap:wrap;gap:10px;">
        <div>
          <h1 class="section-title">Leads salvos</h1>
          <p class="section-sub">${leads.length} leads · acompanhe pelo <a href="#/pipeline" style="color:var(--brand-500);font-weight:600;">Pipeline</a> para gerenciar o funil completo.</p>
        </div>
        <input class="input" id="leads-search" placeholder="Buscar por nome..." style="max-width:240px;" />
      </div>

      <div class="flex gap-2 mb-4" style="flex-wrap:wrap;">
        <span class="pill-tab ${!statusFilter ? 'active' : ''}" data-status="">Todos (${leads.length})</span>
        ${RD.store.STATUS_ORDER.filter((s) => statusCounts[s]).map((s) => `
          <span class="pill-tab ${statusFilter === s ? 'active' : ''}" data-status="${s}">${RD.store.STATUS_LABEL[s]} (${statusCounts[s]})</span>
        `).join('')}
      </div>

      <div id="leads-grid" class="grid grid-3"></div>
    `;

    const grid = document.getElementById('leads-grid');
    if (!filtered.length) {
      grid.className = '';
      grid.innerHTML = `<div class="card">${RD.ui.emptyState({ icon: 'search', title: 'Nenhum lead corresponde à busca', text: 'Tente outro termo ou remova o filtro de status.' })}</div>`;
    } else {
      grid.innerHTML = filtered.map((l, i) => RD.companyCard.renderCard(l, { index: i, isLead: true })).join('');
      RD.companyCard.activateRings(grid);
    }

    RD.companyCard.initCardActions(root, leads);
    root.querySelectorAll('[data-status]').forEach((el) => el.addEventListener('click', () => { statusFilter = el.dataset.status || null; renderList(root); }));
    document.getElementById('leads-search').value = query;
    document.getElementById('leads-search').addEventListener('input', RD.utils.debounce((e) => { query = e.target.value; renderList(root); }, 180));

    grid.querySelectorAll('.company-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-action]') || e.target.closest('summary')) return;
        RD.leadDetail.open(card.dataset.companyId);
      });
      card.style.cursor = 'pointer';
    });
  }

  RD.pages = RD.pages || {};
  RD.pages.leads = render;
})(window.RD = window.RD || {});
