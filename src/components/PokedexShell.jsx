import { useEffect, useRef, useState } from 'react'
import Screen from './Screen.jsx'
import SplashScreen from './SplashScreen.jsx'
import ProjectCard, { ProjectSummaryCard } from './ProjectCard.jsx'
import ProjectOverlay from './ProjectOverlay.jsx'
import { audioProjects, contact, gameProjects } from '../data/portfolio.js'

function getEmailComposeUrl(email) {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: email })
  return `https://mail.google.com/mail/?${params.toString()}`
}

const sections = [
  { id: 'projects', label: 'Proyectos', icon: '▣', number: '#001', title: 'Proyectos', types: ['CÓDIGO'] },
  { id: 'audio', label: 'Audio / SFX', icon: '♫', number: '#002', title: 'Audio & SFX', types: ['SONIDO'] },
  { id: 'contact', label: 'Contacto', icon: '✉', number: '#003', title: 'Contacto', types: ['ENTRENADORA', 'LINKS'] },
]

function Pokeball({ className = '' }) {
  return <span aria-hidden="true" className={`pokeball ${className}`}><span className="pokeball__band"><i /></span></span>
}

function WelcomeScreen({ onStart }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-copy">
        <p className="eyebrow">POKEFOLIO EDITION</p>
        <h1>Lina Reina</h1>
        <p className="welcome-tag">Game Developer | C# | Python | Music Producer</p>
      </div>
      <button className="welcome-ball-button" onClick={onStart} aria-label="Abrir Pokefolio">
        <Pokeball className="pokeball--large" />
        <span className="trainer-id">ENTRENADORA ID: #0903</span>
      </button>
      <div className="welcome-action">
        <button className="pixel-button" onClick={onStart}>INICIAR AVENTURA <span>►</span></button>
        <p>Usa los controles o da click para comenzar.</p>
      </div>
    </div>
  )
}

function ProjectDetail({ projects, selectedItem, category }) {
  const project = projects[selectedItem]
  return (
    <div className="screen-content project-detail-screen">
      <ProjectCard project={project} index={selectedItem} category={category} />
      <p className="detail-hint">Usa el selector inferior o ▲ / ▼ para cambiar de ficha.</p>
    </div>
  )
}

function ProjectSelectionTray({ projects, activeSection, selectedItem, onSelect }) {
  const sectionTitle = activeSection === 'audio' ? 'MUESTRAS DE AUDIO' : 'PROYECTOS'
  return (
    <div className="project-selection" aria-label={`Selecciona ${sectionTitle.toLowerCase()}`}>
      <div className="project-selection-heading"><span>{sectionTitle}</span><small>▲ / ▼ NAVEGAR</small></div>
      <div className="project-selector-list">
        {projects.map((project, index) => <ProjectSummaryCard key={project.name} project={project} index={index} selected={selectedItem === index} onSelect={() => onSelect(index)} />)}
      </div>
    </div>
  )
}

function ContactIcon({ type }) {
  if (type === 'github') return (
    <svg className="contact-icon contact-icon--github" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.16 1.71 1.16.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.21 1.16-2.99-.12-.29-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.67.12 2.96.72.78 1.15 1.77 1.15 2.99 0 4.28-2.61 5.22-5.1 5.5.4.35.75 1.03.75 2.08v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  )
  if (type === 'linkedin') return <span className="contact-icon contact-icon--linkedin" aria-hidden="true">in</span>
  return <span className="contact-icon contact-icon--itchio" aria-hidden="true">itch.io</span>
}

function ContactLink({ type, label, value, href, hint }) {
  const content = (
    <>
      <ContactIcon type={type} />
      <span className="contact-link-copy">
        <span className="contact-link-label">{label}</span>
        <strong>{value}</strong>
        <small>{hint}</small>
      </span>
      <span className="contact-link-arrow" aria-hidden="true">↗</span>
    </>
  )

  return <a className={`contact-link contact-link--${type}`} href={href} target="_blank" rel="noreferrer">{content}</a>
}

function ContactContent() {
  return (
    <div className="screen-content">
      <article className="lcd-card contact-card">
        <div className="trainer-card">
          <div className="trainer-avatar trainer-hug-sprite" role="img" aria-label="Lina abrazando a Umbreon, animación pixel art" />
          <div className="trainer-copy"><p className="card-kicker">PERFIL DE ENTRENADORA</p><h2>Lina Reina</h2><p>Game Developer · C# · Python · Music Producer</p></div>
        </div>
        <div className="contact-link-list" aria-label="Perfiles profesionales">
          <ContactLink type="linkedin" label="LINKEDIN" value="LinkedIn de Lina" href={contact.linkedin} hint="VISITAR PERFIL" />
          <ContactLink type="github" label="GITHUB" value="github.com/LinaR3" href={contact.github} hint="VER PROYECTOS" />
          <ContactLink type="itchio" label="ITCH.IO" value="linar3.itch.io" href={contact.itchio} hint="JUGAR MIS PROYECTOS" />
        </div>
        <a className="email-cta" href={getEmailComposeUrl(contact.email)} target="_blank" rel="noreferrer" aria-label={`Abrir Gmail para enviar un correo a ${contact.email}`}>✉ ABRIR GMAIL: {contact.email}</a>
      </article>
    </div>
  )
}

function TrainerStatusCard({ started, activeSection, activeIndex }) {
  if (started && activeSection.id === 'contact') {
    return (
      <a className="mini-card mini-card-link mini-card-contact" href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="Contactar a Lina Reina por LinkedIn">
        <img className="mini-card-icon mini-card-contact-icon" src="/images/thumbnails/linkedin-contact.svg" alt="" />
        <span className="mini-card-copy">
          <span className="mini-card-kicker">¿HABLAMOS DE UNA OPORTUNIDAD?</span>
          <strong>CONTACTAR EN LINKEDIN</strong>
        </span>
        <span className="mini-card-status" aria-hidden="true">↗</span>
      </a>
    )
  }

  const content = <><span className="mini-card-icon">{started ? activeSection.icon : '⚡'}</span><span className="mini-card-copy"><span className="mini-card-kicker">{started ? `SECCIÓN ${activeIndex + 1}` : 'ESTADO ENTRENADORA'}</span><strong>{started ? activeSection.label.toUpperCase() : 'LISTA PARA EXPLORAR'}</strong></span><span className="mini-card-status">ONLINE</span></>

  if (!started) return <a className="mini-card mini-card-link" href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="Visitar LinkedIn de Lina Reina">{content}</a>
  return <div className="mini-card">{content}</div>
}

function AudioEmptyContent() {
  return <div className="lcd-card audio-empty"><span aria-hidden="true">♫</span><h2>MUESTRAS EN CAMINO</h2><p>Pronto...</p></div>
}

function ProjectSelectionPrompt({ title = 'SELECCIONA TU PROYECTO' }) {
  return <div className="project-prompt"><Pokeball className="pokeball--prompt" /><h2>{title}</h2><p>Haz clic en una ficha o usa ▲ / ▼ y presiona K.</p></div>
}

function SectionContent({ section, selectedItem }) {
  if (section === 'projects') return <ProjectSelectionPrompt />
  if (section === 'audio') {
    if (!audioProjects.length) return <AudioEmptyContent />
    return selectedItem == null ? <ProjectSelectionPrompt title="SELECCIONA UNA MUESTRA DE AUDIO" /> : <ProjectDetail projects={audioProjects} selectedItem={selectedItem} category="AUDIO" />
  }
  return <ContactContent />
}

export default function PokedexShell() {
  const [started, setStarted] = useState(false)
  const [screenPowering, setScreenPowering] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedItems, setSelectedItems] = useState({ projects: 0, audio: null })
  const [overlayProject, setOverlayProject] = useState(null)
  const [overlayClosing, setOverlayClosing] = useState(false)
  const [overlayOrigin, setOverlayOrigin] = useState(null)
  const displayFrameRef = useRef(null)
  const activeSection = sections[activeIndex]
  const itemList = activeSection.id === 'audio' ? audioProjects : gameProjects

  function startAdventure() {
    setStarted(true)
    setScreenPowering(true)
    window.setTimeout(() => setScreenPowering(false), 480)
  }

  function selectSection(index) {
    if (!started) startAdventure()
    const nextIndex = (index + sections.length) % sections.length
    if (sections[nextIndex].id === 'audio') setSelectedItems((current) => ({ ...current, audio: null }))
    setActiveIndex(nextIndex)
  }

  function cycleSection(direction) {
    selectSection(activeIndex + direction)
  }

  function cycleItem(direction) {
    if (activeSection.id !== 'projects' && activeSection.id !== 'audio') {
      cycleSection(direction)
      return
    }
    setSelectedItems((current) => ({
      ...current,
      [activeSection.id]: current[activeSection.id] == null
        ? (direction > 0 ? 0 : itemList.length - 1)
        : (current[activeSection.id] + direction + itemList.length) % itemList.length,
    }))
  }

  function openProject(project) {
    const frame = displayFrameRef.current?.getBoundingClientRect()
    if (!frame) return
    setOverlayOrigin({ left: frame.left, top: frame.top, width: frame.width, height: frame.height })
    setOverlayClosing(false)
    setOverlayProject(project)
  }

  function closeProject() {
    if (!overlayProject || overlayClosing) return
    setOverlayClosing(true)
    window.setTimeout(() => {
      setOverlayProject(null)
      setOverlayClosing(false)
    }, 650)
  }

  function handleAButton() {
    if (!started) {
      startAdventure()
      return
    }
    if (activeSection.id === 'projects') openProject(itemList[selectedItems.projects])
    if (activeSection.id === 'audio' && selectedItems.audio != null && itemList[selectedItems.audio]?.playUrl) window.open(itemList[selectedItems.audio].playUrl, '_blank', 'noopener,noreferrer')
    if (activeSection.id === 'contact') window.open(getEmailComposeUrl(contact.email), '_blank', 'noopener,noreferrer')
  }

  function resetToWelcome() {
    setStarted(false)
    setActiveIndex(0)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return
      if (event.key === 'Escape') { if (overlayProject) closeProject(); else resetToWelcome(); return }
      if (overlayProject) return
      if (!started) {
        if (event.key === 'Enter' || event.key.toLowerCase() === 'k') startAdventure()
        return
      }
      if (event.key === 'ArrowRight') { event.preventDefault(); cycleSection(1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); cycleSection(-1) }
      if (event.key === 'ArrowDown') { event.preventDefault(); cycleItem(1) }
      if (event.key === 'ArrowUp') { event.preventDefault(); cycleItem(-1) }
      if (event.key.toLowerCase() === 'k') handleAButton()
      if (event.key.toLowerCase() === 'b') resetToWelcome()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [started, activeIndex, activeSection.id, selectedItems, itemList, overlayProject])

  function handleUpDown(direction) {
    if (!started) setStarted(true)
    else cycleItem(direction)
  }

  return (
    <main className="app-bg">
      <SplashScreen />
      <div className="bg-text" aria-hidden="true">LINA REINA</div>
      <section className="gameboy" aria-label="Pokefolio de Lina Reina">
        <header className="gameboy-topline">
          <span className="topline-rule" />
          <div className="topline-brand"><Pokeball /><span>POKEFOLIO</span><Pokeball /></div>
          <span className="topline-rule" />
        </header>

        <div className="gameboy-display-row">
          <aside className="side-panel side-panel--left" aria-label="Indicadores de consola">
            <div className="sprite-orb">⚡</div>
            <div className="led-stack"><i className="led led--green" /><i className="led led--blue" /></div>
            <span className="side-mark">✦</span>
          </aside>

          <div className="display-frame" ref={displayFrameRef}>
            <div className="scanlines" aria-hidden="true" />
            <Screen isPowering={screenPowering}>
              {!started ? <WelcomeScreen onStart={startAdventure} /> : (
                <div className="app-screen">
                  <header className="screen-heading">
                    <span className="screen-number">{activeSection.number}</span>
                    <h1>{activeSection.title}</h1>
                    <div className="type-badges">{activeSection.types.map((type) => <span key={type}>{type}</span>)}</div>
                  </header>
                  <SectionContent section={activeSection.id} selectedItem={selectedItems[activeSection.id]} />
                  <footer className="screen-footer"><span>● SISTEMA LISTO</span><div className="screen-footer-runway" aria-hidden="true"><span className="screen-footer-runner" /></div><span>{String(activeIndex + 1).padStart(2, '0')} / 03</span></footer>
                </div>
              )}
            </Screen>
          </div>

          <aside className="side-panel side-panel--right" aria-label="Controles A y B">
            <div className="sprite-orb">✦</div>
            <div className="ab-buttons">
              <button className="ab-button ab-button--a" onClick={handleAButton} aria-label="A, abrir o iniciar">A</button>
              <button className="ab-button ab-button--b" onClick={resetToWelcome} aria-label="B, volver al inicio">B</button>
            </div>
          </aside>
        </div>

        <div className="console-mark"><i /><span>LINA REINA</span><i /></div>

        <div className="console-controls">
          <nav className="category-nav" aria-label="Secciones del Pokefolio">
            {sections.map((section, index) => (
              <button key={section.id} className={`category-button${started && activeIndex === index ? ' is-active' : ''}`} onClick={() => selectSection(index)} aria-pressed={started && activeIndex === index}>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>

          <div className="control-row">
            <div className="dpad" aria-label="Navegación">
              <button className="dpad-button dpad-up" onClick={() => handleUpDown(-1)} aria-label="Elemento anterior">▲</button>
              <button className="dpad-button dpad-left" onClick={() => cycleSection(-1)} aria-label="Sección anterior">◀</button>
              <span className="dpad-center" />
              <button className="dpad-button dpad-right" onClick={() => cycleSection(1)} aria-label="Sección siguiente">▶</button>
              <button className="dpad-button dpad-down" onClick={() => handleUpDown(1)} aria-label="Elemento siguiente">▼</button>
            </div>
            <div className="mobile-ab-buttons"><button className="ab-button ab-button--a" onClick={handleAButton} aria-label="A, abrir o iniciar">A</button><button className="ab-button ab-button--b" onClick={resetToWelcome} aria-label="B, volver al inicio">B</button></div>
            {started && (activeSection.id === 'projects' || (activeSection.id === 'audio' && itemList.length > 0)) ? (
              <ProjectSelectionTray projects={itemList} activeSection={activeSection.id} selectedItem={selectedItems[activeSection.id]} onSelect={(index) => { setSelectedItems((current) => ({ ...current, [activeSection.id]: index })); if (activeSection.id === 'projects') openProject(gameProjects[index]) }} />
            ) : (
              <TrainerStatusCard started={started} activeSection={activeSection} activeIndex={activeIndex} />
            )}
          </div>

          <footer className="console-footer"><button onClick={resetToWelcome}>◀ INICIO / REINICIAR</button><span>HECHO EN EL LLANO</span></footer>
        </div>
      </section>
      <ProjectOverlay project={overlayProject} origin={overlayOrigin} closing={overlayClosing} onClose={closeProject} />
    </main>
  )
}
