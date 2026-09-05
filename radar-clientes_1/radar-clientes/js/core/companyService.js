/* ==========================================================================
   Camada de serviço — busca de empresas
   --------------------------------------------------------------------------
   Esta é a ÚNICA porta de entrada para "encontrar empresas" no app.
   Hoje ela usa o gerador mock (data/mockCompanies.js). Quando uma API real
   de dados públicos (ex.: Google Places, um provedor de dados empresariais
   etc.) for integrada, a troca acontece SOMENTE aqui — e a chamada deve ir
   para um backend próprio, nunca expor chaves de API no frontend.

   Cada etapa abaixo (preparar, localizar, analisar, pontuar, organizar)
   corresponde a um passo real de processamento que o service executa —
   os textos mostrados na tela de busca (ver pages/buscar.js) refletem
   exatamente essas etapas, nunca texto decorativo desconectado do que
   está realmente acontecendo.
   ========================================================================== */
(function (RD) {
  const USING_REAL_API = false; // troque para true quando uma API real for conectada

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  /**
   * @param {{nicheId:string, cidade:string, estado:string, bairro?:string, filtros:object}} params
   * @param {(stageId:string)=>void} onStage — chamado no INÍCIO de cada etapa real
   */
  async function search(params, onStage) {
    if (USING_REAL_API) {
      throw new Error('Nenhuma API real configurada. Conecte um provedor de dados em core/companyService.js.');
    }

    onStage && onStage('preparando');
    await wait(380);

    onStage && onStage('localizando');
    let companies = RD.data.generateCompanies({
      nicheId: params.nicheId, cidade: params.cidade, estado: params.estado, bairro: params.bairro,
    });
    await wait(520);

    onStage && onStage('analisando');
    const weights = RD.store.getState().scoringWeights;
    companies = companies.map((c) => {
      const result = RD.scoring.scoreCompany(c, weights);
      return Object.assign({}, c, { score: result.score, scoreReasons: result.reasons, classificacao: result.classificacao });
    });
    await wait(560);

    onStage && onStage('identificando');
    companies.sort((a, b) => b.score - a.score);
    const filtered = applyFilters(companies, params.filtros);
    await wait(400);

    onStage && onStage('organizando');
    await wait(320);

    return { all: companies, results: filtered };
  }

  function applyFilters(companies, filtros) {
    if (!filtros) return companies;
    return companies.filter((c) => {
      if (filtros.semSite && c.site) return false;
      if (filtros.siteBaixaQualidade && !(c.siteAnalysis && c.siteAnalysis.design !== 'moderno')) return false;
      if (filtros.siteDesatualizado && !(c.siteAnalysis && c.siteAnalysis.design === 'desatualizado')) return false;
      if (filtros.problemasMobile && !(c.siteAnalysis && (c.siteAnalysis.responsivo === false || c.siteAnalysis.experienciaMobile === false))) return false;
      if (filtros.instagramAtivo && !c.instagramAtivo) return false;
      if (filtros.whatsappDisponivel && !c.whatsapp) return false;
      if (filtros.boaAvaliacao && !(c.avaliacao != null && c.avaliacao >= 4.4)) return false;
      if (filtros.muitasAvaliacoes && !(c.numAvaliacoes != null && c.numAvaliacoes >= 50)) return false;
      if (filtros.avaliacaoMinima && !(c.avaliacao != null && c.avaliacao >= filtros.avaliacaoMinima)) return false;
      return true;
    });
  }

  RD.companyService = { search, applyFilters, USING_REAL_API };
})(window.RD = window.RD || {});
