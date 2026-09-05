/* ==========================================================================
   Sidebar / navegação (desktop + mobile) + tema
   ========================================================================== */
(function (RD) {
  const NAV_ITEMS = [
    { path: 'dashboard', label: 'Dashboard', icon: 'home' },
    { path: 'buscar', label: 'Encontrar empresas', icon: 'search' },
    { path: 'oportunidades', label: 'Oportunidades', icon: 'target' },
    { path: 'leads', label: 'Leads salvos', icon: 'bookmark' },
    { path: 'pipeline', label: 'Pipeline', icon: 'kanban' },
    { path: 'mensagens', label: 'Mensagens', icon: 'message' },
    { path: 'configuracoes', label: 'Configurações', icon: 'settings' },
  ];

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
  }

  function effectiveIsDark() {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr) return attr === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function renderShell() {
    const shell = document.getElementById('app-shell');
    const state = RD.store.getState();
    applyTheme(state.theme);

    shell.innerHTML = `
      <div class="mobile-nav-scrim" id="nav-scrim"></div>
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-brand-mark">${RD.icon('target', { size: 20 })}</div>
          <div class="sidebar-brand-text">Radar de Clientes<small>Prospecção inteligente</small></div>
        </div>
        <nav class="sidebar-nav" id="sidebar-nav">
          ${NAV_ITEMS.map((item) => `
            <a class="nav-item" data-path="${item.path}" href="#/${item.path}">
              ${RD.icon(item.icon, { size: 19 })}<span>${item.label}</span>
              <span class="nav-badge" data-badge="${item.path}" hidden></span>
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <button class="sidebar-collapse-btn" id="collapse-btn">
            ${RD.icon('chevron-left', { size: 15 })}<span id="collapse-label">Recolher menu</span>
          </button>
        </div>
      </aside>
      <div class="main-col">
        <header class="topbar">
          <button class="btn btn-icon btn-ghost" id="mobile-menu-btn" style="display:none">${RD.icon('menu', { size: 20 })}</button>
          <div class="topbar-title" id="topbar-title">Dashboard</div>
          <div class="topbar-spacer"></div>
          <button class="btn btn-secondary btn-sm" id="global-search-btn">
            ${RD.icon('search', { size: 15 })}<span>Buscar tudo</span><span class="kbd">Ctrl K</span>
          </button>
          <button class="btn btn-icon btn-ghost" id="theme-toggle-btn" title="Alternar tema"></button>
        </header>
        <main class="page" id="page-root"></main>
      </div>
    `;

    updateThemeIcon();
    updateCollapsedState();

    // navegação
    shell.querySelectorAll('.nav-item').forEach((a) => {
      a.addEventListener('click', () => { closeMobileNav(); });
    });

    document.getElementById('collapse-btn').addEventListener('click', () => {
      const s = RD.store.getState();
      RD.store.setSidebarCollapsed(!s.sidebarCollapsed);
      updateCollapsedState();
    });

    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
      const isDark = effectiveIsDark();
      RD.store.setTheme(isDark ? 'light' : 'dark');
      applyTheme(RD.store.getState().theme);
      updateThemeIcon();
      RD.toast.show({ text: isDark ? 'Modo claro ativado' : 'Modo escuro ativado', icon: isDark ? 'sun' : 'moon', type: 'info' });
    });

    document.getElementById('mobile-menu-btn').addEventListener('click', openMobileNav);
    document.getElementById('nav-scrim').addEventListener('click', closeMobileNav);
    document.getElementById('global-search-btn').addEventListener('click', () => RD.globalSearch.open());

    window.addEventListener('resize', updateMobileVisibility);
    updateMobileVisibility();

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        RD.globalSearch.open();
      }
    });

    RD.router.onChange(highlightActive);
  }

  function updateMobileVisibility() {
    const isMobile = window.innerWidth <= 900;
    document.getElementById('mobile-menu-btn').style.display = isMobile ? 'inline-flex' : 'none';
  }

  function openMobileNav() {
    document.getElementById('sidebar').classList.add('mobile-open');
    document.getElementById('nav-scrim').classList.add('visible');
  }
  function closeMobileNav() {
    document.getElementById('sidebar').classList.remove('mobile-open');
    document.getElementById('nav-scrim').classList.remove('visible');
  }

  function updateCollapsedState() {
    const collapsed = RD.store.getState().sidebarCollapsed && window.innerWidth > 900;
    document.getElementById('app-shell').classList.toggle('sidebar-collapsed', !!RD.store.getState().sidebarCollapsed);
    const label = document.getElementById('collapse-label');
    const btn = document.getElementById('collapse-btn');
    if (label) label.textContent = RD.store.getState().sidebarCollapsed ? 'Expandir menu' : 'Recolher menu';
    if (btn) btn.querySelector('svg').style.transform = RD.store.getState().sidebarCollapsed ? 'rotate(180deg)' : '';
  }

  function updateThemeIcon() {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.innerHTML = RD.icon(effectiveIsDark() ? 'sun' : 'moon', { size: 18 });
  }

  const TITLES = {
    dashboard: 'Dashboard', buscar: 'Encontrar empresas', oportunidades: 'Oportunidades encontradas',
    leads: 'Leads salvos', pipeline: 'Pipeline', mensagens: 'Mensagens', configuracoes: 'Configurações',
  };

  function highlightActive(path) {
    document.querySelectorAll('.nav-item').forEach((a) => a.classList.toggle('active', a.dataset.path === path));
    const titleEl = document.getElementById('topbar-title');
    if (titleEl) titleEl.textContent = TITLES[path] || 'Radar de Clientes';
    updateBadges();
  }

  function updateBadges() {
    const state = RD.store.getState();
    const leadsBadge = document.querySelector('[data-badge="leads"]');
    if (leadsBadge) {
      if (state.leads.length) { leadsBadge.textContent = state.leads.length; leadsBadge.hidden = false; }
      else leadsBadge.hidden = true;
    }
    const highOpp = state.leads.filter((l) => l.classificacao === 'alta' && l.status !== 'cliente' && l.status !== 'nao_interessado').length;
    const pipelineBadge = document.querySelector('[data-badge="pipeline"]');
    if (pipelineBadge) {
      if (highOpp) { pipelineBadge.textContent = highOpp; pipelineBadge.hidden = false; }
      else pipelineBadge.hidden = true;
    }
  }

  RD.shell = { renderShell, applyTheme, effectiveIsDark, updateBadges };
})(window.RD = window.RD || {});
