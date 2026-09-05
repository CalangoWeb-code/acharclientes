/* ==========================================================================
   Gerador de empresas — DADOS DE DEMONSTRAÇÃO (MOCK)
   --------------------------------------------------------------------------
   Não há nenhuma API real conectada. Tudo aqui é gerado localmente e
   claramente marcado como "_mock" para nunca ser confundido com dado real
   (ver seção 17/27 do briefing). Quando uma API de dados públicos estiver
   disponível, basta substituir a função `generateCompanies` por uma chamada
   real dentro de core/companyService.js — nada mais no app precisa mudar.
   ========================================================================== */
(function (RD) {
  const { mulberry32, hashStr, uid, pick, clamp } = RD.utils;

  const RUAS = ['Rua das Palmeiras', 'Av. Brasil', 'Rua XV de Novembro', 'Av. Independência', 'Rua Sete de Setembro', 'Rua Marechal Deodoro', 'Av. Paulista', 'Rua Barão do Rio Branco', 'Rua Dom Pedro II', 'Av. Getúlio Vargas'];
  const DESC_TEMPLATES = [
    'Atendimento familiar com foco em qualidade e proximidade com o cliente.',
    'Negócio local bem avaliado pela vizinhança, em atividade há alguns anos.',
    'Empresa de pequeno porte, atendimento presencial e por telefone.',
    'Estabelecimento popular na região, com bom volume de clientes recorrentes.',
    'Negócio em crescimento, buscando ampliar a divulgação para novos clientes.',
  ];

  function generateName(niche, rng) {
    const w = pick(niche.words, rng);
    const s = pick(niche.suffix, rng);
    return `${w} ${s}`;
  }

  function generatePhone(rng) {
    const ddd = pick(['11', '15', '19', '41', '31', '21', '51', '48', '71', '81', '85', '62', '61'], rng);
    const n = Math.floor(rng() * 90000000 + 10000000);
    return `(${ddd}) 9${String(n).slice(0, 4)}-${String(n).slice(4, 8)}`;
  }

  // Gera a "análise do site" — SOMENTE quando a empresa possui site.
  // Campos que não podem ser verificados de forma confiável ficam null,
  // e a interface deve exibir "Não foi possível verificar" para eles (seção 17).
  function generateSiteAnalysis(rng, siteQuality) {
    const unverifiableChance = 0.16; // uma fração dos campos é marcada como não verificável, de propósito
    const maybe = (val) => (rng() < unverifiableChance ? null : val);

    const isOld = siteQuality === 'desatualizado';
    const isGood = siteQuality === 'moderno';

    return {
      _analiseSimulada: true,
      responsivo: maybe(isGood ? true : isOld ? rng() < 0.25 : rng() < 0.6),
      https: maybe(rng() < (isOld ? 0.55 : 0.92)),
      performanceSinais: maybe(isOld ? pick(['lento', 'regular'], rng) : pick(['bom', 'regular'], rng)),
      design: siteQuality,
      experienciaMobile: maybe(isGood ? true : isOld ? false : rng() < 0.5),
      informacoesDisponiveis: maybe(rng() < 0.8),
      ctaClaro: maybe(isOld ? rng() < 0.3 : rng() < 0.7),
      whatsappNoSite: maybe(rng() < (isOld ? 0.2 : 0.5)),
      sinalAtualizacao: maybe(isOld ? 'desatualizado' : 'recente'),
    };
  }

  /**
   * Gera uma lista determinística (mesma seed => mesmo resultado) de empresas
   * mock para um nicho + localização. Determinístico para que a mesma busca
   * não gere resultados diferentes a cada clique, como uma base de dados real.
   */
  function generateCompanies({ nicheId, cidade, estado, bairro }) {
    const niche = RD.data.getNiche(nicheId);
    const seed = hashStr(`${nicheId}|${cidade}|${estado}|${bairro || ''}`);
    const rng = mulberry32(seed);
    const count = 14 + Math.floor(rng() * 34); // 14–47 empresas

    const companies = [];
    const usedNames = new Set();

    for (let i = 0; i < count; i++) {
      let nome = generateName(niche, rng);
      let attempts = 0;
      while (usedNames.has(nome) && attempts < 5) { nome = generateName(niche, rng); attempts++; }
      usedNames.add(nome);

      const temSite = rng() < 0.52;
      const siteQuality = !temSite ? null : pick(['moderno', 'razoavel', 'desatualizado', 'desatualizado'], rng);
      const instagramAtivo = rng() < 0.62;
      const possuiInstagram = instagramAtivo || rng() < 0.25;
      const possuiWhatsapp = rng() < 0.82;
      const avaliacao = Math.round((3.2 + rng() * 1.75) * 10) / 10;
      const numAvaliacoes = Math.floor(rng() * rng() * 480) + 3;

      companies.push({
        id: uid('cmp'),
        _mock: true,
        nome,
        categoria: niche.label,
        nicheId: niche.id,
        endereco: `${pick(RUAS, rng)}, ${Math.floor(rng() * 1800) + 10}`,
        bairro: bairro || pick(RD.data.BAIRROS, rng),
        cidade, estado,
        telefone: generatePhone(rng),
        whatsapp: possuiWhatsapp ? generatePhone(rng) : null,
        instagram: possuiInstagram ? `@${nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '')}` : null,
        instagramAtivo: possuiInstagram ? instagramAtivo : null,
        site: temSite ? `www.${nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '')}.com.br` : null,
        siteAnalysis: temSite ? generateSiteAnalysis(rng, siteQuality) : null,
        avaliacao: rng() < 0.08 ? null : avaliacao,
        numAvaliacoes: rng() < 0.08 ? null : numAvaliacoes,
        horarios: rng() < 0.3 ? null : 'Seg. a Sáb., 09h–18h',
        descricao: pick(DESC_TEMPLATES, rng),
      });
    }
    return companies;
  }

  RD.data.generateCompanies = generateCompanies;
})(window.RD = window.RD || {});
