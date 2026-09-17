import { Link, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { readList, saveList } from './services/storage'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Details from './pages/Details'
import MyList from './pages/MyList'
import Feedback from './components/Feedback'
import './App.css'

export default function App() {
  const [storage, setStorage] = useState(readList)
  const [pendingList, setPendingList] = useState(null)

  useEffect(() => {
    if (pendingList === null || pendingList === storage.items || storage.readBlocked) return
    let result
    try {
      saveList(pendingList)
      result = { items: pendingList, error: '', readBlocked: false }
    } catch {
      result = { items: storage.items, error: 'Não foi possível salvar a alteração. Sua lista anterior foi mantida. Verifique o armazenamento do navegador e tente novamente.', readBlocked: false }
    }
    // Confirma o resultado da escrita externa antes de mostrar a lista como salva.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorage(result)
  }, [pendingList, storage.items, storage.readBlocked])

  function addMovie(movie) {
    if (storage.readBlocked || storage.items.some(item => item.id === movie.id && item.type === movie.type)) return
    const { id, type, title, poster, year, rating, voteCount } = movie
    setPendingList([...storage.items, { id, type, title, poster, year, rating, voteCount }])
  }

  function removeMovie(movie) {
    if (storage.readBlocked) return
    setPendingList(storage.items.filter(item => item.id !== movie.id || item.type !== movie.type))
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/detalhes/:type/:id" element={<Details list={storage.items} onAdd={addMovie} storageError={storage.error} />} />
        <Route path="/minha-lista" element={<MyList list={storage.items} onRemove={removeMovie} storageError={storage.error} />} />
        <Route path="*" element={<div className="page-heading"><Feedback title="Esta página não foi encontrada" message="O endereço pode ter mudado. Que tal começar uma nova história?"><Link to="/" className="button button-primary">Ir para o início</Link></Feedback></div>} />
      </Routes>
    </MainLayout>
  )
}
