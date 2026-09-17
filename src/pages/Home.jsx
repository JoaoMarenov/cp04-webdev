import PopularSection from '../components/PopularSection'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero-section hero-centered">
        <div className="hero-copy">
          <span className="eyebrow">O PRÓXIMO PLAY COMEÇA AQUI</span>
          <h1>Tanta história boa.<br />Qual é a <span>próxima?</span></h1>
          <p>Descubra filmes e séries, encontre aquela indicação<br className="desktop-break" /> e guarde tudo para a sua próxima sessão.</p>
          <div className="hero-actions"><Link className="button button-primary" to="/buscar">Encontrar uma história<i className="bx bx-right-arrow-alt" aria-hidden="true" /></Link><Link className="text-link" to="/minha-lista"><i className="bx bx-bookmark" aria-hidden="true" />Minha Lista</Link></div>
        </div>
      </section>
      <PopularSection type="movie" title="Filmes em alta" description="Histórias que estão chamando a atenção." />
      <PopularSection type="tv" title="Séries em alta" description="Encontre sua próxima série favorita." />
    </>
  )
}
