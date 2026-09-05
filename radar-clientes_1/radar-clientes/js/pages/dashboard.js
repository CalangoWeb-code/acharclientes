/* ==========================================================================
   Página: Dashboard
   ========================================================================== */
(function (RD) {
  function statCard({ icon, color, value, label, id }) {
    return `
      <div class="stat-card">
        <div class="stat-card-icon" style="background:${color}22;color:${color};">${RD.icon(icon, { size: 19 })}</div>
        <div class="stat-card-value count-up" id="${id}">0</div>
        <div class="stat-card-label">${label}</div>
      </div>`;
  }

  async function render(root) {
    const state = RD.store.getState();
    const leads = state.leads;
    const empresasEncontradas = (state.searchHistory || []).reduce((s, h) => s + h.count, 0);
    const altaOportunidade = leads.filter((l) => l.classificacao === 'alta').length;
    const contatados = leads.filter((l) => l.status !== 'novo' && l.status !== 'pesquisado').length;
    const interessados = leads.filter((l) => ['interessado', 'proposta', 'negociacao'].includes(l.status)).length;
    const clientes = leads.filter((l) => l.status === 'cliente').length;

    const hasAnyData = empresasEncontradas > 0 || leads.length > 0;

    root.innerHTML = `
      <div class="flex items-center justify-between mb-4" style="flex-wrap:wrap;gap:12px;">
        <div>
          <h1 class="section-title">Central de inteligência de prospecção</h1>
          <p class="section-sub">Visão geral das suas buscas e leads. Escolha um nicho e comece a encontrar oportunidades.</p>
        </div>
        <a href="#/buscar" class="btn btn-primary btn-lg">${RD.icon('search', { size: 16 })}Encontrar oportunidades</a>
      </div>

      <div class="grid grid-4 mb-4">
        ${statCard({ icon: 'target', color: '#4f5df5', value: empresasEncontradas, label: 'Empresas encontradas', id: 'st-encontradas' })}
        ${statCard({ icon: 'bookmark', color: '#38e8c6', value: leads.length, label: 'Leads salvos', id: 'st-leads' })}
        ${statCard({ icon: 'sparkles', color: '#17a673', value: altaOportunidade, label: 'Alta oportunidade', id: 'st-alta' })}
        ${statCard({ icon: 'whatsapp', color: '#22c35e', value: contatados, label: 'Contatados', id: 'st-contatados' })}
      </div>
      <div class="grid grid-2 mb-4">
        ${statCard({ icon: 'trending-up', color: '#e2a512', value: interessados, label: 'Interessados / em negociação', id: 'st-interessados' })}
        ${statCard({ icon: 'star-filled', color: '#3b82f6', value: clientes, label: 'Clientes conquistados', id: 'st-clientes' })}
      </div>

      ${hasAnyData ? `
        <div class="grid grid-2">
          <div class="card card-pad">
            <div class="font-bold mb-1">Leads por status</div>
            <p class="text-secondary text-sm mb-3">Distribuição atual do seu pipeline.</p>
            <div id="chart-status"></div>
          </div>
          <div class="card card-pad">
            <div class="font-bold mb-1">Empresas encontradas por nicho</div>
            <p class="text-secondary text-sm mb-3">Baseado no histórico de buscas desta sessão.</p>
            <div id="chart-nicho"></div>
          </div>
        </div>

        <div class="card card-pad mt-4">
          <div class="font-bold mb-3">Buscas recentes</div>
          <div style="display:flex;flex-direction:column;gap:2px;">
            ${(state.searchHistory || []).slice(0, 6).map((h) => `
              <div class="list-row" style="border-bottom:1px solid var(--border);">
                <div class="stat-card-icon" style="width:34px;height:34px;margin:0;background:var(--brand-50);color:var(--brand-600);">${RD.icon('search', { size: 15 })}</div>
                <div style="flex:1;">
                  <div class="font-semibold text-sm">${RD.utils.escapeHtml(RD.data.getNiche(h.niche).label)} · ${RD.utils.escapeHtml(h.location)}</div>
                  <div class="text-tertiary text-xs">${RD.utils.timeAgo(h.timestamp)}</div>
                </div>
                <div class="badge badge-neutral">${h.count} empresas</div>
              </div>
            `).join('') || '<p class="text-secondary text-sm">Nenhuma busca ainda.</p>'}
          </div>
        </div>
      ` : `
        <div class="card">
          ${RD.ui.emptyState({
            icon: 'target', title: 'Você ainda não fez nenhuma busca',
            text: 'Escolha um nicho e uma localização para encontrar suas primeiras oportunidades de clientes.',
            actionLabel: 'Encontrar empresas',
          })}
        </div>
      `}
    `;

    // animações
    document.querySelectorAll('.stat-card-value').forEach((el, i) => {});
    RD.utils.animateCount(document.getElementById('st-encontradas'), empresasEncontradas);
    RD.utils.animateCount(document.getElementById('st-leads'), leads.length);
    RD.utils.animateCount(document.getElementById('st-alta'), altaOportunidade);
    RD.utils.animateCount(document.getElementById('st-contatados'), contatados);
    RD.utils.animateCount(document.getElementById('st-interessados'), interessados);
    RD.utils.animateCount(document.getElementById('st-clientes'), clientes);

    if (hasAnyData) {
      const statusCounts = RD.store.STATUS_ORDER
        .map((s) => ({ label: RD.store.STATUS_LABEL[s], value: leads.filter((l) => l.status === s).length }))
        .filter((d) => d.value > 0);
      const chartStatusEl = document.getElementById('chart-status');
      if (statusCounts.length) {
        chartStatusEl.innerHTML = RD.charts.barChart(statusCounts, { labelWidth: 132 });
        RD.charts.activateBars(chartStatusEl);
      } else {
        chartStatusEl.innerHTML = '<p class="text-secondary text-sm">Salve leads para ver esse gráfico.</p>';
      }

      const byNiche = {};
      (state.searchHistory || []).forEach((h) => { byNiche[h.niche] = (byNiche[h.niche] || 0) + h.count; });
      const nicheData = Object.entries(byNiche).map(([id, value]) => ({ label: RD.data.getNiche(id).label, value }));
      const chartNichoEl = document.getElementById('chart-nicho');
      chartNichoEl.innerHTML = RD.charts.donutChart(nicheData, { size: 140, stroke: 16 });
      RD.charts.activateDonut(chartNichoEl);
    }
  }

  RD.pages = RD.pages || {};
  RD.pages.dashboard = render;
})(window.RD = window.RD || {});
