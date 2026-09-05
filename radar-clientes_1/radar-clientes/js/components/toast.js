/* ==========================================================================
   Sistema de toasts (feedback de microinterações)
   ========================================================================== */
(function (RD) {
  function ensureRoot() {
    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      document.body.appendChild(root);
    }
    return root;
  }

  function show(opts) {
    const root = ensureRoot();
    const type = opts.type || 'success';
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    const iconName = opts.icon || (type === 'success' ? 'check-circle' : 'info');
    el.innerHTML = `<span class="toast-icon">${RD.icon(iconName, { size: 14 })}</span><span>${RD.utils.escapeHtml(opts.text || '')}</span>`;
    root.appendChild(el);
    const timeout = opts.duration || 2600;
    setTimeout(() => {
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 220);
    }, timeout);
  }

  RD.toast = { show };
})(window.RD = window.RD || {});
