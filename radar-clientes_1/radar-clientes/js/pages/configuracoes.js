/* ==========================================================================
   Página: Configurações
   ========================================================================== */
(function (RD) {
  const WEIGHT_LABELS = {
    semSite: 'Não possui site', siteDesatualizado: 'Site desatualizado', problemasMobile: 'Problemas em dispositivos móveis',
    boaPresencaDigital: 'Boa presença digital', boaAvaliacao: 'Boa avaliação', muitasAvaliacoes: 'Grande quantidade de avaliações',
    instagramAtivo: 'Instagram ativo', whatsappDisponivel: 'WhatsApp disponível',
  };

  function render(root) {
    const state = RD.store.getState();
    root.innerHTML = `
      <h1 class="section-title mb-1">Configurações</h1>
      <p class="section-sub mb-4">Seus dados ficam salvos apenas neste navegador (localStorage).</p>

      <div class="grid grid-2" style="align-items:start;">
        <div class="card card-pad">
          <div class="font-bold mb-3">Perfil</div>
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div class="field"><label>Nome</label><input class="input" id="p-nome" value="${RD.utils.escapeHtml(state.profile.nome)}" /></div>
            <div class="field"><label>Nome do negócio</label><input class="input" id="p-negocio" value="${RD.utils.escapeHtml(state.profile.negocio)}" /></div>
            <div class="field"><label>WhatsApp</label><input class="input" id="p-whatsapp" value="${RD.utils.escapeHtml(state.profile.whatsapp)}" placeholder="(11) 90000-0000" /></div>
            <div class="field"><label>Instagram</label><input class="input" id="p-instagram" value="${RD.utils.escapeHtml(state.profile.instagram)}" placeholder="@seuusuario" /></div>
            <div class="field"><label>GitHub</label><input class="input" id="p-github" value="${RD.utils.escapeHtml(state.profile.github)}" /></div>
            <div class="field"><label>E-mail</label><input class="input" id="p-email" type="email" value="${RD.utils.escapeHtml(state.profile.email)}" /></div>
            <button class="btn btn-primary" id="save-profile-btn">${RD.icon('check', { size: 15 })}Salvar perfil</button>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px;">
          <div class="card card-pad">
            <div class="font-bold mb-3">Aparência</div>
            <div class="flex gap-2">
              <button class="btn ${state.theme === 'light' ? 'btn-primary' : 'btn-secondary'} btn-sm" data-theme-opt="light">${RD.icon('sun', { size: 14 })}Claro</button>
              <button class="btn ${state.theme === 'dark' ? 'btn-primary' : 'btn-secondary'} btn-sm" data-theme-opt="dark">${RD.icon('moon', { size: 14 })}Escuro</button>
              <button class="btn ${state.theme === 'system' ? 'btn-primary' : 'btn-secondary'} btn-sm" data-theme-opt="system">${RD.icon('settings', { size: 14 })}Sistema</button>
            </div>
          </div>

          <div class="card card-pad">
            <div class="flex items-center justify-between mb-2">
              <div class="font-bold">Pesos de pontuação</div>
              <button class="btn btn-ghost btn-sm" id="reset-weights-btn">${RD.icon('refresh-cw', { size: 13 })}Restaurar padrão</button>
            </div>
            <p class="text-secondary text-sm mb-3">Ajuste o quanto cada critério pesa na pontuação de 0 a 100 (seção 13).</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${Object.keys(WEIGHT_LABELS).map((key) => `
                <div class="flex items-center justify-between gap-3">
                  <span class="text-sm">${WEIGHT_LABELS[key]}</span>
                  <input class="input" style="width:76px;text-align:center;" type="number" min="0" max="50" data-weight="${key}" value="${state.scoringWeights[key]}" />
                </div>
              `).join('')}
            </div>
            <button class="btn btn-primary btn-block mt-3" id="save-weights-btn">${RD.icon('check', { size: 15 })}Salvar pesos</button>
          </div>

          <div class="card card-pad" style="border-color:var(--danger);">
            <div class="font-bold mb-2" style="color:var(--danger-text);">Zona de risco</div>
            <p class="text-secondary text-sm mb-3">Remove todos os leads, notas, buscas e modelos personalizados salvos neste navegador. Essa ação não pode ser desfeita.</p>
            <button class="btn btn-danger-ghost" id="clear-data-btn" style="border:1.5px solid var(--danger);">${RD.icon('trash', { size: 15 })}Limpar todos os dados</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('save-profile-btn').addEventListener('click', () => {
      RD.store.setProfile({
        nome: document.getElementById('p-nome').value.trim(),
        negocio: document.getElementById('p-negocio').value.trim(),
        whatsapp: document.getElementById('p-whatsapp').value.trim(),
        instagram: document.getElementById('p-instagram').value.trim(),
        github: document.getElementById('p-github').value.trim(),
        email: document.getElementById('p-email').value.trim(),
      });
      RD.toast.show({ text: 'Perfil salvo', type: 'success', icon: 'check-circle' });
    });

    root.querySelectorAll('[data-theme-opt]').forEach((btn) => btn.addEventListener('click', () => {
      RD.store.setTheme(btn.dataset.themeOpt);
      RD.shell.applyTheme(RD.store.getState().theme);
      render(root);
      RD.toast.show({ text: 'Preferência de tema salva', type: 'success', icon: 'check-circle' });
    }));

    document.getElementById('save-weights-btn').addEventListener('click', () => {
      const patch = {};
      root.querySelectorAll('[data-weight]').forEach((input) => { patch[input.dataset.weight] = RD.utils.clamp(parseInt(input.value, 10) || 0, 0, 50); });
      RD.store.setScoringWeights(patch);
      RD.toast.show({ text: 'Pesos de pontuação atualizados', type: 'success', icon: 'check-circle' });
    });
    document.getElementById('reset-weights-btn').addEventListener('click', () => {
      RD.store.resetScoringWeights();
      render(root);
      RD.toast.show({ text: 'Pesos restaurados para o padrão', type: 'info', icon: 'refresh-cw' });
    });

    document.getElementById('clear-data-btn').addEventListener('click', () => {
      RD.modal.open({
        title: 'Limpar todos os dados?',
        bodyHtml: '<p class="text-secondary text-sm">Isso apaga permanentemente todos os leads, notas, histórico de buscas e modelos personalizados salvos neste navegador.</p>',
        footerHtml: `<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn" style="background:var(--danger);color:#fff;" id="confirm-clear-btn">${RD.icon('trash', { size: 14 })}Sim, limpar tudo</button>`,
        onMount(panel) {
          panel.querySelector('[data-close]').addEventListener('click', RD.modal.close);
          panel.querySelector('#confirm-clear-btn').addEventListener('click', () => {
            RD.store.clearAllData();
            RD.modal.close();
            RD.toast.show({ text: 'Todos os dados foram apagados', type: 'info', icon: 'trash' });
            RD.shell.updateBadges();
            RD.router.navigate('dashboard');
          });
        },
      });
    });
  }

  RD.pages = RD.pages || {};
  RD.pages.configuracoes = render;
})(window.RD = window.RD || {});
