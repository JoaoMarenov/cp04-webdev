export default function WatchProviders({ providers, loading, error }) {
  if (loading) {
    return (
      <section className="watch-providers" aria-labelledby="watch-providers-title">
        <h2 id="watch-providers-title"><i className="bx bx-play-circle" aria-hidden="true" />Onde assistir</h2>
        <p className="watch-status"><i className="bx bx-loader-alt spinner" aria-hidden="true" />Consultando as opções disponíveis…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="watch-providers" aria-labelledby="watch-providers-title">
        <h2 id="watch-providers-title"><i className="bx bx-play-circle" aria-hidden="true" />Onde assistir</h2>
        <p className="watch-status">Não foi possível consultar onde assistir agora.</p>
      </section>
    )
  }

  const regionLabel = providers.region === 'BR' ? 'Brasil' : providers.region

  return (
    <section className="watch-providers" aria-labelledby="watch-providers-title">
      <h2 id="watch-providers-title"><i className="bx bx-play-circle" aria-hidden="true" />Onde assistir</h2>
      {providers.groups.length === 0 ? (
        <p className="watch-status">Ainda não há opções de exibição informadas para {regionLabel}.</p>
      ) : (
        <>
          <p className="watch-intro">Disponível em {regionLabel}</p>
          <div className="provider-groups">
            {providers.groups.map(group => (
              <div className="provider-group" key={group.id}>
                <h3>{group.label}</h3>
                <ul className="provider-list">
                  {group.providers.map(provider => (
                    <li className="provider" key={provider.provider_id}>
                      {provider.provider_name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {providers.link && <a className="watch-link" href={providers.link} target="_blank" rel="noreferrer">Ver opções na TMDB<i className="bx bx-link-external" aria-hidden="true" /></a>}
          <p className="watch-credit">Disponibilidade fornecida por JustWatch.</p>
        </>
      )}
    </section>
  )
}
