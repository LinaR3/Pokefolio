import { useState } from 'react'
import Screen from './Screen.jsx'

const sections = [
  { id: 'profile', label: 'Perfil', icon: '✦', number: '#001', title: 'Lina Reina', types: ['ENTRENADORA', 'DEV'] },
  { id: 'projects', label: 'Proyectos', icon: '▣', number: '#002', title: 'Proyectos', types: ['CÓDIGO'] },
  { id: 'audio', label: 'Audio / SFX', icon: '♫', number: '#003', title: 'Audio & SFX', types: ['SONIDO'] },
  { id: 'contact', label: 'Contacto', icon: '✉', number: '#004', title: 'Contacto', types: ['LINKS'] },
]

function Pokeball({ className = '' }) {
  return <span aria-hidden="true" className={`pokeball ${className}`}><span className="pokeball__band"><i /></span></span>
}

function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-copy">
        <p className="eyebrow">GAMEBOY PORTFOLIO EDITION</p>
        <h1>Lina Alejandra<br /><span>Reina Parra</span></h1>
        <p className="welcome-tag">DESARROLLO · CREATIVIDAD · AUDIO</p>
      </div>
      <button className="welcome-ball-button" onClick={onStart} aria-label="Abrir Pokéfolio">
        <Pokeball className="pokeball--large" />
        <span className="trainer-id">ENTRENADORA ID: #2026</span>
      </button>
      <div className="welcome-action">
        <button className="pixel-button" onClick={onStart}>INICIAR AVENTURA <span>►</span></button>
        <p>Usa los controles o selecciona una sección</p>
      </div>
    </div>
  )
}

function SectionContent({ section }) {
  if (section === 'profile') return (
    <div className="screen-content">
      <article className="lcd-card profile-card">
        <div className="avatar-pixel" aria-hidden="true">⚡</div>
        <div><p className="card-kicker">PERFIL DE ENTRENADORA</p><h2>Lina Alejandra Reina Parra</h2><p>Desarrolladora de software y creadora de experiencias digitales.</p></div>
      </article>
      <article className="lcd-card"><h3>■ SOBRE MÍ</h3><p>Este espacio contará tu historia, las herramientas que usas y lo que te inspira a crear. Puedes personalizar este texto con tu bio.</p></article>
      <article className="lcd-card"><h3>■ HABILIDADES</h3><div className="skill-tags"><span>Desarrollo web</span><span>Programación</span><span>Audio interactivo</span></div></article>
    </div>
  )

  if (section === 'projects') return (
    <div className="screen-content">
      <article className="lcd-card"><p className="card-kicker">TU PRÓXIMA EVOLUCIÓN</p><h2>Proyectos</h2><p>Aquí agregaremos tus proyectos, capturas, tecnologías y enlaces al código o a la demo.</p></article>
      <article className="lcd-card project-placeholder"><div className="project-mon">?</div><div><h3>Nuevo proyecto</h3><p>Nombre, descripción e imagen</p></div><span className="coming-soon">PRÓXIMAMENTE</span></article>
    </div>
  )

  if (section === 'audio') return (
    <div className="screen-content">
      <article className="lcd-card"><p className="card-kicker">LABORATORIO SONORO</p><h2>Audio & efectos</h2><p>Una colección para escuchar música, efectos de sonido y experimentos de audio.</p></article>
      <article className="lcd-card audio-placeholder"><span className="audio-glyph">♫</span><div><h3>Demo de audio</h3><p>Agregaremos aquí tus pistas y controles de reproducción.</p></div></article>
    </div>
  )

  return (
    <div className="screen-content">
      <article className="lcd-card"><p className="card-kicker">NUEVAS AVENTURAS</p><h2>Hablemos</h2><p>Pronto podrás añadir aquí tu correo, redes y enlaces profesionales.</p></article>
      <article className="lcd-card contact-placeholder"><span aria-hidden="true">✉</span><div><h3>Contacto</h3><p>Correo · GitHub · LinkedIn</p></div></article>
    </div>
  )
}

export default function PokedexShell() {
  const [started, setStarted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSection = sections[activeIndex]

  function selectSection(index) {
    setStarted(true)
    setActiveIndex((index + sections.length) % sections.length)
  }

  function cycleSection(direction) {
    selectSection(activeIndex + direction)
  }

  function handleUpDown(direction) {
    if (!started) setStarted(true)
    else if (activeSection.id === 'projects') cycleSection(direction)
  }

  return (
    <main className="app-bg">
      <div className="bg-text" aria-hidden="true">LINA REINA</div>
      <section className="gameboy" aria-label="Pokéfolio de Lina Reina">
        <header className="gameboy-topline">
          <span className="topline-rule" />
          <div className="topline-brand"><Pokeball /><span>POKÉFOLIO <b>•</b> LINA REINA</span><Pokeball /></div>
          <span className="topline-rule" />
        </header>

        <div className="gameboy-display-row">
          <aside className="side-panel side-panel--left" aria-label="Indicadores de consola">
            <div className="sprite-orb">⚡</div>
            <div className="led-stack"><i className="led led--green" /><i className="led led--blue" /></div>
            <span className="side-mark">✦</span>
          </aside>

          <div className="display-frame">
            <div className="scanlines" aria-hidden="true" />
            <Screen>
              {!started ? <WelcomeScreen onStart={() => setStarted(true)} /> : (
                <div className="app-screen">
                  <header className="screen-heading">
                    <span className="screen-number">{activeSection.number}</span>
                    <h1>{activeSection.title}</h1>
                    <div className="type-badges">{activeSection.types.map((type) => <span key={type}>{type}</span>)}</div>
                  </header>
                  <SectionContent section={activeSection.id} />
                  <footer className="screen-footer"><span>● SISTEMA LISTO</span><span>{String(activeIndex + 1).padStart(2, '0')} / 04</span></footer>
                </div>
              )}
            </Screen>
          </div>

          <aside className="side-panel side-panel--right" aria-label="Controles A y B">
            <div className="sprite-orb">✦</div>
            <div className="ab-buttons">
              <button className="ab-button ab-button--a" onClick={() => setStarted(true)} aria-label="A, iniciar">A</button>
              <button className="ab-button ab-button--b" onClick={() => started ? setActiveIndex(0) : setStarted(true)} aria-label="B, volver a perfil">B</button>
            </div>
            <span className="side-mark side-mark--blue">AZUL</span>
          </aside>
        </div>

        <div className="console-mark"><i /><span>P O K É D E X</span><i /></div>

        <div className="console-controls">
          <nav className="category-nav" aria-label="Secciones del Pokéfolio">
            {sections.map((section, index) => (
              <button key={section.id} className={`category-button${started && activeIndex === index ? ' is-active' : ''}`} onClick={() => selectSection(index)} aria-pressed={started && activeIndex === index}>
                <span className="category-icon" aria-hidden="true">{section.icon}</span><span>{section.label}</span>
              </button>
            ))}
          </nav>

          <div className="control-row">
            <div className="dpad" aria-label="Navegación">
              <button className="dpad-button dpad-up" onClick={() => handleUpDown(-1)} aria-label="Arriba">▲</button>
              <button className="dpad-button dpad-left" onClick={() => cycleSection(-1)} aria-label="Sección anterior">◀</button>
              <span className="dpad-center" />
              <button className="dpad-button dpad-right" onClick={() => cycleSection(1)} aria-label="Sección siguiente">▶</button>
              <button className="dpad-button dpad-down" onClick={() => handleUpDown(1)} aria-label="Abajo">▼</button>
            </div>
            <div className="mini-card"><span className="mini-card-icon">{started ? activeSection.icon : '⚡'}</span><div><span className="mini-card-kicker">{started ? `SECCIÓN ${activeIndex + 1}` : 'ESTADO ENTRENADORA'}</span><strong>{started ? activeSection.label.toUpperCase() : 'LISTA PARA EXPLORAR'}</strong></div><span className="mini-card-status">ONLINE</span></div>
          </div>

          <footer className="console-footer"><button onClick={() => { setStarted(false); setActiveIndex(0) }}>◀ INICIO / REINICIAR</button><span>HECHO CON CURIOSIDAD <b>♥</b></span></footer>
        </div>
      </section>
    </main>
  )
}
