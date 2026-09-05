/* ==========================================================================
   Bootstrap da aplicação
   ========================================================================== */
(function (RD) {
  function registerRoutes() {
    RD.router.register('dashboard', RD.pages.dashboard);
    RD.router.register('buscar', RD.pages.buscar);
    RD.router.register('oportunidades', RD.pages.oportunidades);
    RD.router.register('leads', RD.pages.leads);
    RD.router.register('pipeline', RD.pages.pipeline);
    RD.router.register('mensagens', RD.pages.mensagens);
    RD.router.register('configuracoes', RD.pages.configuracoes);
  }

  function init() {
    RD.shell.renderShell();
    registerRoutes();
    RD.router.render();
    RD.shell.updateBadges();

    RD.store.subscribe(() => RD.shell.updateBadges());

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (RD.store.getState().theme === 'system') {
          const btn = document.getElementById('theme-toggle-btn');
          if (btn) btn.innerHTML = RD.icon(RD.shell.effectiveIsDark() ? 'sun' : 'moon', { size: 18 });
        }
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.RD = window.RD || {});
