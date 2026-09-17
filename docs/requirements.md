# Próxima Sessão — Requisitos do MVP

## 1. Visão do produto

Este documento foi definido na ETAPA 2 do trabalho acadêmico de Web Development da FIAP e revisado com o [template oficial de requisitos](../template_ref/requirements.md). Ele preserva as instruções de [contexto.md](../contexto.md) e a proposta aprovada na ETAPA 1.

### Nome e escopo

O nome do produto é **Próxima Sessão**. O MVP contempla Home, Busca, Detalhes e Minha Lista. Os requisitos abaixo descrevem o comportamento esperado e orientam a implementação e a [revisão final](review.md).

### Público

Pessoas que assistem a filmes e séries e precisam de uma maneira simples de organizar suas próximas escolhas, pelo celular, tablet ou computador.

### Problema

Ao encontrar um filme ou uma série interessante, o usuário pode esquecer o título ou deixá-lo anotado em lugares diferentes. Quando decide assistir a algo, precisa procurar novamente as opções que já haviam despertado seu interesse.

### Proposta de solução

Criar um site que apresente conteúdos populares, permita pesquisar títulos e consultar seus detalhes e ofereça uma lista pessoal do que o usuário pretende assistir.

As informações dos filmes e das séries são obtidas da API TMDB. A lista pessoal é salva no navegador com `localStorage`, sem cadastro.

Fluxo principal: descobrir ou pesquisar um título → consultar detalhes → adicionar à lista → acessar a lista quando quiser escolher o que assistir.

## 2. Objetivo do MVP

Ajudar o usuário a descobrir filmes e séries e guardar os títulos que deseja assistir, para encontrá-los facilmente quando for escolher sua próxima sessão.

Ao final, o usuário deve conseguir explorar populares, buscar um título, consultar seus detalhes, adicioná-lo à Minha Lista, reencontrá-lo após recarregar a página e removê-lo. Esse fluxo deve funcionar em celular, tablet e desktop, com informações reais da API e mensagens para carregamento, ausência de resultados e falhas.

## 3. Funcionalidades, user stories e critérios de aceitação

Os identificadores F01 a F06 seguem a organização do template. Os identificadores anteriores RF01 a RF06 permanecem como equivalentes, preservando os vínculos com a arquitetura e a revisão final. Os estados de cada funcionalidade são descritos abaixo; a seção 4 consolida seus comportamentos.

### F01 (RF01) — Explorar a Home

**Descrição:** apresentar filmes e séries populares em duas seções independentes, permitindo abrir os detalhes pelos cards.

**Estados:** carregando ao abrir a página; sucesso com cards; vazio sem conteúdos na seção; erro de consulta. Filmes e séries podem apresentar estados diferentes.

**User Story:** Como usuário, quero visualizar filmes e séries populares para descobrir opções para assistir.

**Critérios de aceitação:**

- A Home apresenta filmes populares e séries populares obtidos da API TMDB.
- Os conteúdos aparecem em cards com título, pôster quando disponível e identificação de filme ou série.
- Selecionar um conteúdo abre os detalhes do título correspondente.
- Durante a consulta, a página informa que está carregando.
- Se a consulta falhar, a página apresenta uma mensagem de erro compreensível.
- Se a consulta retornar uma lista vazia, a página informa que não há conteúdos disponíveis naquela seção.

### F02 (RF02) — Pesquisar filmes e séries

**Descrição:** consultar títulos pelo nome enviado no formulário e exibir somente filmes e séries.

**Estados:** inicial com orientação; campo vazio com aviso; carregando; sucesso com resultados; vazio sem resultados; erro de consulta.

**User Story:** Como usuário, quero pesquisar filmes e séries pelo nome para encontrar um título de meu interesse.

**Critérios de aceitação:**

- A página Busca possui um campo de texto e uma ação para pesquisar.
- Ao enviar um termo preenchido, a aplicação consulta a API e exibe os filmes e as séries encontrados em cards.
- Uma busca vazia ou composta apenas por espaços não gera uma consulta; a interface orienta o usuário a digitar um título.
- Os resultados exibidos se limitam a filmes e séries.
- Selecionar um resultado abre seus detalhes.
- A interface diferencia carregamento, resultados encontrados, nenhum resultado e erro de consulta.
- Ao realizar uma nova busca, os resultados apresentados correspondem ao novo termo, sem misturar buscas anteriores.

### F03 (RF03) — Consultar detalhes

**Descrição:** apresentar as informações do título identificado pela rota e a ação para guardá-lo na lista.

**Estados:** carregando; conteúdo encontrado; informação ou pôster indisponível; conteúdo não encontrado; erro de consulta. O estado de adição é descrito em F04.

**User Story:** Como usuário, quero consultar informações de um filme ou uma série para decidir se desejo adicioná-lo à minha lista.

**Critérios de aceitação:**

- A página carrega da API os detalhes do conteúdo selecionado.
- Exibe título, pôster, sinopse, gêneros, ano de lançamento ou de estreia e nota fornecida pela API, quando disponíveis.
- A página identifica se o conteúdo é um filme ou uma série.
- Informações ausentes recebem uma indicação simples de indisponibilidade; a aplicação não inventa dados.
- A ausência de pôster não impede a leitura das informações nem o uso das ações.
- A página apresenta carregamento enquanto consulta a API.
- Um conteúdo inexistente apresenta uma mensagem de conteúdo não encontrado.
- Uma falha de conexão ou da API apresenta uma mensagem de erro, sem afirmar que o conteúdo não existe.
- A página permite adicionar o conteúdo à Minha Lista e informa quando ele já está salvo.

### F04 (RF04) — Adicionar à Minha Lista

**Descrição:** salvar um título pelos detalhes, evitando duplicatas e confirmando a ação após gravar no navegador.

**Estados:** título ainda não salvo, com ação disponível; título salvo, com botão desabilitado; erro de leitura ou gravação, sem confirmar o salvamento. A escrita local é síncrona e não possui uma tela de carregamento própria.

**User Story:** Como usuário, quero salvar um filme ou uma série para lembrar que desejo assistir a esse conteúdo depois.

**Critérios de aceitação:**

- Ao adicionar um conteúdo pela página de detalhes, ele passa a aparecer na Minha Lista.
- A interface informa que o conteúdo está salvo.
- Adicionar novamente o mesmo conteúdo não cria uma entrada duplicada.
- A lista pode conter filmes e séries.
- Os títulos salvos permanecem disponíveis após atualizar ou fechar e reabrir a página no mesmo navegador, desde que os dados do site sejam mantidos.

### F05 (RF05) — Consultar e remover itens da Minha Lista

**Descrição:** exibir os itens salvos, abrir seus detalhes e remover um título da lista local.

**Estados:** lista vazia; lista preenchida; remoção concluída; erro de leitura; erro de gravação, mantendo a última lista confirmada. A leitura e a escrita locais não possuem uma tela de carregamento própria.

**User Story:** Como usuário, quero consultar e remover os títulos da minha lista para manter organizadas minhas próximas escolhas.

**Critérios de aceitação:**

- A página Minha Lista exibe os conteúdos salvos em cards com título, tipo e pôster quando disponível.
- Selecionar um conteúdo permite abrir seus detalhes.
- Cada item oferece uma ação para removê-lo da lista.
- A remoção atualiza a exibição e os dados salvos no navegador.
- Um conteúdo removido pode ser adicionado novamente pela página de detalhes.
- Quando não há itens, a página informa que a lista está vazia e orienta o usuário a buscar ou explorar conteúdos.
- Se não for possível ler ou salvar a lista no navegador, a interface informa o problema e não apresenta a persistência como concluída.

### F06 (RF06) — Navegar entre as páginas

**Descrição:** conectar Início, Busca, Detalhes e Minha Lista por navegação compartilhada e rotas React.

**Estados:** página correspondente ao endereço; link ativo para Início, Busca ou Minha Lista; endereço desconhecido com mensagem e retorno ao início. Os carregamentos pertencem às consultas das páginas, não ao sistema de navegação.

**User Story:** Como usuário, quero navegar entre Início, Busca, Minha Lista e os detalhes dos títulos para usar as funcionalidades com facilidade.

**Critérios de aceitação:**

- A navegação principal oferece acesso a Início, Busca e Minha Lista.
- A navegação permanece acessível também na página de detalhes.
- A aplicação utiliza React Router para navegar entre as páginas.
- Os detalhes são acessados por rota dinâmica, com parâmetros suficientes para identificar o conteúdo e seu tipo.
- A navegação e as ações principais podem ser utilizadas em celular, tablet e desktop.

## 4. Estados da aplicação

| Estado | Quando acontece | Comportamento esperado |
| --- | --- | --- |
| Busca inicial | O usuário ainda não enviou uma busca. | Orientar a digitação de um título. |
| Busca vazia | O usuário tenta pesquisar sem um termo válido. | Solicitar um título, sem consultar a API. |
| Carregando | Uma consulta à API está em andamento. | Exibir indicação de carregamento na área consultada. |
| Sucesso | A API retorna filmes ou séries. | Exibir os cards correspondentes. |
| Nenhum resultado | A busca termina sem encontrar títulos. | Informar que não foram encontrados resultados para o termo. |
| Sem conteúdos populares | Uma consulta de populares retorna uma lista vazia. | Informar a ausência de conteúdos na seção correspondente. |
| Conteúdo encontrado | A API retorna os detalhes do título solicitado. | Exibir as informações disponíveis e a ação da lista. |
| Conteúdo não encontrado | O título solicitado não existe ou sua identificação é inválida. | Informar que o conteúdo não foi encontrado e manter a navegação disponível. |
| Erro de consulta | Ocorre uma falha na comunicação com a API. | Exibir mensagem de erro, sem confundir falha com ausência de resultados. |
| Informação indisponível | Um conteúdo não possui algum dado ou pôster. | Usar uma indicação de indisponibilidade e manter a interface utilizável. |
| Lista vazia | Não existem títulos salvos. | Informar a situação e orientar a descoberta ou busca de conteúdos. |
| Lista preenchida | Existem títulos salvos no navegador. | Exibir os itens e as ações de detalhes e remoção. |
| Conteúdo salvo | O título já pertence à lista. | Identificar que ele está salvo e evitar duplicação. |
| Erro no armazenamento | O navegador não permite ler ou salvar os dados da lista. | Informar o problema sem indicar que os dados foram persistidos com sucesso. |

## 5. Regras do produto

1. O catálogo contempla somente filmes e séries.
2. Títulos, imagens e informações do catálogo devem vir da API TMDB. Dados ausentes não devem ser inventados.
3. A nota exibida é a fornecida pela API; o usuário não atribui avaliações neste MVP.
4. Minha Lista representa conteúdos que o usuário pretende assistir. Não haverá status de assistido ou acompanhamento de episódios.
5. Cada conteúdo pode aparecer apenas uma vez na lista. A identificação deve considerar o tipo (filme ou série) e o identificador do título.
6. A lista é única e local ao navegador utilizado para acessar o site. Não haverá criação de várias listas nem sincronização entre dispositivos.
7. A permanência da lista depende da disponibilidade do armazenamento e da manutenção dos dados do site no navegador. Limpar esses dados pode apagar a lista.
8. A descoberta, a busca e a consulta de detalhes dependem de conexão com a internet e de acesso à API configurado.
9. O site não reproduz filmes ou séries; sua finalidade é descobrir e organizar títulos.
10. Funcionalidades fora deste documento devem ser discutidas e aprovadas antes da implementação, com atualização dos documentos afetados.

## 6. Requisitos de interface e qualidade

- A interface deve ser responsiva e utilizável em celular, tablet e desktop, sem cortes que impeçam a navegação ou as ações principais.
- A direção visual aprovada utiliza fundo escuro, uma cor de destaque, pôsteres em cards e hierarquia clara entre títulos, informações e ações.
- Os textos da interface devem estar em português e as mensagens devem ser simples e compreensíveis.
- A navegação deve ser clara e consistente entre as páginas.
- Campos e ações devem ter identificação compreensível; ícones devem apoiar o entendimento das ações.
- A responsividade será construída com CSS tradicional, flexbox, grid quando necessário e media queries.
- O código deve ser organizado, legível e simples o suficiente para ser explicado por um aluno do 2º semestre.

## 7. Requisitos técnicos e limitações

- Aproveitar o projeto existente em Vite + React com JavaScript, HTML e CSS.
- Utilizar componentes funcionais reutilizáveis e props para passar dados e ações.
- Utilizar `useState` para controlar informações da interface, como busca, resultados, lista, carregamento e erros.
- Utilizar `useEffect` para carregar dados da API e persistir a lista, conforme a arquitetura documentada.
- Integrar a API TMDB de verdade, utilizando JavaScript e `fetch`.
- Utilizar React Router, múltiplas páginas e pelo menos uma rota dinâmica.
- Utilizar uma biblioteca de ícones necessária à interface: Lucide, conforme a arquitetura documentada.
- Utilizar `localStorage` de maneira simples para a lista pessoal.
- Documentar a configuração da credencial da API na etapa apropriada, sem incluir uma chave real no código versionado ou no GitHub.
- Não utilizar backend, banco de dados, autenticação, JWT ou Node.js como backend.
- Não utilizar TypeScript, Next.js, Redux, Context API, React Query, Zustand, Tailwind, Styled Components, Material UI, custom hooks ou padrões avançados sem autorização.
- Manter a estrutura de pastas simples e não concentrar toda a aplicação em `App.jsx`.

## 8. Fora do escopo

- Cadastro, login e perfil de usuário.
- Sincronização da lista entre dispositivos.
- Múltiplas listas e favoritos separados da Minha Lista.
- Marcação de assistidos e acompanhamento de temporadas ou episódios.
- Avaliações pessoais, comentários e recursos de rede social.
- Recomendações personalizadas, filtros avançados e estatísticas.
- Gamificação, notificações e calendário de lançamentos.
- Consulta de plataformas onde assistir e reprodução de vídeos.
- Aplicativo mobile nativo.

## 9. Documentação e continuidade

Este documento registra a definição de requisitos da ETAPA 2. A [arquitetura](architecture.md), elaborada na ETAPA 3, detalha páginas, rotas, componentes, props, estados React e efeitos a partir deste escopo.

As três [referências visuais](references/references.md) foram documentadas na ETAPA 4. A estrutura React, a implementação, a responsividade, o README e a revisão seguiram a ordem de desenvolvimento definida em `contexto.md`.

Os critérios de aceitação deste documento são a base da revisão final do MVP e de futuras alterações aprovadas, sem ampliar o escopo automaticamente.
