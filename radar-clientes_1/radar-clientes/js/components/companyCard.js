/* ==========================================================================
   Card de empresa/oportunidade + ações (WhatsApp, Instagram, site, análise,
   salvar lead). Reutilizado em Oportunidades, Leads salvos e Pipeline.
   ========================================================================== */
(function (RD) {
  function scoreColor(classificacao) {
    if (classificacao === 'alta') return 'var(--success)';
    if (classificacao === 'media') return 'var(--warning)';
    return 'var(--danger)';
  }

  function scoreRing(score, classificacao) {
    const r = 26, c = 2 * Math.PI * r;
    const dash = (score / 100) * c;
    return `
      <div class="score-ring-wrap">
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--bg-subtle)" stroke-width="7"/>
          <circle cx="32" cy="32" r="${r}" fill="none" stroke="${scoreColor(classificacao)}" stroke-width="7"
            stroke-linecap="round" stroke-dasharray="${dash} ${c - dash}" data-score-dash="${dash} ${c - dash}"/>
        </svg>
        <div class="score-ring-value">${score}</div>
      </div>`;
  }

  function activateRings(container) {
    (container || document).querySelectorAll('[data-score-dash]').forEach((el) => {
      const full = el.getAttribute('data-score-dash');
      const c = 2 * Math.PI * 26;
      el.setAttribute('stroke-dasharray', `0 ${c}`);
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dasharray 900ms cubic-bezier(.16,1,.3,1)';
        requestAnimationFrame(() => el.setAttribute('stroke-dasharray', full));
      });
    });
  }

  function infoRow(iconName, label, ok, okText, noText) {
    const known = ok !== null && ok !== undefined;
    const cls = ok ? 'val-yes' : 'val-no';
    return `<div class="info-row">${RD.icon(iconName, { size: 15 })}<span>${label}:</span> <span class="${cls}">${!known ? 'Não foi possível verificar' : (ok ? okText : noText)}</span></div>`;
  }

  function renderCard(company, opts) {
    opts = opts || {};
    const isSaved = !!RD.store.getLead(company.id);
    const badgeClass = company.classificacao === 'alta' ? 'badge-alta' : company.classificacao === 'media' ? 'badge-media' : 'badge-baixa';

    return `
      <div class="card card-hover company-card stagger-item" data-company-id="${company.id}" style="animation-delay:${(opts.index || 0) * 55}ms">
        <div class="company-card-top">
          <div style="min-width:0;">
            <div class="company-name">${RD.utils.escapeHtml(company.nome)}</div>
            <div class="company-meta">
              ${company.avaliacao != null ? `<span class="company-meta-item">${RD.icon('star-filled', { size: 14 })} ${company.avaliacao.toFixed(1)}${company.numAvaliacoes != null ? ` (${company.numAvaliacoes})` : ''}</span>` : `<span class="company-meta-item text-tertiary">${RD.icon('star', { size: 14 })} Sem avaliação</span>`}
              <span class="company-meta-item">${RD.icon('map-pin', { size: 14 })} ${RD.utils.escapeHtml(company.cidade)} - ${company.estado}</span>
              <span class="company-meta-item">${RD.icon('building', { size: 14 })} ${RD.utils.escapeHtml(company.categoria)}</span>
            </div>
          </div>
          ${scoreRing(company.score, company.classificacao)}
        </div>

        <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:6px;">
          <span class="badge ${badgeClass}">${RD.scoring.classificacaoLabel(company.classificacao)}</span>
          ${opts.isLead ? `<span class="badge badge-neutral">${RD.icon('kanban', { size: 12 })} ${RD.store.STATUS_LABEL[company.status] || company.status}</span>` : `<span class="badge badge-mock" title="Dados gerados para demonstração — nenhuma API real está conectada">${RD.icon('info', { size: 12 })} simulado</span>`}
        </div>

        <div class="info-row-list">
          ${infoRow('globe', 'Site', company.site ? true : false, company.site, 'Não encontrado')}
          ${infoRow('instagram', 'Instagram', company.instagramAtivo, 'Ativo', company.instagram ? 'Encontrado, mas pouco ativo' : 'Não encontrado')}
          ${infoRow('whatsapp', 'WhatsApp', !!company.whatsapp, 'Disponível', 'Não disponível')}
        </div>

        <details class="reasons-details">
          <summary style="cursor:pointer;font-size:12.5px;font-weight:700;color:var(--text-secondary);list-style:none;display:flex;align-items:center;gap:6px;">
            ${RD.icon('chevron-right', { size: 13, cls: 'summary-chevron' })} Por que essa pontuação?
          </summary>
          <div class="reasons-list mt-2">
            ${company.scoreReasons.map((r) => `
              <div class="reason-item">${RD.icon('check', { size: 14 })}<span>${RD.utils.escapeHtml(r.label)}</span><span class="reason-points">+${r.points}</span></div>
            `).join('') || '<span class="text-tertiary text-sm">Nenhum critério de oportunidade identificado.</span>'}
          </div>
        </details>

        <div class="card-actions">
          <button class="btn btn-whatsapp btn-sm" data-action="whatsapp" ${!company.whatsapp ? 'disabled' : ''}>${RD.icon('whatsapp', { size: 14 })}WhatsApp</button>
          <button class="btn btn-secondary btn-sm" data-action="instagram" ${!company.instagram ? 'disabled' : ''}>${RD.icon('instagram', { size: 14 })}Instagram</button>
          <button class="btn btn-secondary btn-sm" data-action="site" ${!company.site ? 'disabled' : ''}>${RD.icon('globe', { size: 14 })}Site</button>
          <button class="btn btn-secondary btn-sm" data-action="analise">${RD.icon('bar-chart', { size: 14 })}Ver análise</button>
          ${opts.isLead ? `<button class="btn btn-secondary btn-sm" data-action="detalhes">${RD.icon('note', { size: 14 })}Detalhes</button>` : ''}
          <button class="btn ${isSaved ? 'btn-success' : 'btn-primary'} btn-sm" data-action="salvar" data-saved="${isSaved}">
            ${RD.icon(isSaved ? 'check' : 'bookmark', { size: 14 })}<span>${isSaved ? 'Lead salvo' : 'Salvar lead'}</span>
          </button>
        </div>
      </div>
      <style>.reasons-details[open] .summary-chevron{ transform: rotate(90deg); } .reasons-details summary::-webkit-details-marker{ display:none; } .summary-chevron{ transition: transform 160ms; }</style>
    `;
  }

  // -----------------------------------------------------------------------
  // Ações (delegação de eventos)
  // -----------------------------------------------------------------------
  function findCompanyById(id, pool) {
    if (pool) { const f = pool.find((c) => c.id === id); if (f) return f; }
    return RD.store.getLead(id);
  }

  function initCardActions(container, pool) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const cardEl = e.target.closest('[data-company-id]');
      const id = cardEl && cardEl.dataset.companyId;
      const company = findCompanyById(id, pool);
      if (!company) return;
      const action = btn.dataset.action;

      if (action === 'whatsapp') openWhatsappComposer(company);
      else if (action === 'instagram') openInstagram(company);
      else if (action === 'site') openSite(company);
      else if (action === 'analise') openAnalysisModal(company);
      else if (action === 'salvar') toggleSaveLead(company, btn);
      else if (action === 'detalhes') RD.leadDetail.open(company.id);
    });
  }

  function toggleSaveLead(company, btn) {
    const existing = RD.store.getLead(company.id);
    if (existing) {
      RD.store.removeLead(company.id);
      btn.dataset.saved = 'false';
      btn.classList.remove('btn-success'); btn.classList.add('btn-primary');
      btn.innerHTML = `${RD.icon('bookmark', { size: 14 })}<span>Salvar lead</span>`;
      RD.toast.show({ text: 'Lead removido dos salvos', type: 'info', icon: 'trash' });
    } else {
      RD.store.saveLead(company);
      btn.dataset.saved = 'true';
      btn.classList.remove('btn-primary'); btn.classList.add('btn-success');
      btn.innerHTML = `${RD.icon('check', { size: 14 })}<span>Lead salvo</span>`;
      btn.style.transform = 'scale(1.12)';
      setTimeout(() => { btn.style.transform = ''; }, 180);
      RD.toast.show({ text: `${company.nome} salvo como lead ⭐`, type: 'success', icon: 'star-filled' });
    }
    RD.shell.updateBadges();
    document.dispatchEvent(new CustomEvent('rd:leads-changed'));
  }

  function openInstagram(company) {
    if (!company.instagram) return;
    const handle = company.instagram.replace('@', '');
    window.open(`https://instagram.com/${handle}`, '_blank', 'noopener');
    RD.toast.show({ text: 'Abrindo Instagram…', type: 'info', icon: 'instagram' });
  }

  function openSite(company) {
    if (!company.site) return;
    const url = company.site.startsWith('http') ? company.site : `https://${company.site}`;
    window.open(url, '_blank', 'noopener');
    RD.toast.show({ text: 'Abrindo site…', type: 'info', icon: 'external-link' });
  }

  function openWhatsappComposer(company) {
    if (!company.whatsapp) return;
    const state = RD.store.getState();
    const templates = state.messageTemplates;
    const vars = RD.messages.varsFromLead(company);
    let currentTplId = templates[0].id;

    const bodyHtml = `
      <div class="field">
        <label>Modelo de mensagem</label>
        <div class="select-wrap">
          <select class="select" id="tpl-select">
            ${templates.map((t) => `<option value="${t.id}">${RD.utils.escapeHtml(t.nome)}</option>`).join('')}
          </select>
          ${RD.icon('chevron-down')}
        </div>
      </div>
      <div class="field">
        <label>Mensagem (revise antes de enviar)</label>
        <textarea class="input" id="msg-textarea" rows="6"></textarea>
        <span class="helper-text">Variáveis disponíveis: {empresa} {nome} {cidade} {nicho}. Nada é enviado automaticamente — você revisa e confirma no WhatsApp.</span>
      </div>
      <div class="info-row-list" style="flex-direction:row;justify-content:space-between;">
        <div class="info-row">${RD.icon('phone', { size: 15 })}<span>${company.whatsapp}</span></div>
        <button class="btn btn-ghost btn-sm" id="copy-number-btn">${RD.icon('copy', { size: 13 })}Copiar número</button>
      </div>
    `;
    const footerHtml = `
      <button class="btn btn-secondary" data-close>Cancelar</button>
      <button class="btn btn-whatsapp" id="send-wa-btn">${RD.icon('whatsapp', { size: 15 })}Abrir WhatsApp</button>
    `;

    const { panel, close } = RD.modal.open({ title: `Contato via WhatsApp — ${company.nome}`, bodyHtml, footerHtml });
    const textarea = panel.querySelector('#msg-textarea');
    const select = panel.querySelector('#tpl-select');

    function refreshText() {
      const tpl = templates.find((t) => t.id === select.value) || templates[0];
      textarea.value = RD.messages.applyTemplate(tpl.corpo, vars);
    }
    refreshText();
    select.addEventListener('change', refreshText);

    panel.querySelector('#copy-number-btn').addEventListener('click', async () => {
      await RD.utils.copyToClipboard(company.whatsapp);
      RD.toast.show({ text: 'Número copiado', icon: 'copy', type: 'info' });
    });

    panel.querySelector('[data-close]').addEventListener('click', close);
    panel.querySelector('#send-wa-btn').addEventListener('click', () => {
      const link = RD.utils.waLink(company.whatsapp, textarea.value);
      if (!link) return;
      window.open(link, '_blank', 'noopener');
      if (RD.store.getLead(company.id)) RD.store.logContact(company.id, 'WhatsApp');
      RD.toast.show({ text: 'WhatsApp aberto — revise e envie por lá', type: 'success', icon: 'whatsapp' });
      close();
      document.dispatchEvent(new CustomEvent('rd:leads-changed'));
    });
  }

  function verifStr(val, textTrue, textFalse) {
    if (val === null || val === undefined) return '<span class="text-tertiary">Não foi possível verificar</span>';
    return val ? `<span style="color:var(--success-text);font-weight:600;">${textTrue}</span>` : `<span style="color:var(--danger-text);font-weight:600;">${textFalse}</span>`;
  }

  function openAnalysisModal(company) {
    const a = company.siteAnalysis;
    const bodyHtml = `
      <div>
        <span class="badge badge-neutral">${RD.icon('info', { size: 12 })} Dados encontrados</span>
        <div class="info-row-list mt-2">
          ${infoRow('map-pin', 'Endereço', true, RD.utils.escapeHtml(`${company.endereco}, ${company.bairro}`), '')}
          ${infoRow('phone', 'Telefone', !!company.telefone, company.telefone, 'Não encontrado')}
          ${infoRow('star', 'Avaliação', company.avaliacao != null, company.avaliacao != null ? `${company.avaliacao} (${company.numAvaliacoes} avaliações)` : '', 'Sem dados públicos')}
          ${infoRow('clock', 'Horário', !!company.horarios, company.horarios || '', 'Não encontrado')}
          ${infoRow('globe', 'Site', !!company.site, company.site || '', 'Não encontrado')}
        </div>
      </div>
      <div>
        <span class="badge badge-mock">${RD.icon('bar-chart', { size: 12 })} Análise do sistema (simulada para demonstração)</span>
        ${!company.site ? `
          <p class="text-secondary text-sm mt-3">Esta empresa não possui site — por isso não há análise técnica a exibir. A ausência de site já é, por si, considerada uma oportunidade (ver pontuação).</p>
        ` : `
          <div class="mt-2" style="display:flex;flex-direction:column;gap:10px;">
            <div class="flex justify-between"><span class="text-sm text-secondary">Responsivo (funciona bem no celular)</span>${verifStr(a.responsivo, 'Sim', 'Não')}</div>
            <div class="flex justify-between"><span class="text-sm text-secondary">HTTPS (conexão segura)</span>${verifStr(a.https, 'Sim', 'Não')}</div>
            <div class="flex justify-between"><span class="text-sm text-secondary">Sinais de performance</span><span class="font-semibold">${a.performanceSinais ? ({ bom: 'Bons sinais', regular: 'Regular', lento: 'Sinais de lentidão' })[a.performanceSinais] : '<span class="text-tertiary">Não foi possível verificar</span>'}</span></div>
            <div class="flex justify-between"><span class="text-sm text-secondary">Design</span><span class="font-semibold">${a.design ? ({ moderno: 'Moderno', razoavel: 'Razoável', desatualizado: 'Desatualizado' })[a.design] : '—'}</span></div>
            <div class="flex justify-between"><span class="text-sm text-secondary">Experiência mobile</span>${verifStr(a.experienciaMobile, 'Boa', 'Com problemas')}</div>
            <div class="flex justify-between"><span class="text-sm text-secondary">Informações da empresa visíveis</span>${verifStr(a.informacoesDisponiveis, 'Sim', 'Não')}</div>
            <div class="flex justify-between"><span class="text-sm text-secondary">CTA / formas de contato claras</span>${verifStr(a.ctaClaro, 'Sim', 'Não')}</div>
            <div class="flex justify-between"><span class="text-sm text-secondary">Botão de WhatsApp no site</span>${verifStr(a.whatsappNoSite, 'Sim', 'Não')}</div>
            <div class="flex justify-between"><span class="text-sm text-secondary">Sinal de atualização de conteúdo</span><span class="font-semibold">${a.sinalAtualizacao ? ({ recente: 'Parece atualizado', desatualizado: 'Parece desatualizado' })[a.sinalAtualizacao] : '<span class="text-tertiary">Não foi possível verificar</span>'}</span></div>
          </div>
        `}
      </div>
      <div class="divider"></div>
      <div>
        <div class="font-semibold text-sm mb-2">Por que essa pontuação — ${company.score}/100</div>
        <div class="reasons-list">
          ${company.scoreReasons.map((r) => `<div class="reason-item">${RD.icon('check', { size: 14 })}<span>${RD.utils.escapeHtml(r.label)}</span><span class="reason-points">+${r.points}</span></div>`).join('') || '<span class="text-tertiary text-sm">Nenhum critério identificado.</span>'}
        </div>
      </div>
    `;
    RD.modal.open({ title: `Análise — ${company.nome}`, bodyHtml, wide: true, footerHtml: '<button class="btn btn-secondary" data-close>Fechar</button>' });
  }

  RD.companyCard = { renderCard, activateRings, initCardActions, openWhatsappComposer, openAnalysisModal, toggleSaveLead };
})(window.RD = window.RD || {});
