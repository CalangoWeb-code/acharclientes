/* ==========================================================================
   Router — baseado em hash, sem dependências
   ========================================================================== */
(function (RD) {
  const routes = {};
  let currentPath = null;
  const listeners = [];

  function register(path, renderFn) { routes[path] = renderFn; }

  function onChange(fn) { listeners.push(fn); }

  function parseHash() {
    const raw = location.hash.replace(/^#\/?/, '') || 'dashboard';
    const [path, query] = raw.split('?');
    const params = {};
    if (query) {
      query.split('&').forEach((pair) => {
        const [k, v] = pair.split('=');
        params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    return { path: path || 'dashboard', params };
  }

  function navigate(path) {
    if (location.hash.replace(/^#\/?/, '') === path) { render(); return; }
    location.hash = '/' + path;
  }

  async function render() {
    const { path, params } = parseHash();
    currentPath = path;
    const base = path.split('?')[0];
    const renderFn = routes[base] || routes['dashboard'];
    const root = document.getElementById('page-root');
    root.innerHTML = '';
    listeners.forEach((fn) => fn(base));
    try {
      await renderFn(root, params);
    } catch (e) {
      console.error('Erro ao renderizar página', e);
      root.innerHTML = `<div class="empty-state">${RD.icon('alert-circle', { size: 32 })}<h3>Ops, algo deu errado</h3><p>${RD.utils.escapeHtml(e.message)}</p></div>`;
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function current() { return currentPath; }

  window.addEventListener('hashchange', render);

  RD.router = { register, navigate, render, current, onChange };
})(window.RD = window.RD || {});
