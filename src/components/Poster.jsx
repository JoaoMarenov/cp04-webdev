import { useState } from 'react'

export default function Poster({ path, title }) {
  const [failedPath, setFailedPath] = useState(null)

  if (!path || failedPath === path) {
    return (
      <div className="poster poster-placeholder" role="img" aria-label={`Pôster indisponível: ${title}`}>
        <i className="bx bx-film" aria-hidden="true" />
        <span>Pôster indisponível</span>
      </div>
    )
  }

  return (
    <img
      className="poster"
      src={`https://image.tmdb.org/t/p/w500${path}`}
      alt={`Pôster de ${title}`}
      loading="lazy"
      width="500"
      height="750"
      onError={() => setFailedPath(path)}
    />
  )
}
