# Próxima Sessão — Arquitetura

## 1. Visão geral

Arquitetura definida na ETAPA 3, baseada em [requirements.md](requirements.md) (F01/RF01 a F06/RF06), e conferida com o [template oficial](../template_ref/architecture.md) e o código final. Aplicação web em Vite + React, JavaScript e CSS tradicional. As únicas dependências adicionadas à aplicação foram React Router (`react-router-dom`, modo declarativo) e Lucide (`lucide-react`, ícones).

São usados componentes funcionais, props, arrays, funções simples, `useState`, `useEffect`, `fetch` e `localStorage`. Não há Context API, custom hooks, backend, autenticação ou banco de dados.

## 2. Páginas e rotas

| Página | Rota | Responsabilidade | Requisito |
| --- | --- | --- | --- |
| Home | `/` | Apresentação e seções de filmes e séries populares. | RF01 |
| Search | `/buscar` | Formulário e resultados de busca por nome. | RF02 |
| Details | `/detalhes/:type/:id` | Informações e ação para adicionar à lista. | RF03, RF04 |
| MyList | `/minha-lista` | Lista salva, detalhes e remoção de itens. | RF05 |
| Mensagem de endereço inexistente | `*` | Informar endereço não encontrado com retorno ao início, dentro do layout. | RF06 |

`type` aceita `movie` (filme) ou `tv` (série); `id` deve ser um inteiro positivo. Exemplo de formato: `/detalhes/movie/550`. Esses valores identificam a consulta; os títulos exibidos sempre vêm da API.

`BrowserRouter` está em `main.jsx`, dentro de `StrictMode`. `Routes` e `Route` estão em `App.jsx`. `Link` e `NavLink` fazem a navegação; `useParams` lê a rota de detalhes. A página de detalhes remonta `DetailsContent` ao mudar tipo ou identificador, por meio de sua `key`, evitando mostrar dados do título anterior. A rota `*` renderiza `Feedback` diretamente em App; não existe um arquivo de página NotFound.

## 3. Estrutura real de pastas

```text
docs/
  requirements.md
  architecture.md
  review.md
  references/
    references.md
    imagens/
      netflix-home.png
      letterboxd-explorar.png
      notion.png
    imagens-de-referencia/  (arquivos anteriores preservados; não usados no Markdown)
      letterboxd-explorar.png
      notion.png
public/
  favicon.svg
src/
  assets/
    tmdb.svg
  components/
    Header.jsx
    Footer.jsx
    MovieCard.jsx
    Poster.jsx
    MovieGrid.jsx
    SearchBar.jsx
    Feedback.jsx
    PopularSection.jsx
  layouts/
    MainLayout.jsx
  pages/
    Home.jsx
    Search.jsx
    Details.jsx
    MyList.jsx
  services/
    api.js
    storage.js
  App.jsx
  App.css
  index.css
  main.jsx
.env.example
.gitignore
contexto.md
index.html
package.json
package-lock.json
vite.config.js
eslint.config.js
README.md
vercel.json
template_ref/
  requirements.md
  architecture.md
  references.md
```

`storage.js` contém apenas funções para ler, validar e salvar o array da lista. `api.js` reúne as consultas HTTP e a preparação dos dados. Não são camadas de backend.

`template_ref/` contém o material do professor e não é carregada pela aplicação. `node_modules/`, `dist/`, `.verification/` e `.env.local` são dependências instaladas, saída de build, evidências locais e configuração privada, respectivamente; estão omitidos da árvore de arquivos compartilháveis. A pasta de imagens da documentação usa `imagens/`, conforme o template e a revisão solicitada.

## 4. Componentes e props

| Componente | Props | Uso |
| --- | --- | --- |
| App | Nenhuma | Define rotas e mantém a lista confirmada, a alteração pendente e as funções de adição e remoção. |
| Home | Nenhuma | Apresentação e duas instâncias de PopularSection. |
| Search | Nenhuma | Controla o formulário e cria SearchResults para cada busca enviada. |
| MainLayout | `children` | Header, conteúdo principal e Footer compartilhados. |
| Header | Nenhuma | Marca e links Início, Busca e Minha Lista. |
| Footer | Nenhuma | Identificação acadêmica e créditos da TMDB. |
| Poster | `path`, `title` | Imagem de pôster e alternativa para ausência ou falha da imagem. |
| MovieCard | `movie`, `onRemove` (opcional) | Título, tipo, ano, nota, pôster e link para detalhes; remoção apenas na lista. |
| MovieGrid | `movies`, `onRemove` (opcional) | Renderiza os cards com `map()`. |
| SearchBar | `value`, `onChange`, `onSubmit` | Formulário de busca com label, campo e botão. |
| Feedback | `title`; `kind`, `message` e `children` opcionais | Carregamento, erro ou estado vazio; `kind` assume `empty` quando omitido. |
| PopularSection | `type`, `title`, `description` | Consulta e mostra uma seção de populares com estados independentes. |
| Details | `list`, `onAdd`, `storageError` | Consulta o título e permite adicioná-lo. |
| MyList | `list`, `onRemove`, `storageError` | Exibe e remove os itens salvos. |
| SearchResults (interno de Search.jsx) | `term` | Consulta o termo enviado e mostra carregamento, resultados, vazio ou erro. |
| DetailsContent (interno de Details.jsx) | `type`, `id`, `list`, `onAdd`, `storageError` | Consulta e apresenta um título válido e a ação para adicioná-lo. |

SearchResults e DetailsContent ficam no arquivo da própria página. Isso mantém seus estados locais sem criar novas pastas ou hooks. `key` é uma identificação usada pelo React para remontar esses componentes, não uma prop lida por eles.

As props de eventos são funções: `onAdd(movie)` e `onRemove(movie)` recebem o item; `onChange(texto)` recebe o valor digitado; `onSubmit(event)` recebe o evento do formulário. `list` e `movies` são arrays; `movie` é o objeto descrito na seção 5; `storageError` é uma mensagem ou uma string vazia.

## 5. Formato dos dados

Os resultados da TMDB são preparados em um objeto simples com `id`, `type`, `title`, `poster`, `year`, `rating`, `voteCount`, `overview` e `genres` quando disponíveis. `title` usa o título do filme ou o nome da série; `year` usa lançamento ou estreia. Não são inventados valores para informações ausentes.

Quando um dado não existe, são usados `null` para pôster/nota, string vazia para ano/sinopse e array vazio para gêneros. O título ausente recebe “Título indisponível”. A nota só é exibida quando existe um valor e `voteCount` é maior que zero; a interface informa a indisponibilidade nos demais casos.

Cards usam a combinação `type` e `id` como chave. A lista salva somente os dados necessários aos cards: `id`, `type`, `title`, `poster`, `year`, `rating` e `voteCount`. Os detalhes completos são consultados novamente na API.

## 6. Estados com useState

| Local | Estados | Finalidade |
| --- | --- | --- |
| App | `storage`, com `items`, `error` e `readBlocked`; `pendingList` | Compartilhar a lista confirmada; bloquear escrita após erro de leitura; só confirmar uma alteração após salvá-la. Inicialização: `readList` e `null`. |
| PopularSection | `movies = []`, `loading = true`, `error = ''` | Permitir que filmes e séries carreguem independentemente. |
| Search | `value = ''`, `search = null`, `warning = ''` | Controlar texto, busca enviada (`term` e `version`) e aviso. Consultar somente ao enviar o formulário. |
| SearchResults | `movies = []`, `loading = true`, `error = ''` | Distinguir carregamento, vazio, sucesso e falha da busca enviada. |
| DetailsContent | `movie = null`, `loading = true`, `error = ''`, `notFound = false` | Exibir apenas os dados da identificação atual e distinguir 404 de outras falhas. |
| Poster | `failedPath = null` | Guardar o caminho que falhou e mostrar a alternativa visual. |

O array da lista é inicializado pela leitura de `localStorage`, no inicializador de `useState(readList)`. As funções `addMovie` e `removeMovie` ficam em App. A comparação de duplicatas considera tipo e identificador, e a atualização usa um novo array.

`saved`, em DetailsContent, é calculado com `list.some(...)`; não possui `useState` próprio. MyList recebe a lista por props e não duplica seu estado. `pathname`, no layout, vem de `useLocation`.

## 7. Efeitos com useEffect

| Efeito | Quando acontece / dependências | O que faz |
| --- | --- | --- |
| PopularSection | Ao montar, com dependência `[type]`. | Consulta `getPopular(type)` e atualiza conteúdos, erro e fim do carregamento. Home usa duas instâncias de tipo fixo. |
| SearchResults | Ao montar para uma busca enviada; dependência `[term]`. | Consulta `searchMovies(term)`. A `key` baseada em `search.version` remonta os resultados a cada envio, inclusive para repetir o mesmo termo. |
| DetailsContent | Ao montar para um endereço válido; dependências `[type, id]`. | Consulta `getDetails`, separa 404 de outros erros e encerra o carregamento. |
| App | Dependências `[pendingList, storage.items, storage.readBlocked]`. | Salva uma alteração pendente válida; ignora estado inicial, lista já confirmada e bloqueio de leitura. Confirma a lista ou preserva a anterior e registra o erro. |
| MainLayout | Ao montar e mudar `[pathname]`. | Posiciona a página no topo e move o foco ao conteúdo principal. |

- Os resultados de Search começam em carregamento quando o componente remonta.
- Os efeitos de API usam uma variável de controle no retorno de limpeza para ignorar respostas depois de sair da página. Isso impede que respostas antigas substituam buscas ou detalhes recentes.
- App sincroniza as alterações da lista com `localStorage`. Falhas devem ser informadas e não podem ser apresentadas como salvamento concluído.
- O efeito de armazenamento confirma a alteração pendente com `setStorage` depois da escrita externa. Há uma exceção local e comentada à regra de lint `set-state-in-effect` somente nessa confirmação; as demais regras permanecem ativas. Isso permite manter a lista anterior se a gravação falhar.
- O layout acompanha o endereço para posicionar a nova página no topo.

## 8. API

Base: `https://api.themoviedb.org/3`.

| Consulta | Caminho | Uso |
| --- | --- | --- |
| Filmes populares | `/movie/popular` | Home |
| Séries populares | `/tv/popular` | Home |
| Busca por nome | `/search/multi` | Busca, mantendo somente `movie` e `tv` |
| Detalhes de filme | `/movie/:id` | Details |
| Detalhes de série | `/tv/:id` | Details |

As consultas usam `language=pt-BR`, primeira página e, na busca, `include_adult=false`. O MVP apresenta o conjunto retornado na primeira página, sem paginação ou rolagem infinita. Essa é uma delimitação do catálogo exibido, não um catálogo completo.

`fetch` faz as consultas em `api.js`, com verificação de `response.ok`, erro 404 separado para detalhes e mensagem para erro de rede ou credencial. O limite de espera é de 15 segundos, usando `AbortController` e `setTimeout`, recursos nativos do navegador.

Imagens são carregadas de `https://image.tmdb.org/t/p/w500` seguido do caminho do pôster. Falhas ou dados ausentes usam a alternativa visual de Poster.

A chave v3 é lida de `VITE_TMDB_API_KEY`, configurada em `.env.local` (ou `.env`, aceito pelo Vite). `.env.example` contém somente o nome da variável, sem valor. Arquivos locais de credenciais são ignorados no Git. Uma variável Vite evita gravar a chave no código-fonte, mas continua visível no navegador por se tratar de uma aplicação frontend; não deve conter outros segredos.

O rodapé tem uma área de créditos com logo oficial da TMDB e o aviso exigido pelo provedor, sem uma nova página.

## 9. Armazenamento e erros

- Chave local: `proxima-sessao-lista`.
- Formato: array convertido com `JSON.stringify` e lido com `JSON.parse`.
- A leitura valida o formato para evitar uma tela quebrada por dados inválidos.
- A aplicação não sobrescreve silenciosamente dados que não conseguiu ler.
- Uma falha ao gravar deve manter a última lista confirmada, informar o problema e permitir tentar novamente pela ação original.
- Sem armazenamento disponível, a navegação e a consulta à API continuam acessíveis.

## 10. Interface e responsividade

Fundo grafite, destaque em verde-lima, texto claro e fonte de sistema. A Home tem uma apresentação tipográfica e duas grades de pôsteres. Não há carrossel, reprodução, filtros ou funcionalidades além da spec.

CSS global cuida da base, foco e tipografia; `App.css` concentra layout e componentes. Grid organiza os cards, flexbox organiza navegação e ações. Media queries ajustam grades, formulário e detalhes para tablet e celular. Controles têm texto acessível e foco visível.

As referências reais estão documentadas em [references/references.md](references/references.md). Seus recursos gráficos são usados apenas na documentação, sem copiar telas de outros produtos.

Os ajustes usam larguras de 1100, 760 e 480 pixels: grades de seis, quatro, três e duas colunas conforme o espaço, navegação em duas linhas nas telas menores e detalhes em uma coluna no celular. A largura mínima considerada é 320 pixels.

`vercel.json` contém apenas o redirecionamento interno para `index.html` necessário ao acesso direto às rotas do BrowserRouter em uma futura publicação. Não há backend ou publicação automática.

## 11. Verificação de consistência

- RF01: Home e PopularSection.
- RF02: Search e SearchBar.
- RF03: Details, Poster e tratamento da API.
- RF04: função de adicionar em App e storage.js.
- RF05: MyList, função de remover em App e storage.js.
- RF06: MainLayout e React Router.

As escolhas acima mantêm as quatro páginas e a única lista aprovada. Documentação de referências, estrutura, interface, API, rotas, funcionalidades, responsividade, README e revisão foram realizadas nessa ordem. Qualquer ajuste técnico necessário deve manter este documento consistente com a implementação.

## 12. Dependências realmente utilizadas

Conferidas com `package.json`, os imports de `src/` e as configurações de Vite e ESLint. As faixas de versão abaixo são as declaradas; as resoluções de instalação ficam em `package-lock.json`.

### Aplicação

| Biblioteca | Versão declarada | Uso | Motivo |
| --- | --- | --- | --- |
| `react` | `^19.2.8` | Componentes, StrictMode, useState e useEffect. | Interface e estados exigidos pela atividade. |
| `react-dom` | `^19.2.8` | `createRoot` em main.jsx. | Renderizar React no elemento raiz do HTML. |
| `react-router-dom` | `^7.18.4` | BrowserRouter, Routes, Route, Link, NavLink, useParams e useLocation. | Navegação entre páginas e identificação dinâmica de conteúdos. |
| `lucide-react` | `^1.46.0` | Ícones da navegação, ações e feedbacks. | Biblioteca de ícones exigida pela atividade. |

### Desenvolvimento

| Dependência | Uso | Motivo |
| --- | --- | --- |
| `vite` | Comandos dev, build e preview. | Servidor local e geração dos arquivos finais. |
| `@vitejs/plugin-react` | Plugin em vite.config.js. | Suporte ao React no Vite. |
| `eslint` e `@eslint/js` | Comando lint e regras JavaScript. | Revisão estática do código. |
| `eslint-plugin-react-hooks` | Regras dos hooks em eslint.config.js. | Verificar o uso de hooks e suas dependências. |
| `eslint-plugin-react-refresh` | Regras de atualização dos componentes em desenvolvimento. | Compatibilidade com a atualização do Vite. |
| `globals` | `globals.browser` em eslint.config.js. | Reconhecer nomes do navegador, como window e localStorage. |
| `@types/react` e `@types/react-dom` | Definições de tipos já presentes no modelo inicial. | Apoio às ferramentas de edição; não são importadas pelo app e não significam uso de TypeScript na implementação. |

HTML, CSS, `fetch`, `localStorage`, `URLSearchParams` e `AbortController` são recursos da plataforma, não bibliotecas instaladas. TMDB é um serviço externo acessado por HTTP, sem SDK adicional.

## 13. Fontes técnicas

- [Rotas declarativas do React Router](https://reactrouter.com/start/declarative/routing).
- [Lucide para React](https://lucide.dev/guide/react).
- [Introdução à API TMDB](https://developer.themoviedb.org/docs/getting-started).
- [Créditos exigidos pela TMDB](https://developer.themoviedb.org/docs/faq).
