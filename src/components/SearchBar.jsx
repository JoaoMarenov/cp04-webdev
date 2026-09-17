export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="search-form" onSubmit={onSubmit} role="search">
      <label className="sr-only" htmlFor="movie-search">Nome do filme ou série</label>
      <i className="bx bx-search" aria-hidden="true" />
      <input id="movie-search" type="search" placeholder="Qual história você está procurando?" value={value} onChange={event => onChange(event.target.value)} autoComplete="off" />
      <button className="button button-primary" type="submit">Buscar<i className="bx bx-right-arrow-alt" aria-hidden="true" /></button>
    </form>
  )
}
