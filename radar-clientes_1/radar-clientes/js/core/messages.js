/* ==========================================================================
   Editor de mensagens — substituição de variáveis
   ========================================================================== */
(function (RD) {
  function applyTemplate(corpo, vars) {
    return (corpo || '').replace(/\{(\w+)\}/g, (m, key) => (vars[key] != null && vars[key] !== '' ? vars[key] : m));
  }

  function varsFromLead(lead) {
    const niche = RD.data.getNiche(lead.nicheId);
    return {
      empresa: lead.nome,
      nome: lead.nome,
      cidade: lead.cidade,
      nicho: (niche && niche.label ? niche.label.toLowerCase() : lead.categoria || '').replace(/^./, (c) => c),
    };
  }

  RD.messages = { applyTemplate, varsFromLead };
})(window.RD = window.RD || {});
