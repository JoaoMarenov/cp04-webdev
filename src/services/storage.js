const STORAGE_KEY = 'proxima-sessao-lista'

export function readList() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const items = saved === null ? [] : JSON.parse(saved)
    const valid = Array.isArray(items) && items.every(item =>
      item && Number.isInteger(item.id) && item.id > 0 &&
      (item.type === 'movie' || item.type === 'tv') &&
      typeof item.title === 'string' && typeof item.year === 'string' &&
      (item.poster === null || typeof item.poster === 'string') &&
      (item.rating === null || typeof item.rating === 'number') &&
      typeof item.voteCount === 'number',
    )
    if (!valid) throw new Error('Formato inválido')
    return { items, error: '', readBlocked: false }
  } catch {
    return { items: [], error: 'Não foi possível ler sua lista neste navegador. Verifique os dados e as permissões de armazenamento do site. Sua lista não foi sobrescrita.', readBlocked: true }
  }
}

export function saveList(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
