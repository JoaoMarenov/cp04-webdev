import { useEffect, useState } from 'react'
import { searchMovies } from '../services/api'
import SearchBar from '../components/SearchBar'
import MovieGrid from '../components/MovieGrid'
import Feedback from '../components/Feedback'

function SearchResults({ term }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    searchMovies(term)
      .then(data => { if (active) setMovies(data) })
      .catch(error => { if (active) setError(error.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [term])

  if (loading) return <Feedback kind="loading" title="Procurando sua próxima história…" />
  if (error) return <Feedback kind="error" title="Não conseguimos concluir a busca" message={error} />
  if (movies.length === 0) return <Feedback title="Nenhum resultado por aqui" message={`Não encontramos filmes ou séries para “${term}”. Confira o nome ou tente outro título.`} />

  return (
    <section className="search-results">
      <div className="section-heading">
        <div>
          <span className="eyebrow">O QUE ENCONTRAMOS</span>
          <h2>Resultados para “{term}”</h2>
          <p>Filmes e séries encontrados para sua busca.</p>
        </div>
      </div>
      <MovieGrid movies={movies} />
    </section>
  )
}

export default function Search() {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState(null)
  const [warning, setWarning] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const term = value.trim()
    if (!term) {
      setWarning('Digite o nome de um filme ou de uma série para buscar.')
      setSearch(null)
      return
    }
    setWarning('')
    setSearch({ term, version: (search?.version || 0) + 1 })
  }

  return (
    <>
      <header className="page-heading">
        <span className="eyebrow">SIGA A SUA CURIOSIDADE</span>
        <h1>Encontre sua próxima história<span className="accent">.</span></h1>
        <p>Aquela indicação de um amigo ou um título que não sai da cabeça.</p>
      </header>
      <SearchBar value={value} onChange={setValue} onSubmit={handleSubmit} />
      <p className="search-hint">Busque pelo nome de um filme ou de uma série.</p>
      {warning && <p className="search-warning" role="alert">{warning}</p>}
      {search ? <SearchResults key={search.version} term={search.term} /> : <Feedback title="Toda boa sessão começa com uma ideia" message="Digite um título no campo acima. Suas próximas descobertas aparecem aqui." />}
    </>
  )
}
