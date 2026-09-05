/* ==========================================================================
   Página: Mensagens (modelos com variáveis)
   ========================================================================== */
(function (RD) {
  const SAMPLE_VARS = { empresa: 'Padaria Estrela', nome: 'Padaria Estrela', cidade: 'Sorocaba', nicho: 'padarias' };

  function render(root) {
    renderList(root);
  }

  function renderList(root) {
    const templates = RD.store.getState().messageTemplates;
    root.innerHTML = `
      <div class="flex items-center justify-between mb-4" style="flex-wrap:wrap;gap:10px;">
        <div>
          <h1 class="section-title">Modelos de mensagem</h1>
          <p class="section-sub">Use variáveis como <span class="kbd">{empresa}</span>, <span class="kbd">{nome}</span>, <span class="kbd">{cidade}</span> e <span class="kbd">{nicho}</span>. Elas são usadas automaticamente na tela de WhatsApp.</p>
        </div>
        <button class="btn btn-primary" id="new-tpl-btn">${RD.icon('plus', { size: 15 })}Novo modelo</button>
      </div>
      <div class="grid grid-2" id="tpl-grid"></div>
    `;
    const grid = document.getElementById('tpl-grid');
    grid.innerHTML = templates.map((t) => `
      <div class="card card-pad card-hover stagger-item">
        <div class="flex items-center justify-between mb-2">
          <div class="font-bold">${RD.utils.escapeHtml(t.nome)}</div>
          ${t.builtin ? '<span class="badge badge-neutral">Padrão</span>' : '<span class="badge badge-mock">Personalizado</span>'}
        </div>
        <p class="text-secondary text-sm" style="white-space:pre-wrap;">${RD.utils.escapeHtml(RD.messages.applyTemplate(t.corpo, SAMPLE_VARS))}</p>
        <div class="card-actions mt-3">
          <button class="btn btn-secondary btn-sm" data-edit="${t.id}">${RD.icon('edit', { size: 13 })}Editar</button>
          ${!t.builtin ? `<button class="btn btn-danger-ghost btn-sm" data-del="${t.id}">${RD.icon('trash', { size: 13 })}Excluir</button>` : ''}
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => openEditor(root, templates.find((t) => t.id === btn.dataset.edit))));
    grid.querySelectorAll('[data-del]').forEach((btn) => btn.addEventListener('click', () => {
      RD.store.deleteTemplate(btn.dataset.del);
      RD.toast.show({ text: 'Modelo excluído', type: 'info', icon: 'trash' });
      renderList(root);
    }));
    document.getElementById('new-tpl-btn').addEventListener('click', () => openEditor(root, null));
  }

  const VAR_BTNS = ['empresa', 'nome', 'cidade', 'nicho'];

  function openEditor(root, tpl) {
    const isNew = !tpl;
    const bodyHtml = `
      <div class="field">
        <label>Nome do modelo</label>
        <input class="input" id="tpl-nome" value="${tpl ? RD.utils.escapeHtml(tpl.nome) : ''}" placeholder="Ex: Segundo contato" />
      </div>
      <div class="field">
        <label>Inserir variável</label>
        <div class="flex gap-2" style="flex-wrap:wrap;">
          ${VAR_BTNS.map((v) => `<button type="button" class="btn btn-secondary btn-sm" data-insert="{${v}}">{${v}}</button>`).join('')}
        </div>
      </div>
      <div class="field">
        <label>Mensagem</label>
        <textarea class="input" id="tpl-corpo" rows="6">${tpl ? RD.utils.escapeHtml(tpl.corpo) : ''}</textarea>
      </div>
      <div class="field">
        <label>Pré-visualização (com dados de exemplo)</label>
        <div class="card" style="padding:12px 14px;background:var(--bg-subtle);border:none;" id="tpl-preview"></div>
      </div>
    `;
    const { panel, close } = RD.modal.open({
      title: isNew ? 'Novo modelo de mensagem' : 'Editar modelo',
      bodyHtml,
      footerHtml: `<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" id="save-tpl-btn">${RD.icon('check', { size: 15 })}Salvar modelo</button>`,
    });

    const textarea = panel.querySelector('#tpl-corpo');
    const preview = panel.querySelector('#tpl-preview');
    function refreshPreview() { preview.textContent = RD.messages.applyTemplate(textarea.value, SAMPLE_VARS) || '—'; }
    refreshPreview();
    textarea.addEventListener('input', refreshPreview);

    panel.querySelectorAll('[data-insert]').forEach((btn) => btn.addEventListener('click', () => {
      const pos = textarea.selectionStart || textarea.value.length;
      textarea.value = textarea.value.slice(0, pos) + btn.dataset.insert + textarea.value.slice(pos);
      textarea.focus();
      refreshPreview();
    }));

    panel.querySelector('[data-close]').addEventListener('click', close);
    panel.querySelector('#save-tpl-btn').addEventListener('click', () => {
      const nome = panel.querySelector('#tpl-nome').value.trim();
      const corpo = textarea.value.trim();
      if (!nome || !corpo) { RD.toast.show({ text: 'Preencha nome e mensagem', type: 'info', icon: 'alert-circle' }); return; }
      RD.store.saveTemplate({
        id: tpl ? tpl.id : RD.utils.uid('tpl'),
        nome, corpo, builtin: tpl ? tpl.builtin : false,
      });
      RD.toast.show({ text: 'Modelo salvo', type: 'success', icon: 'check-circle' });
      close();
      renderList(root);
    });
  }

  RD.pages = RD.pages || {};
  RD.pages.mensagens = render;
})(window.RD = window.RD || {});
