/* ==========================================================================
   Gráficos leves em SVG — sem dependências externas
   ========================================================================== */
(function (RD) {
  const PALETTE = ['#4f5df5', '#38e8c6', '#f0b93d', '#ff6b6f', '#6ea8fe', '#b78bff', '#22c35e'];

  // gráfico de barras horizontal — data: [{label, value}]
  function barChart(data, opts) {
    opts = opts || {};
    const max = Math.max(1, ...data.map((d) => d.value));
    const rows = data.map((d, i) => {
      const pct = Math.round((d.value / max) * 100);
      return `
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:${opts.labelWidth || 108}px;font-size:12.5px;color:var(--text-secondary);flex:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${RD.utils.escapeHtml(d.label)}</div>
          <div style="flex:1;background:var(--bg-subtle);border-radius:999px;height:10px;overflow:hidden;">
            <div style="width:0%;height:100%;border-radius:999px;background:${PALETTE[i % PALETTE.length]};transition:width 900ms cubic-bezier(.16,1,.3,1) ${i * 60}ms;" data-bar-fill="${pct}"></div>
          </div>
          <div style="width:34px;text-align:right;font-size:12.5px;font-weight:700;flex:none;">${d.value}</div>
        </div>`;
    }).join('');
    return `<div class="chart-bars" style="display:flex;flex-direction:column;gap:12px;">${rows}</div>`;
  }

  function activateBars(container) {
    (container || document).querySelectorAll('[data-bar-fill]').forEach((el) => {
      const pct = el.getAttribute('data-bar-fill');
      requestAnimationFrame(() => { requestAnimationFrame(() => { el.style.width = pct + '%'; }); });
    });
  }

  // donut simples — data: [{label, value, color}]
  function donutChart(data, opts) {
    opts = opts || {};
    const size = opts.size || 150;
    const stroke = opts.stroke || 18;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let offset = 0;
    const segs = data.map((d, i) => {
      const frac = d.value / total;
      const dash = frac * c;
      const seg = `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${d.color || PALETTE[i % PALETTE.length]}" stroke-width="${stroke}"
        stroke-dasharray="${dash} ${c - dash}" stroke-dashoffset="${-offset}" stroke-linecap="butt"
        style="transition: stroke-dasharray 900ms cubic-bezier(.16,1,.3,1) ${i * 80}ms;" data-donut-dash="${dash} ${c - dash}" />`;
      offset += dash;
      return seg;
    }).join('');
    return `
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(-90deg);flex:none;">
          <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--bg-subtle)" stroke-width="${stroke}" />
          ${segs}
        </svg>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${data.map((d, i) => `
            <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;">
              <span style="width:9px;height:9px;border-radius:3px;background:${d.color || PALETTE[i % PALETTE.length]};flex:none;"></span>
              <span style="color:var(--text-secondary);">${RD.utils.escapeHtml(d.label)}</span>
              <span style="font-weight:700;margin-left:4px;">${d.value}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function activateDonut(container) {
    (container || document).querySelectorAll('[data-donut-dash]').forEach((el) => {
      const full = el.getAttribute('data-donut-dash');
      const r = parseFloat(el.getAttribute('r'));
      const c = 2 * Math.PI * r;
      el.setAttribute('stroke-dasharray', `0 ${c}`);
      requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute('stroke-dasharray', full)));
    });
  }

  RD.charts = { barChart, activateBars, donutChart, activateDonut, PALETTE };
})(window.RD = window.RD || {});
