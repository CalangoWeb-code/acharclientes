/* ==========================================================================
   Store central — estado da aplicação + persistência em localStorage
   Estruturado para futuramente ser trocado por um backend real (seção 29/27):
   toda leitura/escrita passa por este módulo, então trocar localStorage por
   chamadas de API não deveria exigir tocar nas telas.
   ========================================================================== */
(function (RD) {
  const STORAGE_KEY = 'radar-clientes:v1';

  const DEFAULT_WEIGHTS = {
    semSite: 25,
    siteDesatualizado: 20,
    problemasMobile: 15,
    boaPresencaDigital: 10,
    boaAvaliacao: 10,
    muitasAvaliacoes: 10,
    instagramAtivo: 5,
    whatsappDisponivel: 5,
  };

  const DEFAULT_TEMPLATES = [
    {
      id: 'tpl_primeiro_contato',
      nome: 'Primeiro contato',
      builtin: true,
      corpo:
        'Olá, {empresa}! Tudo bem? Sou desenvolvedor de sites e encontrei vocês enquanto pesquisava empresas de {nicho} em {cidade}. Percebi algumas oportunidades na presença digital da empresa e gostaria de apresentar uma ideia rápida — posso te mostrar em 2 minutos?',
    },
    {
      id: 'tpl_follow_up',
      nome: 'Follow-up',
      builtin: true,
      corpo:
        'Oi, {empresa}! Passando para saber se você chegou a ver minha mensagem sobre o site de vocês. Fico à disposição para tirar dúvidas ou marcar uma conversa rápida.',
    },
    {
      id: 'tpl_apresentacao',
      nome: 'Apresentação',
      builtin: true,
      corpo:
        'Olá, {nome}! Sou desenvolvedor especializado em sites para negócios de {nicho}. Ajudo empresas como a {empresa} a conquistar mais clientes com uma presença digital profissional. Posso te mostrar alguns exemplos?',
    },
    {
      id: 'tpl_proposta',
      nome: 'Proposta',
      builtin: true,
      corpo:
        'Olá, {empresa}! Preparei uma proposta para a criação do site de vocês, pensando no público de {cidade}. Posso te enviar os detalhes por aqui mesmo?',
    },
  ];

  const DEFAULT_STATE = {
    version: 1,
    theme: 'system', // 'light' | 'dark' | 'system'
    sidebarCollapsed: false,
    profile: {
      nome: 'Miguel',
      negocio: 'CalangoWeb',
      whatsapp: '',
      instagram: '',
      github: 'CalangoWeb-code',
      email: '',
    },
    scoringWeights: Object.assign({}, DEFAULT_WEIGHTS),
    messageTemplates: DEFAULT_TEMPLATES,
    leads: [], // empresas salvas (viram leads) — ver core/scoring.js e data/mockCompanies.js para o formato
    searchHistory: [], // últimas buscas (nicho + localização) para o dashboard
    lastSearch: null, // { niche, location, filters, results, timestamp }
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredCloneSafe(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      // merge raso para tolerar novas chaves adicionadas em versões futuras
      return Object.assign(structuredCloneSafe(DEFAULT_STATE), parsed, {
        profile: Object.assign({}, DEFAULT_STATE.profile, parsed.profile || {}),
        scoringWeights: Object.assign({}, DEFAULT_WEIGHTS, parsed.scoringWeights || {}),
        messageTemplates: parsed.messageTemplates && parsed.messageTemplates.length ? parsed.messageTemplates : DEFAULT_TEMPLATES,
      });
    } catch (e) {
      console.warn('Não foi possível ler dados salvos, iniciando estado novo.', e);
      return structuredCloneSafe(DEFAULT_STATE);
    }
  }

  function structuredCloneSafe(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  let state = load();
  const listeners = new Set();
  let persistTimer = null;

  function persist() {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Falha ao salvar no localStorage (armazenamento cheio ou bloqueado).', e);
      }
    }, 60);
  }

  function notify() {
    listeners.forEach((fn) => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function getState() { return state; }

  // aplica uma função "producer(draft)" e persiste — padrão simples de imutabilidade rasa
  function update(producer) {
    const next = structuredCloneSafe(state);
    producer(next);
    state = next;
    persist();
    notify();
  }

  // ---------------------------------------------------------------------
  // Ações
  // ---------------------------------------------------------------------
  const STATUS_ORDER = [
    'novo', 'pesquisado', 'contato_pendente', 'contatado', 'respondeu',
    'interessado', 'proposta', 'negociacao', 'cliente', 'nao_interessado',
  ];

  const STATUS_LABEL = {
    novo: 'Novo',
    pesquisado: 'Pesquisado',
    contato_pendente: 'Contato pendente',
    contatado: 'Contatado',
    respondeu: 'Respondeu',
    interessado: 'Interessado',
    proposta: 'Proposta enviada',
    negociacao: 'Negociação',
    cliente: 'Cliente',
    nao_interessado: 'Não interessado',
  };

  const PIPELINE_COLUMNS = [
    'novo', 'contato_pendente', 'contatado', 'respondeu', 'interessado', 'proposta', 'cliente',
  ];

  function saveLead(company) {
    let created = null;
    update((draft) => {
      if (draft.leads.some((l) => l.id === company.id)) return;
      const lead = Object.assign({}, company, {
        status: 'novo',
        savedAt: new Date().toISOString(),
        notes: [],
        timeline: [
          { id: RD.utils.uid('tl'), type: 'created', text: 'Empresa adicionada aos leads.', createdAt: new Date().toISOString() },
        ],
      });
      draft.leads.unshift(lead);
      created = lead;
    });
    return created;
  }

  function removeLead(id) {
    update((draft) => { draft.leads = draft.leads.filter((l) => l.id !== id); });
  }

  function getLead(id) {
    return state.leads.find((l) => l.id === id) || null;
  }

  function updateLeadStatus(id, status, opts) {
    update((draft) => {
      const lead = draft.leads.find((l) => l.id === id);
      if (!lead) return;
      const prevLabel = STATUS_LABEL[lead.status] || lead.status;
      lead.status = status;
      lead.timeline = lead.timeline || [];
      lead.timeline.push({
        id: RD.utils.uid('tl'),
        type: 'status',
        text: `Status alterado de "${prevLabel}" para "${STATUS_LABEL[status] || status}".`,
        createdAt: new Date().toISOString(),
      });
      if (opts && opts.silent) { /* usado por drag&drop para evitar toast duplicado */ }
    });
  }

  function addNote(id, text) {
    update((draft) => {
      const lead = draft.leads.find((l) => l.id === id);
      if (!lead) return;
      lead.notes = lead.notes || [];
      lead.notes.unshift({ id: RD.utils.uid('note'), text, createdAt: new Date().toISOString() });
      lead.timeline = lead.timeline || [];
      lead.timeline.push({ id: RD.utils.uid('tl'), type: 'note', text: 'Nota adicionada.', createdAt: new Date().toISOString() });
    });
  }

  function removeNote(id, noteId) {
    update((draft) => {
      const lead = draft.leads.find((l) => l.id === id);
      if (!lead) return;
      lead.notes = (lead.notes || []).filter((n) => n.id !== noteId);
    });
  }

  function logContact(id, channel) {
    update((draft) => {
      const lead = draft.leads.find((l) => l.id === id);
      if (!lead) return;
      lead.timeline = lead.timeline || [];
      lead.timeline.push({ id: RD.utils.uid('tl'), type: 'contact', text: `Contato iniciado via ${channel}.`, createdAt: new Date().toISOString() });
      if (lead.status === 'novo' || lead.status === 'pesquisado') {
        lead.status = 'contatado';
      }
    });
  }

  function setTheme(theme) {
    update((draft) => { draft.theme = theme; });
  }

  function setSidebarCollapsed(v) {
    update((draft) => { draft.sidebarCollapsed = v; });
  }

  function setProfile(patch) {
    update((draft) => { draft.profile = Object.assign({}, draft.profile, patch); });
  }

  function setScoringWeights(patch) {
    update((draft) => { draft.scoringWeights = Object.assign({}, draft.scoringWeights, patch); });
  }

  function resetScoringWeights() {
    update((draft) => { draft.scoringWeights = Object.assign({}, DEFAULT_WEIGHTS); });
  }

  function saveTemplate(tpl) {
    update((draft) => {
      const idx = draft.messageTemplates.findIndex((t) => t.id === tpl.id);
      if (idx >= 0) draft.messageTemplates[idx] = tpl;
      else draft.messageTemplates.push(tpl);
    });
  }

  function deleteTemplate(id) {
    update((draft) => {
      draft.messageTemplates = draft.messageTemplates.filter((t) => t.id !== id || t.builtin);
    });
  }

  function setLastSearch(payload) {
    update((draft) => {
      draft.lastSearch = payload;
      draft.searchHistory = draft.searchHistory || [];
      draft.searchHistory.unshift({
        niche: payload.niche, location: payload.location, count: payload.results.length, timestamp: payload.timestamp,
      });
      draft.searchHistory = draft.searchHistory.slice(0, 12);
    });
  }

  function clearAllData() {
    state = structuredCloneSafe(DEFAULT_STATE);
    persist();
    notify();
  }

  RD.store = {
    getState, subscribe, update,
    saveLead, removeLead, getLead, updateLeadStatus, addNote, removeNote, logContact,
    setTheme, setSidebarCollapsed, setProfile, setScoringWeights, resetScoringWeights,
    saveTemplate, deleteTemplate, setLastSearch, clearAllData,
    STATUS_ORDER, STATUS_LABEL, PIPELINE_COLUMNS, DEFAULT_WEIGHTS,
  };
})(window.RD = window.RD || {});
