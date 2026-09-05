/* ==========================================================================
   Página: Oportunidades encontradas (resultados da busca)
   ========================================================================== */
(function (RD) {
  const FILTER_LABELS = {
    semSite: 'Não possui site', siteBaixaQualidade: 'Site de baixa qualidade', siteDesatualizado: 'Site desatualizado',
    problemasMobile: 'Problemas em celular', instagramAtivo: 'Instagram ativo', whatsappDisponivel: 'WhatsApp disponível',
    boaAvaliacao: 'Boa avaliação', muitasAvaliacoes: 'Muitas avaliações',
  };

  const SORTS = [
    { id: 'score', label: 'Melhores oportunidades' },
    { id: 'avaliacao', label: 'Avaliação' },
    { id: 'numAvaliacoes', label: 'Número de avaliações' },
    { id: 'nome', label: 'Nome' },
    { id: 'recentes', label: 'Mais recentes' },
  ];

  let currentFilters = {};
  let currentSort = 'score';
  let classFilter = null; // 'alta' | 'media' | 'baixa' | null

  function applySortAndFilter(all) {
    let list = RD.companyService.applyFilters(all, currentFilters);
    if (classFilter) list = list.filter((c) => c.classificacao === classFilter);
    list = list.slice();
    if (currentSort === 'score') list.sort((a, b) => b.score - a.score);
    else if (currentSort === 'avaliacao') list.sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0));
    else if (currentSort === 'numAvaliacoes') list.sort((a, b) => (b.numAvaliacoes || 0) - (a.numAvaliacoes || 0));
    else if (currentSort === 'nome') list.sort((a, b) => a.nome.localeCompare(b.nome));
    else if (currentSort === 'recentes') list.reverse();
    return list;
  }

  function render(root) {
    const state = RD.store.getState();
    const search = state.lastSearch;

    if (!search) {
      root.innerHTML = `<div class="card">${RD.ui.emptyState({
        icon: 'target', title: 'Nenhuma busca realizada ainda',
        text: 'Vá até "Encontrar empresas" para escolher um nicho e uma localização e ver suas primeiras oportunidades.',
        actionLabel: 'Encontrar empresas',
      })}</div>`;
      return;
    }

    currentFilters = Object.assign({}, search.filters);
    currentSort = 'score';
    classFilter = null;
    renderList(root, search);
  }

  function renderList(root, search) {
    const niche = RD.data.getNiche(search.niche);
    const visible = applySortAndFilter(search.all);

    const counts = {
      alta: search.all.filter((c) => c.classificacao === 'alta').length,
      media: search.all.filter((c) => c.classificacao === 'media').length,
      baixa: search.all.filter((c) => c.classificacao === 'baixa').length,
    };

    root.innerHTML = `
      <div class="flex items-center justify-between mb-2" style="flex-wrap:wrap;gap:10px;">
        <div>
          <h1 class="section-title">${niche.label} em ${RD.utils.escapeHtml(search.location)}</h1>
          <p class="section-sub"><span class="count-up" id="result-count">${visible.length}</span> empresas encontradas · ordenado por: ${(SORTS.find((s) => s.id === currentSort) || SORTS[0]).label.toLowerCase()}</p>
        </div>
        <a href="#/buscar" class="btn btn-secondary">${RD.icon('search', { size: 15 })}Nova busca</a>
      </div>

      <div class="mock-banner mb-3">${RD.icon('info')}<span>Resultados simulados para demonstração — nenhuma API real foi consultada.</span></div>

      <div class="flex items-center gap-2 mb-3" style="flex-wrap:wrap;">
        <span class="pill-tab ${!classFilter ? 'active' : ''}" data-class="">Todas (${search.all.length})</span>
        <span class="pill-tab ${classFilter === 'alta' ? 'active' : ''}" data-class="alta">🟢 Alta (${counts.alta})</span>
        <span class="pill-tab ${classFilter === 'media' ? 'active' : ''}" data-class="media">🟡 Média (${counts.media})</span>
        <span class="pill-tab ${classFilter === 'baixa' ? 'active' : ''}" data-class="baixa">🔴 Baixa (${counts.baixa})</span>
        <div class="topbar-spacer"></div>
        <div class="select-wrap" style="width:220px;">
          <select class="select" id="sort-select">
            ${SORTS.map((s) => `<option value="${s.id}" ${s.id === currentSort ? 'selected' : ''}>Ordenar: ${s.label}</option>`).join('')}
          </select>
          ${RD.icon('chevron-down')}
        </div>
      </div>

      <div class="flex gap-2 mb-4" id="filter-chips" style="flex-wrap:wrap;">
        ${Object.keys(currentFilters).map((k) => `<span class="chip" data-chip="${k}">${FILTER_LABELS[k] || k}<button data-remove="${k}">${RD.icon('x')}</button></span>`).join('')}
        <button class="btn btn-ghost btn-sm" id="add-filter-btn">${RD.icon('plus', { size: 13 })}Adicionar filtro</button>
      </div>

      <div id="results-grid" class="grid grid-3"></div>
    `;

    const grid = document.getElementById('results-grid');
    if (!visible.length) {
      grid.className = '';
      grid.innerHTML = `<div class="card">${RD.ui.emptyState({ icon: 'filter', title: 'Nenhuma empresa corresponde aos filtros', text: 'Tente remover algum filtro ou critério para ver mais resultados.' })}</div>`;
    } else {
      grid.innerHTML = visible.map((c, i) => RD.companyCard.renderCard(c, { index: i })).join('');
      RD.companyCard.activateRings(grid);
    }

    RD.companyCard.initCardActions(root, search.all);

    document.getElementById('sort-select').addEventListener('change', (e) => { currentSort = e.target.value; renderList(root, search); });
    root.querySelectorAll('[data-class]').forEach((el) => el.addEventListener('click', () => { classFilter = el.dataset.class || null; renderList(root, search); }));
    root.querySelectorAll('[data-remove]').forEach((btn) => btn.addEventListener('click', () => { delete currentFilters[btn.dataset.remove]; renderList(root, search); }));
    document.getElementById('add-filter-btn').addEventListener('click', () => openAddFilterModal(root, search));

    RD.utils.animateCount(document.getElementById('result-count'), visible.length, { duration: 500 });
  }

  function openAddFilterModal(root, search) {
    const bodyHtml = `
      <div class="grid grid-2" style="gap:2px 16px;">
        ${Object.entries(FILTER_LABELS).map(([key, label]) => `
          <label class="checkbox-row">
            <input type="checkbox" data-fkey="${key}" ${currentFilters[key] ? 'checked' : ''} />
            <span class="checkbox-box">${RD.icon('check')}</span>
            <span class="checkbox-label">${label}</span>
          </label>`).join('')}
      </div>`;
    const { panel, close } = RD.modal.open({
      title: 'Adicionar / ajustar filtros', bodyHtml,
      footerHtml: `<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" id="apply-filters-btn">Aplicar filtros</button>`,
    });
    panel.querySelector('[data-close]').addEventListener('click', close);
    panel.querySelector('#apply-filters-btn').addEventListener('click', () => {
      currentFilters = {};
      panel.querySelectorAll('[data-fkey]').forEach((cb) => { if (cb.checked) currentFilters[cb.dataset.fkey] = true; });
      close();
      renderList(root, search);
    });
  }

  RD.pages = RD.pages || {};
  RD.pages.oportunidades = render;
})(window.RD = window.RD || {});
