/* ==========================================================================
   Página: Encontrar empresas (busca)
   ========================================================================== */
(function (RD) {
  const FILTER_DEFS = [
    { key: 'semSite', label: 'Não possui site' },
    { key: 'siteBaixaQualidade', label: 'Site de baixa qualidade' },
    { key: 'siteDesatualizado', label: 'Site desatualizado' },
    { key: 'problemasMobile', label: 'Site com problemas em celular' },
    { key: 'instagramAtivo', label: 'Instagram ativo' },
    { key: 'whatsappDisponivel', label: 'WhatsApp disponível' },
    { key: 'boaAvaliacao', label: 'Boa avaliação (≥ 4.4)' },
    { key: 'muitasAvaliacoes', label: 'Muitas avaliações (≥ 50)' },
  ];

  const STAGES = [
    { id: 'preparando', label: 'Preparando pesquisa...' },
    { id: 'localizando', label: 'Localizando empresas...' },
    { id: 'analisando', label: 'Analisando presença digital...' },
    { id: 'identificando', label: 'Identificando oportunidades...' },
    { id: 'organizando', label: 'Organizando resultados...' },
  ];

  let selectedFilters = {};

  function render(root) {
    selectedFilters = {};
    root.innerHTML = `
      <div class="mb-4">
        <h1 class="section-title">O que você está procurando?</h1>
        <p class="section-sub">Escolha um nicho, uma localização e os critérios que definem uma boa oportunidade.</p>
      </div>

      <div class="mock-banner mb-4">
        ${RD.icon('info')}
        <span>Modo demonstração: os resultados são gerados localmente (dados simulados) até que uma API real de dados públicos seja conectada.</span>
      </div>

      <div class="card card-pad" style="max-width:820px;">
        <div class="form-grid">
          <div class="field">
            <label>Nicho</label>
            <div class="select-wrap">
              <select class="select" id="f-nicho">
                ${RD.data.NICHES.map((n) => `<option value="${n.id}">${n.label}</option>`).join('')}
              </select>
              ${RD.icon('chevron-down')}
            </div>
          </div>
          <div class="field">
            <label>Cidade</label>
            <input class="input" id="f-cidade" list="cidades-list" placeholder="Ex: Sorocaba" value="Sorocaba" />
            <datalist id="cidades-list">${RD.data.LOCATIONS.map((l) => `<option value="${l.cidade}">`).join('')}</datalist>
          </div>
          <div class="field">
            <label>Estado</label>
            <div class="select-wrap">
              <select class="select" id="f-estado">
                ${[...new Set(RD.data.LOCATIONS.map((l) => l.estado))].sort().map((uf) => `<option value="${uf}" ${uf === 'SP' ? 'selected' : ''}>${uf}</option>`).join('')}
              </select>
              ${RD.icon('chevron-down')}
            </div>
          </div>
          <div class="field">
            <label>Bairro <span class="text-tertiary" style="font-weight:400;">(opcional)</span></label>
            <input class="input" id="f-bairro" placeholder="Ex: Centro" />
          </div>
        </div>

        <div class="divider mt-4 mb-3"></div>

        <div class="field">
          <label>Critérios de oportunidade</label>
          <div class="grid grid-2" style="gap:2px 16px;">
            ${FILTER_DEFS.map((f) => `
              <label class="checkbox-row">
                <input type="checkbox" data-filter="${f.key}" />
                <span class="checkbox-box">${RD.icon('check')}</span>
                <span class="checkbox-label">${f.label}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div id="active-chips" class="flex gap-2 mt-3" style="flex-wrap:wrap;"></div>

        <button class="btn btn-primary btn-lg btn-block mt-4" id="search-btn">
          ${RD.icon('search', { size: 17 })}ENCONTRAR OPORTUNIDADES
        </button>
      </div>
    `;

    document.getElementById('f-cidade').addEventListener('change', (e) => {
      const match = RD.data.LOCATIONS.find((l) => l.cidade.toLowerCase() === e.target.value.trim().toLowerCase());
      if (match) document.getElementById('f-estado').value = match.estado;
    });

    root.querySelectorAll('[data-filter]').forEach((cb) => {
      cb.addEventListener('change', () => {
        if (cb.checked) selectedFilters[cb.dataset.filter] = true;
        else delete selectedFilters[cb.dataset.filter];
        renderChips();
      });
    });

    function renderChips() {
      const chipsEl = document.getElementById('active-chips');
      const keys = Object.keys(selectedFilters);
      chipsEl.innerHTML = keys.map((k) => {
        const def = FILTER_DEFS.find((f) => f.key === k);
        return `<span class="chip" data-chip="${k}">${def.label}<button data-remove="${k}">${RD.icon('x')}</button></span>`;
      }).join('');
      chipsEl.querySelectorAll('[data-remove]').forEach((btn) => btn.addEventListener('click', () => {
        delete selectedFilters[btn.dataset.remove];
        const input = root.querySelector(`[data-filter="${btn.dataset.remove}"]`);
        if (input) input.checked = false;
        renderChips();
      }));
    }

    document.getElementById('search-btn').addEventListener('click', () => startSearch(root));
  }

  async function startSearch(root) {
    const nicheId = document.getElementById('f-nicho').value;
    const cidade = document.getElementById('f-cidade').value.trim() || 'Sorocaba';
    const estado = document.getElementById('f-estado').value;
    const bairro = document.getElementById('f-bairro').value.trim();

    root.innerHTML = `
      <div class="card">
        <div class="search-loading">
          <div class="search-loading-orb">${RD.icon('target', { size: 36 })}</div>
          <div class="search-loading-step" id="loading-step-label">${STAGES[0].label}</div>
          <div class="progress-track"><div class="progress-fill" id="loading-progress" style="width:0%"></div></div>
          <div class="search-loading-steps-track" id="loading-steps">
            ${STAGES.map((s) => `
              <div class="step-row" data-stage="${s.id}">
                <span class="step-icon">${RD.icon('loader', { size: 11 })}</span>
                <span>${s.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const stageEls = {};
    STAGES.forEach((s) => { stageEls[s.id] = document.querySelector(`[data-stage="${s.id}"]`); });

    function markStage(stageId) {
      const idx = STAGES.findIndex((s) => s.id === stageId);
      STAGES.forEach((s, i) => {
        const el = stageEls[s.id];
        el.classList.remove('active', 'done');
        if (i < idx) { el.classList.add('done'); el.querySelector('.step-icon').innerHTML = RD.icon('check', { size: 11 }); }
        else if (i === idx) { el.classList.add('active'); el.querySelector('.step-icon').innerHTML = RD.icon('loader', { size: 11 }); }
        else { el.querySelector('.step-icon').innerHTML = ''; }
      });
      document.getElementById('loading-step-label').textContent = STAGES[idx].label;
      document.getElementById('loading-progress').style.width = `${Math.round(((idx + 1) / STAGES.length) * 100)}%`;
    }

    const { all, results } = await RD.companyService.search({ nicheId, cidade, estado, bairro, filtros: selectedFilters }, markStage);

    STAGES.forEach((s) => { stageEls[s.id].classList.add('done'); stageEls[s.id].classList.remove('active'); stageEls[s.id].querySelector('.step-icon').innerHTML = RD.icon('check', { size: 11 }); });
    document.getElementById('loading-progress').style.width = '100%';
    document.getElementById('loading-step-label').textContent = 'Concluído!';

    RD.store.setLastSearch({
      niche: nicheId, location: `${cidade} - ${estado}`, cidade, estado, bairro,
      filters: selectedFilters, all, results, timestamp: new Date().toISOString(),
    });

    setTimeout(() => RD.router.navigate('oportunidades'), 500);
  }

  RD.pages = RD.pages || {};
  RD.pages.buscar = render;
})(window.RD = window.RD || {});
