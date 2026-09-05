/* ==========================================================================
   Dados de referência — nichos e localizações
   ========================================================================== */
(function (RD) {
  const NICHES = [
    { id: 'restaurantes', label: 'Restaurantes', icon: 'zap', words: ['Sabor', 'Cantina', 'Ponto', 'Cozinha', 'Point', 'Sítio'], suffix: ['do Chef', 'da Praça', 'Real', 'Bella', 'Gourmet', 'Caseiro'] },
    { id: 'padarias', label: 'Padarias', icon: 'building', words: ['Padaria', 'Panificadora', 'Casa do Pão', 'Pão de Ouro', 'Delícia'], suffix: ['Estrela', 'do Bairro', 'São José', 'Aurora', 'Central', 'Doce Trigo'] },
    { id: 'cafeterias', label: 'Cafeterias', icon: 'sparkles', words: ['Café', 'Espresso', 'Grão', 'Cafeteria'], suffix: ['Real', 'do Centro', 'Aroma', 'Colonial', 'Bourbon', 'da Esquina'] },
    { id: 'barbearias', label: 'Barbearias', icon: 'target', words: ['Barbearia', 'Barber', 'Navalha', 'Old School'], suffix: ['Prime', 'do Zé', 'Real', 'Classic', 'Elite', 'Vintage'] },
    { id: 'saloes', label: 'Salões de beleza', icon: 'star', words: ['Studio', 'Espaço', 'Salão', 'Beauty'], suffix: ['Elegance', 'Hair', 'Glam', 'Bella', 'Charme', 'Class'] },
    { id: 'clinicas', label: 'Clínicas', icon: 'help-circle', words: ['Clínica', 'Centro Médico', 'Instituto'], suffix: ['Vida', 'Saúde Total', 'Bem Estar', 'São Lucas', 'Nova Era'] },
    { id: 'academias', label: 'Academias', icon: 'trending-up', words: ['Academia', 'Studio Fit', 'Box'], suffix: ['Fitness', 'Power', 'Evolution', 'Force', 'Move', 'Ativa'] },
    { id: 'lojas', label: 'Lojas', icon: 'briefcase', words: ['Loja', 'Boutique', 'Multimarcas'], suffix: ['Fashion', 'Estilo', 'Popular', 'Center', 'Prime'] },
    { id: 'oficinas', label: 'Oficinas', icon: 'settings', words: ['Oficina', 'Auto Center', 'Mecânica'], suffix: ['do Zé', 'Motors', 'Total Car', 'Express', 'Confiança'] },
    { id: 'hoteis', label: 'Hotéis', icon: 'building', words: ['Hotel', 'Hotelaria'], suffix: ['Plaza', 'Central', 'Executivo', 'Real', 'Comfort'] },
    { id: 'pousadas', label: 'Pousadas', icon: 'home', words: ['Pousada', 'Recanto', 'Refúgio'], suffix: ['do Vale', 'Sol Nascente', 'da Serra', 'Bela Vista', 'Encanto'] },
    { id: 'imobiliarias', label: 'Imobiliárias', icon: 'building', words: ['Imobiliária', 'Realty', 'Negócios'], suffix: ['Prime', 'Confiança', 'Lar Novo', 'Central', 'Horizonte'] },
    { id: 'escritorios', label: 'Escritórios', icon: 'briefcase', words: ['Escritório', 'Consultoria', 'Advocacia'], suffix: ['& Associados', 'Contábil', 'Jurídica', 'Business'] },
    { id: 'servicos', label: 'Empresas de serviços', icon: 'layers', words: ['Serviços', 'Assistência', 'Grupo'], suffix: ['Rápido', 'Express', 'Total', 'Confiança', 'Prime'] },
    { id: 'outros', label: 'Outros', icon: 'sparkles', words: ['Empresa', 'Grupo', 'Casa'], suffix: ['Prime', 'Central', 'Express', 'Nova Era'] },
  ];

  const LOCATIONS = [
    { cidade: 'Sorocaba', estado: 'SP' }, { cidade: 'São Paulo', estado: 'SP' }, { cidade: 'Campinas', estado: 'SP' },
    { cidade: 'Santos', estado: 'SP' }, { cidade: 'Ribeirão Preto', estado: 'SP' }, { cidade: 'São José dos Campos', estado: 'SP' },
    { cidade: 'Curitiba', estado: 'PR' }, { cidade: 'Londrina', estado: 'PR' }, { cidade: 'Belo Horizonte', estado: 'MG' },
    { cidade: 'Uberlândia', estado: 'MG' }, { cidade: 'Rio de Janeiro', estado: 'RJ' }, { cidade: 'Niterói', estado: 'RJ' },
    { cidade: 'Porto Alegre', estado: 'RS' }, { cidade: 'Florianópolis', estado: 'SC' }, { cidade: 'Joinville', estado: 'SC' },
    { cidade: 'Salvador', estado: 'BA' }, { cidade: 'Recife', estado: 'PE' }, { cidade: 'Fortaleza', estado: 'CE' },
    { cidade: 'Goiânia', estado: 'GO' }, { cidade: 'Brasília', estado: 'DF' },
  ];

  const BAIRROS = ['Centro', 'Jardim das Flores', 'Vila Nova', 'Alto da Serra', 'Boa Vista', 'Santa Rosa', 'Vila Progresso', 'Parque das Nações', 'Jardim América', 'São José'];

  RD.data = RD.data || {};
  RD.data.NICHES = NICHES;
  RD.data.LOCATIONS = LOCATIONS;
  RD.data.BAIRROS = BAIRROS;
  RD.data.getNiche = (id) => NICHES.find((n) => n.id === id) || NICHES[NICHES.length - 1];
})(window.RD = window.RD || {});
