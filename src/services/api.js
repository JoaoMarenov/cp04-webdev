const API_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim()
const configuredRegion = import.meta.env.VITE_TMDB_WATCH_REGION?.trim().toUpperCase()
const WATCH_REGION = /^[A-Z]{2}$/.test(configuredRegion || '') ? configuredRegion : 'BR'

async function request(path, parameters = {}) {
  if (!API_KEY) {
    throw new Error('O catálogo está indisponível no momento. Tente novamente mais tarde.')
  }

  const query = new URLSearchParams({ api_key: API_KEY, language: 'pt-BR', ...parameters })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(`${API_URL}${path}?${query}`, { signal: controller.signal })
    if (response.status === 404) {
      const error = new Error('Conteúdo não encontrado.')
      error.status = 404
      throw error
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('Não foi possível acessar o catálogo no momento. Tente novamente mais tarde.')
    }
    if (!response.ok) {
      throw new Error('Não foi possível carregar os conteúdos. Tente novamente em instantes.')
    }
    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('A consulta demorou mais que o esperado. Tente novamente em instantes.', { cause: error })
    }
    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar ao catálogo. Verifique sua conexão e tente novamente.', { cause: error })
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

function prepareMovie(data, type) {
  const date = type === 'movie' ? data.release_date : data.first_air_date
  return {
    id: data.id,
    type,
    title: (type === 'movie' ? data.title : data.name) || 'Título indisponível',
    poster: data.poster_path || null,
    year: date ? date.slice(0, 4) : '',
    rating: typeof data.vote_average === 'number' ? data.vote_average : null,
    voteCount: data.vote_count || 0,
    overview: data.overview || '',
    genres: data.genres || [],
  }
}

export async function getPopular(type) {
  const data = await request(`/${type}/popular`, { page: '1' })
  return data.results.map(movie => prepareMovie(movie, type))
}

export async function searchMovies(term) {
  const data = await request('/search/multi', { query: term, include_adult: 'false', page: '1' })
  return data.results
    .filter(movie => movie.media_type === 'movie' || movie.media_type === 'tv')
    .map(movie => prepareMovie(movie, movie.media_type))
}

export async function getDetails(type, id) {
  const data = await request(`/${type}/${id}`)
  return prepareMovie(data, type)
}

function uniqueProviders(providers = []) {
  const ids = new Set()
  return providers.filter(provider => {
    if (!provider?.provider_id || ids.has(provider.provider_id)) return false
    ids.add(provider.provider_id)
    return true
  })
}

export async function getWatchProviders(type, id) {
  const data = await request(`/${type}/${id}/watch/providers`)
  const availability = data.results?.[WATCH_REGION]

  if (!availability) {
    return { region: WATCH_REGION, link: '', groups: [] }
  }

  const groups = [
    { id: 'streaming', label: 'Streaming', providers: availability.flatrate },
    { id: 'free', label: 'Grátis', providers: availability.free },
    { id: 'ads', label: 'Grátis com anúncios', providers: availability.ads },
    { id: 'rent', label: 'Aluguel', providers: availability.rent },
    { id: 'buy', label: 'Compra', providers: availability.buy },
  ]
    .map(group => ({ ...group, providers: uniqueProviders(group.providers) }))
    .filter(group => group.providers.length > 0)

  return { region: WATCH_REGION, link: availability.link || '', groups }
}
