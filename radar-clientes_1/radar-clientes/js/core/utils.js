/* ==========================================================================
   Utilitários gerais
   ========================================================================== */
(function (RD) {
  function uid(prefix) {
    return (prefix || 'id') + '_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function classNames() {
    return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  function formatDate(iso, opts) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    const withTime = opts && opts.withTime;
    const base = `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]}`;
    if (withTime) {
      return `${base} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
    return base;
  }

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'agora mesmo';
    if (min < 60) return `há ${min} min`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `há ${hr}h`;
    const day = Math.floor(hr / 24);
    if (day < 30) return `há ${day}d`;
    return formatDate(iso);
  }

  // anima um número de 'from' até 'to' dentro do elemento (duração em ms)
  function animateCount(el, to, opts) {
    opts = opts || {};
    const from = opts.from != null ? opts.from : 0;
    const duration = opts.duration || 900;
    const suffix = opts.suffix || '';
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out-cubic
      const val = Math.round(from + (to - from) * eased);
      el.textContent = val.toLocaleString('pt-BR') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function onlyDigits(str) {
    return (str || '').replace(/\D/g, '');
  }

  // monta um número de WhatsApp no formato internacional (assume BR se faltar DDI)
  function toWhatsappNumber(phone) {
    let digits = onlyDigits(phone);
    if (!digits) return null;
    if (digits.length <= 11) digits = '55' + digits;
    return digits;
  }

  function waLink(phone, message) {
    const num = toWhatsappNumber(phone);
    if (!num) return null;
    const base = `https://wa.me/${num}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e2) { /* noop */ }
      document.body.removeChild(ta);
      return true;
    }
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function pick(arr, rng) {
    return arr[Math.floor((rng ? rng() : Math.random()) * arr.length)];
  }

  // gerador pseudo-aleatório com seed (para resultados de busca estáveis por sessão)
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; }
    return h;
  }

  RD.utils = {
    uid, escapeHtml, classNames, debounce, formatDate, timeAgo, animateCount,
    onlyDigits, toWhatsappNumber, waLink, copyToClipboard, clamp, pick,
    mulberry32, hashStr,
  };
})(window.RD = window.RD || {});
