/* ==========================================================================
   Página: Pipeline (Kanban) — arrastar e soltar entre status
   ========================================================================== */
(function (RD) {
  function render(root) {
    document.removeEventListener('rd:leads-changed', reRenderHandler);
    document.addEventListener('rd:leads-changed', reRenderHandler);
    renderBoard(root);
  }

  function reRenderHandler() {
    const root = document.getElementById('page-root');
    if (RD.router.current() === 'pipeline') renderBoard(root);
  }

  function renderBoard(root) {
    const leads = RD.store.getState().leads;
    const columns = RD.store.PIPELINE_COLUMNS;
    const outros = leads.filter((l) => !columns.includes(l.status));

    if (!leads.length) {
      root.innerHTML = `<div class="card">${RD.ui.emptyState({
        icon: 'kanban', title: 'Seu pipeline está vazio',
        text: 'Salve empresas como leads para começar a acompanhar a negociação por aqui.',
        actionLabel: 'Encontrar empresas',
      })}</div>`;
      return;
    }

    root.innerHTML = `
      <div class="flex items-center justify-between mb-1" style="flex-wrap:wrap;gap:10px;">
        <div>
          <h1 class="section-title">Pipeline de prospecção</h1>
          <p class="section-sub">Arraste os cards entre as colunas para atualizar o status.</p>
        </div>
      </div>
      ${outros.length ? `<p class="helper-text mb-3">${outros.length} lead(s) com status fora do funil principal (Pesquisado / Negociação / Não interessado) — veja em <a href="#/leads" style="color:var(--brand-500);font-weight:600;">Leads salvos</a>.</p>` : ''}
      <div class="kanban-board" id="kanban-board">
        ${columns.map((status) => `
          <div class="kanban-col" data-col="${status}">
            <div class="kanban-col-header"><span>${RD.store.STATUS_LABEL[status]}</span><span class="kanban-col-count">${leads.filter((l) => l.status === status).length}</span></div>
            <div class="kanban-col-body" data-col-body="${status}"></div>
          </div>
        `).join('')}
      </div>
    `;

    columns.forEach((status) => {
      const body = root.querySelector(`[data-col-body="${status}"]`);
      const items = leads.filter((l) => l.status === status);
      body.innerHTML = items.map((l) => `
        <div class="kanban-card" draggable="true" data-lead-id="${l.id}">
          <div class="flex items-center justify-between">
            <div class="kanban-card-name">${RD.utils.escapeHtml(l.nome)}</div>
            <span class="badge ${l.classificacao === 'alta' ? 'badge-alta' : l.classificacao === 'media' ? 'badge-media' : 'badge-baixa'}" style="padding:2px 7px;">${l.score}</span>
          </div>
          <div class="kanban-card-meta">${RD.icon('map-pin', { size: 11 })}${RD.utils.escapeHtml(l.cidade)} · ${RD.utils.timeAgo(l.savedAt)}</div>
        </div>
      `).join('');
    });

    initDragDrop(root);

    root.querySelectorAll('.kanban-card').forEach((card) => {
      card.addEventListener('click', () => RD.leadDetail.open(card.dataset.leadId));
    });
  }

  function initDragDrop(root) {
    let draggingId = null;

    root.querySelectorAll('.kanban-card').forEach((card) => {
      card.addEventListener('dragstart', (e) => {
        draggingId = card.dataset.leadId;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggingId);
      });
      card.addEventListener('dragend', () => { card.classList.remove('dragging'); draggingId = null; });
    });

    root.querySelectorAll('.kanban-col-body').forEach((body) => {
      body.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; body.classList.add('drag-over'); });
      body.addEventListener('dragleave', () => body.classList.remove('drag-over'));
      body.addEventListener('drop', (e) => {
        e.preventDefault();
        body.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain') || draggingId;
        const newStatus = body.dataset.colBody;
        const lead = RD.store.getLead(id);
        if (!lead || lead.status === newStatus) return;
        RD.store.updateLeadStatus(id, newStatus);
        RD.toast.show({ text: `${lead.nome} → ${RD.store.STATUS_LABEL[newStatus]}`, type: 'success', icon: 'refresh-cw' });
        RD.shell.updateBadges();
        renderBoard(document.getElementById('page-root'));
      });
    });
  }

  RD.pages = RD.pages || {};
  RD.pages.pipeline = render;
})(window.RD = window.RD || {});
