import { useEffect, useState } from 'react'
import { getPopular } from '../services/api'
import MovieGrid from './MovieGrid'
import Feedback from './Feedback'

export default function PopularSection({ type, title, description }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getPopular(type)
      .then(data => { if (active) setMovies(data) })
      .catch(error => { if (active) setError(error.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [type])

  let content
  if (loading) {
    content = <Feedback kind="loading" title="Buscando boas histórias…" />
  } else if (error) {
    content = <Feedback kind="error" title="Não conseguimos carregar esta seção" message={error} />
  } else if (movies.length === 0) {
    content = <Feedback title="Nenhum título por aqui" message="Não há conteúdos disponíveis nesta seção no momento." />
  } else {
    content = <MovieGrid movies={movies} />
  }

  return (
    <section className="catalog-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{type === 'movie' ? 'VALE DESCOBRIR' : 'MAIS UMA HISTÓRIA'}</span>
          <h2>{title}<span className="accent">.</span></h2>
          <p>{description}</p>
        </div>
        <span className="section-label"><i className="bx bx-trending-up" aria-hidden="true" />Populares na TMDB</span>
      </div>
      {content}
    </section>
  )
}
