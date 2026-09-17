import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDetails, getWatchProviders } from '../services/api'
import Poster from '../components/Poster'
import Feedback from '../components/Feedback'
import WatchProviders from '../components/WatchProviders'

function DetailsContent({ type, id, list, onAdd, storageError }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [providers, setProviders] = useState(null)
  const [providersLoading, setProvidersLoading] = useState(true)
  const [providersError, setProvidersError] = useState('')

  useEffect(() => {
    let active = true
    getDetails(type, id)
      .then(data => { if (active) setMovie(data) })
      .catch(error => {
        if (!active) return
        if (error.status === 404) setNotFound(true)
        else setError(error.message)
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [type, id])

  useEffect(() => {
    let active = true
    getWatchProviders(type, id)
      .then(data => { if (active) setProviders(data) })
      .catch(error => { if (active) setProvidersError(error.message) })
      .finally(() => { if (active) setProvidersLoading(false) })

    return () => { active = false }
  }, [type, id])

  if (loading) return <Feedback kind="loading" title="Abrindo essa história…" />
  if (notFound) return <Feedback title="Conteúdo não encontrado" message="Este filme ou série não está disponível no catálogo. Explore outros títulos pela busca."><Link className="button button-primary" to="/buscar">Buscar uma história</Link></Feedback>
  if (error) return <Feedback kind="error" title="Não conseguimos abrir este título" message={error} />

  const saved = list.some(item => item.id === movie.id && item.type === movie.type)

  return (
    <article className="details-layout">
      <div className="detail-poster"><Poster path={movie.poster} title={movie.title} /></div>
      <div className="details-copy">
        <span className="eyebrow">{type === 'movie' ? 'FILME' : 'SÉRIE'} · CONHEÇA ESSA HISTÓRIA</span>
        <h1>{movie.title}</h1>
        <div className="detail-meta"><span>{movie.year || 'Ano indisponível'}</span><span>•</span><span className="detail-rating"><i className="bx bxs-star" aria-hidden="true" />{movie.voteCount > 0 && movie.rating != null ? `${movie.rating.toFixed(1).replace('.', ',')} / 10` : 'Nota indisponível'}</span><span>Nota TMDB</span></div>
        <div className="genres">{movie.genres.length ? movie.genres.map(genre => <span className="genre" key={genre.id}>{genre.name}</span>) : <span className="genre">Gêneros indisponíveis</span>}</div>
        <section className="synopsis"><h2>Uma prévia da história</h2><p>{movie.overview || 'Sinopse indisponível para este título.'}</p></section>
        <WatchProviders providers={providers} loading={providersLoading} error={providersError} />
        <div className="detail-actions"><button className={`button ${saved ? 'button-saved' : 'button-primary'}`} disabled={saved} onClick={() => onAdd(movie)}>{saved ? <i className="bx bx-check" aria-hidden="true" /> : <i className="bx bx-bookmark" aria-hidden="true" />}{saved ? 'Salvo na Minha Lista' : 'Adicionar à Minha Lista'}</button></div>
        <p className="detail-note" role="status">{saved ? 'Pronto. Essa história está guardada para depois.' : 'Gostou da ideia? Guarde esse título para a próxima sessão.'}</p>
        {storageError && <p className="storage-error" role="alert">{storageError}</p>}
        <Link to="/minha-lista" className="text-link">Ver Minha Lista →</Link>
      </div>
    </article>
  )
}

export default function Details({ list, onAdd, storageError }) {
  const { type, id } = useParams()
  const valid = (type === 'movie' || type === 'tv') && /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) > 0
  return <><Link to="/" className="text-link back-link"><i className="bx bx-left-arrow-alt" aria-hidden="true" />Voltar ao início</Link>{valid ? <DetailsContent key={`${type}-${id}`} type={type} id={id} list={list} onAdd={onAdd} storageError={storageError} /> : <Feedback title="Conteúdo não encontrado" message="O endereço deste título não é válido."><Link to="/buscar" className="button button-primary">Buscar uma história</Link></Feedback>}</>
}
