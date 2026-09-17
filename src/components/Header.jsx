import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="Próxima Sessão — Início">
          <span className="brand-icon"><i className="bx bx-movie" aria-hidden="true" /></span>
          <span>Próxima Sessão</span>
        </Link>
        <nav aria-label="Navegação principal">
          <NavLink to="/" end><i className="bx bx-home" aria-hidden="true" />Início</NavLink>
          <NavLink to="/buscar"><i className="bx bx-search" aria-hidden="true" />Busca</NavLink>
          <NavLink to="/minha-lista"><i className="bx bx-bookmark" aria-hidden="true" />Minha Lista</NavLink>
        </nav>
      </div>
    </header>
  )
}
