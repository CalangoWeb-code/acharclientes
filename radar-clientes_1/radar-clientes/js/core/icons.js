/* ==========================================================================
   Ícones — SVG inline desenhados à mão (sem dependência externa)
   Uso: RD.icon('home', {size:18, cls:'x'})
   ========================================================================== */
(function (RD) {
  const PATHS = {
    home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    bookmark: '<path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z"/>',
    'bookmark-filled': '<path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" fill="currentColor"/>',
    kanban: '<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M9 4v16M15 4v10"/>',
    message: '<path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-5 4V6.5a1 1 0 0 1 1-1Z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.6a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1-1.55V4.4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.5a1.7 1.7 0 0 0 1.55 1h.09a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" opacity="0"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.6a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.4a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1-1.55V4.4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.5a1.7 1.7 0 0 0 1.55 1h.09a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/>',
    whatsapp: '<path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.35-1.15A8.5 8.5 0 1 0 12 3.5Z"/><path d="M9 8.7c.2-.5.4-.5.6-.5h.5c.15 0 .35 0 .5.4.2.5.65 1.7.7 1.85.05.15.1.3 0 .5-.1.2-.15.3-.3.45s-.3.35-.45.5c-.15.15-.3.3-.15.6.15.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.35.3.15.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.25.65-.15.25.1 1.6.75 1.9.9.3.15.5.2.55.35.1.15.1.85-.2 1.65-.3.8-1.7 1.5-2.35 1.55-.6.05-1.35.1-4.35-1.65-3.65-2.15-3.65-2.15-4.15-4.5-.1-.4-.5-1.55-.5-2.55s.55-1.5.75-1.7Z" fill="currentColor" stroke="none"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.3-3.8-8.5S9.5 5.8 12 3.5Z"/>',
    star: '<path d="M12 3.8l2.5 5.2 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8Z"/>',
    'star-filled': '<path d="M12 3.8l2.5 5.2 5.6.8-4 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4-4 5.6-.8Z" fill="currentColor"/>',
    phone: '<path d="M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.25-.25.6-.35.9-.25 1 .35 2.1.5 3.2.5.55 0 1 .45 1 1V19.5c0 .55-.45 1-1 1C10 20.5 3.5 14 3.5 5.8c0-.55.45-1 1-1H7.7c.55 0 1 .45 1 1 0 1.1.15 2.2.5 3.2.1.3 0 .65-.25.9Z"/>',
    'map-pin': '<path d="M12 21s7-6.2 7-11.3A7 7 0 1 0 5 9.7C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    check: '<path d="M4.5 12.5l5 5 10-10.5"/>',
    'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.6 2.6L16.3 9"/>',
    x: '<path d="M5 5l14 14M19 5 5 19"/>',
    'chevron-down': '<path d="M5.5 8.5 12 15l6.5-6.5"/>',
    'chevron-right': '<path d="M8.5 5.5 15 12l-6.5 6.5"/>',
    'chevron-left': '<path d="M15.5 5.5 9 12l6.5 6.5"/>',
    plus: '<path d="M12 4.5v15M4.5 12h15"/>',
    trash: '<path d="M4.5 7h15M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8.5 0 .8 12a1 1 0 0 0 1 1h7.4a1 1 0 0 0 1-1l.8-12"/>',
    edit: '<path d="M4 19.5l1-3.6L15.6 5.3a1.4 1.4 0 0 1 2 0l1.1 1.1a1.4 1.4 0 0 1 0 2L8.1 19l-4.1.5Z"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3.5"/>',
    'external-link': '<path d="M14 4.5h5.5V10M19.2 4.8 10.5 13.5M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10"/>',
    moon: '<path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z"/>',
    sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.2M12 18.8V21M4.9 4.9l1.55 1.55M17.55 17.55 19.1 19.1M3 12h2.2M18.8 12H21M4.9 19.1l1.55-1.55M17.55 6.45 19.1 4.9"/>',
    menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
    filter: '<path d="M4 5.5h16l-6 7.5v5.3l-4 2V13Z"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M16.3 6a3.2 3.2 0 0 1 0 6.15M20.5 19.5a5.2 5.2 0 0 0-4.3-6.4"/>',
    'trending-up': '<path d="M4 16.5 10 10l4 4 6.5-7.5"/><path d="M15 6.5h5.5V12"/>',
    'alert-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v6"/><circle cx="12" cy="16.7" r="0.6" fill="currentColor" stroke="none"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 16.2v-5"/><circle cx="12" cy="8" r="0.6" fill="currentColor" stroke="none"/>',
    loader: '<path d="M12 3.5v3M12 17.5v3M5.1 5.1l2.1 2.1M16.8 16.8l2.1 2.1M3.5 12h3M17.5 12h3M5.1 18.9l2.1-2.1M16.8 7.2l2.1-2.1" stroke-opacity="0.85"/>',
    grip: '<circle cx="9" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1" fill="currentColor" stroke="none"/>',
    note: '<path d="M6 4.5h9l3.5 3.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1Z"/><path d="M15 4.5V8h3.5"/><path d="M8 12.5h6M8 15.5h4"/>',
    send: '<path d="M4.5 12 20 4.5 12.7 20l-1.9-6.3L4.5 12Z"/>',
    sparkles: '<path d="M12 3.5 13.3 8 17.5 9.3 13.3 10.6 12 15.1 10.7 10.6 6.5 9.3 10.7 8Z"/><path d="M18.5 14.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z"/>',
    'bar-chart': '<path d="M4.5 20.5v-7M12 20.5V5.5M19.5 20.5v-11"/>',
    'pie-chart': '<path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5H12Z"/><path d="M15.5 4.3A8.5 8.5 0 0 0 12 3.5v8.5l3.5-7.7Z"/>',
    zap: '<path d="M13 3.5 5.5 13.5H11l-1 7 8-10.5h-5.5Z"/>',
    building: '<rect x="4.5" y="3.5" width="10" height="17" rx="1"/><path d="M14.5 9.5h5v11h-5"/><path d="M7.5 7.5h1M10.5 7.5h1M7.5 11h1M10.5 11h1M7.5 14.5h1M10.5 14.5h1M17 13h1M17 16.5h1"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    layers: '<path d="M12 3.5 3.5 8 12 12.5 20.5 8Z"/><path d="M3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5"/>',
    'refresh-cw': '<path d="M20 8A8 8 0 0 0 6.3 5.3L4 7.5M4 4v3.5h3.5M4 16a8 8 0 0 0 13.7 2.7L20 16.5M20 20v-3.5h-3.5"/>',
    'thumbs-down': '<path d="M18 4.5h-3.4a1 1 0 0 0-.95.7L11 10.5v9l1.2-.2c.4-.05.75-.3.9-.65l2.4-5.2H19a1.5 1.5 0 0 0 1.45-2.1L18 4.5Z"/><path d="M6 4.5h2v9H6z"/>',
    briefcase: '<rect x="3.5" y="8" width="17" height="11.5" rx="2"/><path d="M8.5 8V6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2M3.5 13.5h17"/>',
    'help-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M9.5 9.3a2.5 2.5 0 1 1 3.8 2.1c-.7.45-1.3.9-1.3 1.8v.3"/><circle cx="12" cy="16.7" r="0.6" fill="currentColor" stroke="none"/>',
    slack: '<path d="M9 4a1.8 1.8 0 1 0 0 3.6h1.8V5.8A1.8 1.8 0 0 0 9 4Z"/><path d="M15 20a1.8 1.8 0 1 0 0-3.6h-1.8V18a1.8 1.8 0 0 0 1.8 1.8Z"/><path d="M20 9a1.8 1.8 0 1 0-3.6 0v1.8H18A1.8 1.8 0 0 0 20 9Z"/><path d="M4 15a1.8 1.8 0 1 0 3.6 0v-1.8H6A1.8 1.8 0 0 0 4 15Z"/>',
  };

  function icon(name, opts) {
    opts = opts || {};
    const size = opts.size || 18;
    const cls = opts.cls ? ` ${opts.cls}` : '';
    const body = PATHS[name] || PATHS['help-circle'];
    return `<svg class="icon${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  RD.icon = icon;
})(window.RD = window.RD || {});
