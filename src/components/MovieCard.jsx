import Poster from './Poster'
import { Link } from 'react-router-dom'

export default function MovieCard({ movie, onRemove }) {
  return (
    <article className="movie-card">
      <Link className="movie-link" to={`/detalhes/${movie.type}/${movie.id}`} aria-label={`Ver detalhes de ${movie.title}`}>
        <div className="poster-wrap">
          <Poster path={movie.poster} title={movie.title} />
          <span className="type-badge">{movie.type === 'movie' ? 'Filme' : 'Série'}</span>
        </div>
        <div className="card-meta"><span>{movie.year || 'Ano indisponível'}</span><span className="card-rating"><i className="bx bxs-star" aria-hidden="true" />{movie.voteCount > 0 && movie.rating != null ? movie.rating.toFixed(1).replace('.', ',') : 'Sem nota'}</span></div>
        <h3>{movie.title}</h3>
      </Link>
      {onRemove && <button className="remove-button" onClick={() => onRemove(movie)} aria-label={`Remover ${movie.title} da lista`}><i className="bx bx-trash" aria-hidden="true" />Remover da lista</button>}
    </article>
  )
}
