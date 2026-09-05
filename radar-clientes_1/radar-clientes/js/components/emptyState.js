/* ==========================================================================
   Empty states e skeletons reutilizáveis
   ========================================================================== */
(function (RD) {
  function emptyState({ icon, title, text, actionLabel, actionHref, onAction }) {
    const btnId = 'empty-action-' + Math.random().toString(36).slice(2, 8);
    const html = `
      <div class="empty-state">
        <div class="empty-state-icon">${RD.icon(icon || 'search', { size: 32 })}</div>
        <h3>${RD.utils.escapeHtml(title)}</h3>
        <p>${RD.utils.escapeHtml(text)}</p>
        ${actionLabel ? `<a id="${btnId}" class="btn btn-primary mt-2" href="${actionHref || '#'}">${RD.icon('search', { size: 15 })}${RD.utils.escapeHtml(actionLabel)}</a>` : ''}
      </div>`;
    setTimeout(() => {
      const btn = document.getElementById(btnId);
      if (btn && onAction) btn.addEventListener('click', onAction);
    }, 0);
    return html;
  }

  function skeletonCards(n) {
    return `<div class="grid grid-3">${Array.from({ length: n || 6 }).map(() => '<div class="skeleton skeleton-card"></div>').join('')}</div>`;
  }

  function skeletonRows(n) {
    return Array.from({ length: n || 4 }).map(() => `
      <div class="card" style="padding:16px;display:flex;gap:14px;align-items:center;">
        <div class="skeleton" style="width:44px;height:44px;border-radius:12px;flex:none;"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
          <div class="skeleton" style="width:40%;height:14px;"></div>
          <div class="skeleton" style="width:65%;height:12px;"></div>
        </div>
      </div>`).join('');
  }

  RD.ui = RD.ui || {};
  RD.ui.emptyState = emptyState;
  RD.ui.skeletonCards = skeletonCards;
  RD.ui.skeletonRows = skeletonRows;
})(window.RD = window.RD || {});
