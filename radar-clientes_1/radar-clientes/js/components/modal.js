/* ==========================================================================
   Modal genérico com transição
   ========================================================================== */
(function (RD) {
  let activeBackdrop = null;
  let escHandler = null;

  function close() {
    if (!activeBackdrop) return;
    const el = activeBackdrop;
    activeBackdrop = null;
    el.style.animation = 'fadeInBd 160ms ease-out reverse';
    setTimeout(() => el.remove(), 150);
    if (escHandler) { document.removeEventListener('keydown', escHandler); escHandler = null; }
  }

  /**
   * @param {{title:string, bodyHtml:string, footerHtml?:string, wide?:boolean, onMount?:(panelEl)=>void, onClose?:()=>void}} opts
   */
  function open(opts) {
    close();
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-panel ${opts.wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title">${RD.utils.escapeHtml(opts.title || '')}</div>
          <button class="modal-close-btn" data-close>${RD.icon('x', { size: 18 })}</button>
        </div>
        <div class="modal-body">${opts.bodyHtml || ''}</div>
        ${opts.footerHtml ? `<div class="modal-footer">${opts.footerHtml}</div>` : ''}
      </div>
    `;
    backdrop.addEventListener('mousedown', (e) => { if (e.target === backdrop) { close(); opts.onClose && opts.onClose(); } });
    backdrop.querySelector('[data-close]').addEventListener('click', () => { close(); opts.onClose && opts.onClose(); });
    document.body.appendChild(backdrop);
    activeBackdrop = backdrop;
    escHandler = (e) => { if (e.key === 'Escape') { close(); opts.onClose && opts.onClose(); } };
    document.addEventListener('keydown', escHandler);
    const panel = backdrop.querySelector('.modal-panel');
    opts.onMount && opts.onMount(panel);
    return { panel, close };
  }

  RD.modal = { open, close };
})(window.RD = window.RD || {});
