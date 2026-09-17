export default function Feedback({ kind = 'empty', title, message, children }) {
  return (
    <section className={`feedback feedback-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="feedback-icon" aria-hidden="true">
        {kind === 'loading' ? <i className="bx bx-loader-alt spinner" /> : kind === 'error' ? <i className="bx bx-error-circle" /> : <i className="bx bx-film" />}
      </span>
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {children}
    </section>
  )
}
