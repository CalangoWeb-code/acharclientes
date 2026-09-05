# Radar de Clientes — Prospecção Inteligente

Aplicação web para encontrar, analisar e priorizar potenciais clientes para
serviços de criação de sites: escolha um nicho e uma localização, receba
empresas pontuadas por oportunidade, salve como leads, entre em contato pelo
WhatsApp com mensagens personalizáveis e acompanhe a negociação em um pipeline
(kanban).

## Como abrir

Não há instalação nem build. Duas formas de rodar:

1. **Mais simples:** dê duplo clique em `index.html` — ele abre direto no
   navegador (não usa módulos ES nem `fetch`, então funciona por `file://`).
2. **Recomendado:** sirva a pasta com qualquer servidor estático, por exemplo:
   ```bash
   python3 -m http.server 8080
   # depois acesse http://localhost:8080
   ```

Todos os dados (leads, notas, histórico de buscas, modelos de mensagem,
tema, pesos de pontuação) ficam salvos no `localStorage` do navegador —
recarregar a página não perde nada.

## Por que não Next.js / React / Tailwind / Framer Motion?

O pedido original listava essas tecnologias como preferência. Elas exigem
`npm install`, e o ambiente onde este projeto foi construído tem o acesso à
internet restrito pela política de rede da organização — o registro do npm
(`registry.npmjs.org`) está fora da lista de hosts permitidos neste sandbox,
então não foi possível instalar nenhum pacote (nem o Next.js, nem o React,
nem qualquer outra dependência) nem verificar um build aqui.

Diante disso, a aplicação foi construída como **HTML + CSS + JavaScript
puro (sem build step, sem dependências externas)**, preservando 100% dos
requisitos funcionais e visuais do pedido: navegação entre páginas,
componentes interativos, formulários, filtros combináveis, persistência,
animações (CSS + JS, no mesmo espírito do Framer Motion), responsividade de
verdade (não só encolher o layout) e uma experiência visual "SaaS premium".
Isso teve uma vantagem concreta: como não depende de nenhuma biblioteca
externa, o app funciona 100% offline e foi possível testar e revisar cada
tela e cada botão de ponta a ponta com Playwright ainda durante a construção
(veja a seção "O que foi verificado" abaixo) — algo que não seria possível
fazer com confiança sem conseguir instalar e buildar o projeto.

Se depois você tiver Node/npm disponível e quiser migrar para Next.js +
React + Tailwind + Framer Motion, a arquitetura já está organizada por
responsabilidade (camada de dados, camada de pontuação, componentes,
páginas) especificamente para tornar essa migração incremental, e não uma
reescrita — veja "Estrutura do projeto" abaixo.

## Estrutura do projeto

```
index.html                  shell da página (sidebar + topbar + <main>)
css/styles.css               design system completo (tokens, dark/light, componentes, animações)
js/core/icons.js              ícones SVG inline (sem dependência de biblioteca de ícones)
js/core/utils.js              helpers (datas, clipboard, link do WhatsApp, animação de números, RNG com seed)
js/core/store.js              estado global + persistência em localStorage (leads, perfil, pesos, templates)
js/core/scoring.js            motor de pontuação (0–100), com pesos configuráveis e motivos explicados
js/core/companyService.js     ÚNICA porta de entrada para "buscar empresas" — hoje usa mock, pronta para API real
js/core/messages.js           substituição de variáveis nos modelos de mensagem
js/core/router.js             roteador baseado em hash (#/dashboard, #/buscar, ...)
js/data/niches.js             lista de nichos e localizações de referência
js/data/mockCompanies.js      GERADOR DE DADOS MOCK — claramente isolado, nunca inventa dado fora daqui
js/components/*.js            sidebar, modal, toast, cards, gráficos, busca global, detalhe de lead
js/pages/*.js                 uma página por arquivo (dashboard, buscar, oportunidades, leads, pipeline, mensagens, configurações)
js/app.js                     bootstrap — registra rotas e inicia o app
```

## Conectando uma API real de dados de empresas no futuro

Toda a busca passa por **uma única função**: `RD.companyService.search()`
em `js/core/companyService.js`. Hoje ela chama o gerador mock
(`js/data/mockCompanies.js`). Para conectar uma API real:

1. Troque a constante `USING_REAL_API` para `true`.
2. Implemente a chamada dentro de `search()` — **sempre através de um
   backend seu**, nunca com a chave de API exposta no navegador.
3. Nenhuma outra tela do app precisa mudar, porque todas dependem apenas do
   formato de dado retornado por essa função.

Nenhuma chave, endpoint ou integração foi inventado — isso é só a "costura"
pronta para quando você tiver uma API de verdade.

## Regra de não inventar dados

Como não há nenhuma API conectada, tudo que aparece como empresa é gerado
localmente e sinalizado com o selo **"simulado"** nos cards e no banner de
"Modo demonstração". Na análise de site (seção "Ver análise"), campos que
uma análise real não teria como confirmar de forma confiável aparecem como
**"Não foi possível verificar"** em vez de um valor inventado — isso é
proposital (uma fração dos campos é sorteada como não verificável a cada
empresa) para deixar claro, mesmo em modo demonstração, a diferença entre
**dado encontrado** e **análise do sistema**.

## O que foi verificado

Antes da entrega, o fluxo completo foi automatizado com Playwright
(navegador real, headless) cobrindo: busca com filtros → animação de
carregamento em etapas reais → resultados pontuados e ordenados → abrir
"Ver análise" → salvar lead (toast + contador da sidebar atualiza) → abrir
composer de WhatsApp (modelo, variáveis, cópia do número) → página de Leads
salvos → Pipeline (drag-and-drop real entre colunas, clique abre detalhe) →
adicionar nota e trocar status (timeline atualiza) → editar modelos de
mensagem → Configurações (perfil, tema, pesos de pontuação, limpar dados) →
alternar dark/light mode → **recarregar a página e confirmar que tudo
persistiu** → busca global (Ctrl/Cmd+K) → visão mobile (menu, cards) →
navegação por teclado nos checkboxes de filtro (foco visível + espaço
alterna o valor). Nenhum botão do app é decorativo — todo `data-action`
tem um handler real.

## Limitações conhecidas

- Os dados são 100% simulados (ver seção acima) — não há scraping nem
  qualquer consulta a serviço externo.
- Os dados ficam no navegador (`localStorage`); trocar de navegador ou de
  computador não leva os dados junto. Estruturado para, no futuro, trocar
  por um backend com banco de dados sem reescrever as telas.
- As fontes (Google Fonts) são carregadas via CDN; sem internet, o app usa
  automaticamente as fontes do sistema — o layout não quebra.
