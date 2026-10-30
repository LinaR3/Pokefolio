export default function Screen({ children, isPowering = false }) {
  return <section className={`pokedex-screen${isPowering ? ' is-powering' : ''}`} aria-live="polite">{children}</section>
}
