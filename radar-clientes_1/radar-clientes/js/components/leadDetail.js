/* ==========================================================================
   Modal de detalhe do lead — status, notas, histórico (timeline)
   ========================================================================== */
(function (RD) {
  const TIMELINE_ICON = { created: 'star-filled', status: 'refresh-cw', note: 'note', contact: 'whatsapp' };

  function statusOptions(current) {
    return RD.store.STATUS_ORDER.map((s) => `<option value="${s}" ${s === current ? 'selected' : ''}>${RD.store.STATUS_LABEL[s]}</option>`).join('');
  }

  function open(leadId, opts) {
    const lead = RD.store.getLead(leadId);
    if (!lead) { RD.toast.show({ text: 'Lead não encontrado (pode ter sido removido).', type: 'info' }); return; }

    const bodyHtml = `
      <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:10px;">
        <div>
          <div class="company-name" style="font-size:19px;">${RD.utils.escapeHtml(lead.nome)}</div>
          <div class="company-meta">
            <span class="company-meta-item">${RD.icon('map-pin', { size: 14 })}${RD.utils.escapeHtml(lead.cidade)} - ${lead.estado}</span>
            <span class="company-meta-item">${RD.icon('building', { size: 14 })}${RD.utils.escapeHtml(lead.categoria)}</span>
          </div>
        </div>
        ${RD.companyCard ? '' : ''}
        <div class="badge ${lead.classificacao === 'alta' ? 'badge-alta' : lead.classificacao === 'media' ? 'badge-media' : 'badge-baixa'}"><span class="badge-dot"></span>${lead.score}/100</div>
      </div>

      <div class="field">
        <label>Status</label>
        <div class="select-wrap">
          <select class="select" id="status-select">${statusOptions(lead.status)}</select>
          ${RD.icon('chevron-down')}
        </div>
      </div>

      <div class="card-actions">
        <button class="btn btn-whatsapp btn-sm" id="detail-wa-btn" ${!lead.whatsapp ? 'disabled' : ''}>${RD.icon('whatsapp', { size: 14 })}WhatsApp</button>
        <button class="btn btn-secondary btn-sm" id="detail-analise-btn">${RD.icon('bar-chart', { size: 14 })}Ver análise</button>
        <button class="btn btn-danger-ghost btn-sm" id="detail-remove-btn">${RD.icon('trash', { size: 14 })}Remover lead</button>
      </div>

      <div class="divider"></div>

      <div>
        <div class="font-semibold mb-2">Notas</div>
        <div class="flex gap-2 mb-3">
          <input class="input" id="note-input" placeholder="Ex: Proprietário bastante ativo no Instagram." />
          <button class="btn btn-primary btn-icon" id="add-note-btn">${RD.icon('plus', { size: 16 })}</button>
        </div>
        <div id="notes-list" style="display:flex;flex-direction:column;gap:8px;"></div>
      </div>

      <div class="divider"></div>

      <div>
        <div class="font-semibold mb-3">Histórico</div>
        <div class="timeline" id="timeline-list"></div>
      </div>
    `;

    const { panel, close } = RD.modal.open({ title: 'Detalhes do lead', bodyHtml, wide: true });

    function refreshNotes() {
      const l = RD.store.getLead(leadId);
      const list = panel.querySelector('#notes-list');
      if (!l.notes || !l.notes.length) { list.innerHTML = '<p class="text-tertiary text-sm">Nenhuma nota ainda.</p>'; return; }
      list.innerHTML = l.notes.map((n) => `
        <div class="card" style="padding:10px 12px;display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
          <div><div style="font-size:13.5px;">${RD.utils.escapeHtml(n.text)}</div><div class="text-tertiary text-xs mt-1">${RD.utils.timeAgo(n.createdAt)}</div></div>
          <button class="btn btn-ghost btn-icon btn-sm" data-note-remove="${n.id}">${RD.icon('x', { size: 13 })}</button>
        </div>`).join('');
      list.querySelectorAll('[data-note-remove]').forEach((btn) => btn.addEventListener('click', () => {
        RD.store.removeNote(leadId, btn.dataset.noteRemove);
        refreshNotes();
      }));
    }

    function refreshTimeline() {
      const l = RD.store.getLead(leadId);
      const list = panel.querySelector('#timeline-list');
      const items = (l.timeline || []).slice().reverse();
      list.innerHTML = items.map((t) => `
        <div class="timeline-item">
          <div class="timeline-dot">${RD.icon(TIMELINE_ICON[t.type] || 'clock', { size: 11 })}</div>
          <div><div class="timeline-date">${RD.utils.formatDate(t.createdAt, { withTime: true })}</div><div class="timeline-text">${RD.utils.escapeHtml(t.text)}</div></div>
        </div>`).join('') || '<p class="text-tertiary text-sm">Sem eventos ainda.</p>';
    }

    refreshNotes();
    refreshTimeline();

    panel.querySelector('#status-select').addEventListener('change', (e) => {
      RD.store.updateLeadStatus(leadId, e.target.value);
      RD.toast.show({ text: `Status atualizado para "${RD.store.STATUS_LABEL[e.target.value]}"`, type: 'success', icon: 'refresh-cw' });
      refreshTimeline();
      RD.shell.updateBadges();
      document.dispatchEvent(new CustomEvent('rd:leads-changed'));
    });

    panel.querySelector('#add-note-btn').addEventListener('click', () => {
      const input = panel.querySelector('#note-input');
      if (!input.value.trim()) return;
      RD.store.addNote(leadId, input.value.trim());
      input.value = '';
      refreshNotes();
      refreshTimeline();
    });
    panel.querySelector('#note-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') panel.querySelector('#add-note-btn').click();
    });

    panel.querySelector('#detail-wa-btn').addEventListener('click', () => RD.companyCard.openWhatsappComposer(RD.store.getLead(leadId)));
    panel.querySelector('#detail-analise-btn').addEventListener('click', () => RD.companyCard.openAnalysisModal(RD.store.getLead(leadId)));
    panel.querySelector('#detail-remove-btn').addEventListener('click', () => {
      RD.store.removeLead(leadId);
      RD.toast.show({ text: 'Lead removido', type: 'info', icon: 'trash' });
      RD.shell.updateBadges();
      document.dispatchEvent(new CustomEvent('rd:leads-changed'));
      close();
    });
  }

  RD.leadDetail = { open };
  document.addEventListener('rd:open-lead', (e) => open(e.detail.id));
})(window.RD = window.RD || {});
