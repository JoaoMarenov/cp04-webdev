import { Link } from 'react-router-dom'
import MovieGrid from '../components/MovieGrid'
import Feedback from '../components/Feedback'

export default function MyList({ list, onRemove, storageError }) {
  let content = null
  if (list.length > 0) {
    content = <MovieGrid movies={list} onRemove={onRemove} />
  } else if (!storageError) {
    content = (
      <Feedback
        title="Sua próxima sessão ainda está em aberto"
        message="Encontrou uma história interessante? Abra os detalhes e adicione à sua lista. Ela vai ficar guardada aqui."
      >
        <Link to="/buscar" className="button button-primary">
          Encontrar uma história<i className="bx bx-right-arrow-alt" aria-hidden="true" />
        </Link>
      </Feedback>
    )
  }

  return (
    <>
      <header className="page-heading">
        <span className="eyebrow">BOAS HISTÓRIAS, BEM GUARDADAS</span>
        <h1>Minha Lista<span className="accent">.</span></h1>
        <p>Os filmes e as séries que você quer assistir. Tudo no mesmo lugar.</p>
      </header>
      <p className="list-note">
        <i className="bx bx-bookmark" aria-hidden="true" />Sua lista fica salva neste navegador, para a próxima vez que a vontade de assistir chegar.
      </p>
      {storageError && <p className="storage-error" role="alert">{storageError}</p>}
      {content}
    </>
  )
}
