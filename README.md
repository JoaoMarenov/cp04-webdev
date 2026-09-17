# Próxima Sessão

MVP acadêmico de Web Development da FIAP: descubra filmes e séries e guarde suas próximas escolhas em uma lista pessoal.

## Integrantes

 João Lucca - RM569562
 Isaac Ambrozevicius - RM

## Problema e solução

As pessoas encontram filmes e séries interessantes, mas esquecem os títulos ou deixam as indicações espalhadas. O Próxima Sessão reúne descoberta, busca, detalhes e uma lista do que assistir depois.

## Funcionalidades

- Home com filmes e séries populares da TMDB.
- Busca por nome, limitada a filmes e séries.
- Detalhes com pôster, sinopse, gêneros, ano, nota e opções de onde assistir da TMDB, quando disponíveis.
- Minha Lista: adicionar pelos detalhes, consultar e remover títulos.
- Persistência no navegador com `localStorage`, sem entradas duplicadas.
- Estados de carregamento, erro, lista vazia, busca sem resultados e conteúdo não encontrado.
- Layout responsivo para celular, tablet e desktop, com navegação por teclado e foco visível.

O catálogo exibe a primeira página retornada pela API. Não há paginação, login, avaliações pessoais, status de assistido, reprodução de vídeos ou sincronização entre dispositivos.

## Tecnologias

- React e React DOM, com JavaScript e JSX.
- Vite para desenvolvimento e build.
- HTML e CSS tradicional (flexbox, grid e media queries).
- React Router (`react-router-dom`) para navegação e rota dinâmica.
- `useState`, `useEffect`, componentes funcionais e props.
- Boxicons para ícones da interface.
- API TMDB via `fetch` e `localStorage` para a lista.
- ESLint para revisão estática do código.

O projeto usa Node.js somente para executar as ferramentas de desenvolvimento. Não há backend.

## Como executar

Pré-requisito: Node.js compatível com a versão de Vite do projeto. Ambiente verificado: Node.js 24 e npm 11.

```bash
npm install
```

### Configurar a API

1. Acesse as [configurações de API da sua conta TMDB](https://www.themoviedb.org/settings/api) e obtenha a **chave de API v3**.
2. Copie `.env.example` para `.env.local`, na raiz do projeto, ao lado de `package.json`.
3. Preencha a variável com sua chave:

```env
VITE_TMDB_API_KEY=sua_chave_api_v3
VITE_TMDB_WATCH_REGION=BR
```

Use a chave v3, não o token de leitura. Um arquivo `.env` com a mesma variável também é aceito pelo Vite; prefira manter a configuração em um único arquivo. Não preencha `.env.example` com a chave real, pois ele é o modelo compartilhado.

`.env` e `.env.local` estão no `.gitignore`. Variáveis `VITE_` são incluídas no frontend e podem ser vistas no navegador: este mecanismo evita versionar a chave no código-fonte, mas não a transforma em um segredo de servidor.

```bash
npm run dev
```

Abra o endereço informado pelo Vite no terminal. Reinicie o servidor se alterar a variável da API. Para um novo build, execute o comando de build novamente após configurar a chave.

Sem uma chave válida, ou se a rede/API estiver indisponível, a interface informa que não conseguiu consultar o catálogo. Não há catálogo fictício de substituição. Para diagnosticar, verifique a configuração acima e o status da resposta no painel de rede do navegador, sem compartilhar a chave.

### Verificações e build

```bash
npm run lint
npm run build
npm run preview
```

`build` gera a pasta `dist/`. `preview` serve o build localmente. A configuração da API deve existir antes de gerar o build.

## API utilizada

Base: `https://api.themoviedb.org/3`.

| Endpoint | Uso |
| --- | --- |
| `/movie/popular` | Filmes populares. |
| `/tv/popular` | Séries populares. |
| `/search/multi` | Busca por nome; pessoas são descartadas dos resultados. |
| `/movie/:id` | Detalhes de um filme. |
| `/tv/:id` | Detalhes de uma série. |
| `/:type/:id/watch/providers` | Provedores e modalidades de exibição por região. |

As consultas solicitam português do Brasil (`pt-BR`). Informações sem tradução podem vir no idioma disponível no catálogo. Pôsteres vêm do serviço de imagens da TMDB. Os efeitos ignoram respostas de páginas ou buscas que já foram substituídas. Consultas com mais de 15 segundos apresentam erro de espera.

- [Introdução e obtenção de chave TMDB](https://developer.themoviedb.org/docs/getting-started).
- [Busca múltipla](https://developer.themoviedb.org/reference/search-multi).
- [Imagens TMDB](https://developer.themoviedb.org/docs/image-basics).
- [Requisitos de atribuição](https://developer.themoviedb.org/docs/faq).

O logo oficial foi obtido na [página de logos e atribuição](https://www.themoviedb.org/about/logos-attribution) e está em `src/assets/tmdb.svg`, sem alterações. Créditos e aviso do provedor estão no rodapé:

> This product uses the TMDB API but is not endorsed or certified by TMDB.

## Como a lista funciona

A chave `proxima-sessao-lista` do `localStorage` guarda um array de títulos. Um filme e uma série são identificados pela combinação de tipo e ID. A lista aparece como atualizada somente depois que a escrita no navegador é confirmada.

Os dados pertencem ao navegador e ao endereço do site utilizado. Abrir outro navegador, outro dispositivo ou outro endereço local não compartilha essa lista. Limpar os dados do site pode apagá-la.

Se o armazenamento estiver bloqueado, a aplicação informa a falha e mantém a última lista confirmada. Se o conteúdo salvo estiver inválido, ele não será sobrescrito automaticamente. Para resolver, confira as permissões do navegador; se decidir descartar uma lista corrompida, remova apenas a entrada `proxima-sessao-lista` pelo painel Application/Storage das ferramentas de desenvolvimento e recarregue. Essa remoção apaga a lista local.

## Organização e documentação

- [Requisitos e critérios de aceitação](docs/requirements.md).
- [Arquitetura: páginas, rotas, componentes, props, estados e efeitos](docs/architecture.md).
- [Três referências visuais](docs/references/references.md).
- [Revisão final e resultados dos testes](docs/review.md).

As páginas ficam em `src/pages`, os componentes em `src/components`, o layout em `src/layouts` e as funções de API e armazenamento em `src/services`. O estado da lista fica em `App.jsx` e é passado por props.

## Roteiro de teste manual

1. Abra a Home e confira as seções de filmes e séries com dados e pôsteres reais.
2. Vá a Busca, envie um campo vazio e confira a orientação. Pesquise um título conhecido, depois um termo sem resultados.
3. Abra os detalhes de um filme e de uma série. Confira sinopse, gêneros, ano e nota.
4. Adicione um título à lista, confira o botão de salvo e abra Minha Lista.
5. Recarregue a página e confirme a persistência; remova o título e recarregue novamente.
6. Abra uma rota de detalhes inválida e um ID inexistente. Ambos devem informar conteúdo não encontrado.
7. Simule conexão indisponível pelo painel de rede e faça uma nova consulta. A interface deve mostrar erro, sem afirmar que não existem resultados.
8. Verifique as páginas em larguras de 320, 390, 768 e 1440 pixels e navegue com Tab e Enter.
9. Em um perfil de teste do navegador, bloqueie a escrita do armazenamento. A tentativa de salvar deve informar erro e preservar a lista anterior.

## Uso de IA

A IA foi utilizada como ferramenta de apoio para organização, documentação, desenvolvimento, revisão de código e resolução de dúvidas. As decisões de negócio, design e funcionalidades foram definidas pelos alunos, com aprovação da proposta e do escopo documentados. Os integrantes devem revisar o código e compreender seu funcionamento para a apresentação acadêmica.

## Publicação e links

O projeto pode ser publicado na Vercel como Vite, com comando `npm run build` e saída `dist`. Configure `VITE_TMDB_API_KEY` no ambiente da hospedagem antes do build. `vercel.json` direciona acessos às rotas React para `index.html`, permitindo abrir ou atualizar uma rota de detalhes diretamente.

Referência: [configuração de aplicações Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite).

GitHub: [inserir link]

Vercel: [inserir link]

Nenhuma publicação é necessária para executar o projeto localmente.
