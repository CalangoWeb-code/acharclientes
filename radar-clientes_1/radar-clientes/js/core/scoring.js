/* ==========================================================================
   Motor de pontuação — 0 a 100, com motivos explicados (seção 13/14)
   Pesos configuráveis em Configurações → RD.store.setScoringWeights()
   ========================================================================== */
(function (RD) {
  function scoreCompany(company, weights) {
    const w = weights || RD.store.DEFAULT_WEIGHTS;
    const reasons = [];
    let score = 0;

    function add(points, label) {
      if (points <= 0) return;
      score += points;
      reasons.push({ label, points });
    }

    const hasSite = !!company.site;
    const analysis = company.siteAnalysis;

    if (!hasSite) {
      add(w.semSite, 'Não possui site');
    } else {
      if (analysis && analysis.design === 'desatualizado') {
        add(w.siteDesatualizado, 'Site claramente desatualizado');
      }
      if (analysis && (analysis.responsivo === false || analysis.experienciaMobile === false)) {
        add(w.problemasMobile, 'Problemas relevantes em dispositivos móveis');
      }
      if (analysis && analysis.design === 'moderno' && analysis.responsivo === true && analysis.https === true) {
        add(w.boaPresencaDigital, 'Boa presença digital (site atual)');
        // quando a presença digital já é boa, isso reduz a urgência — não soma pontos de urgência adicionais
      }
    }

    if (company.avaliacao != null && company.avaliacao >= 4.4) {
      add(w.boaAvaliacao, 'Boa avaliação');
    }
    if (company.numAvaliacoes != null && company.numAvaliacoes >= 50) {
      add(w.muitasAvaliacoes, 'Muitas avaliações');
    }
    if (company.instagramAtivo) {
      add(w.instagramAtivo, 'Instagram ativo');
    }
    if (company.whatsapp) {
      add(w.whatsappDisponivel, 'WhatsApp disponível');
    }

    score = RD.utils.clamp(score, 0, 100);

    let classificacao = 'baixa';
    if (score >= 70) classificacao = 'alta';
    else if (score >= 42) classificacao = 'media';

    reasons.sort((a, b) => b.points - a.points);

    return { score, reasons, classificacao };
  }

  function classificacaoLabel(c) {
    if (c === 'alta') return '🟢 Excelente oportunidade';
    if (c === 'media') return '🟡 Boa oportunidade';
    return '🔴 Oportunidade limitada';
  }

  RD.scoring = { scoreCompany, classificacaoLabel };
})(window.RD = window.RD || {});
