import MovieCard from './MovieCard'

export default function MovieGrid({ movies, onRemove }) {
  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard key={`${movie.type}-${movie.id}`} movie={movie} onRemove={onRemove} />
      ))}
    </div>
  )
}
