import { useEffect, useState } from 'react'
import Screen from './Screen.jsx'
import ProjectCard, { ProjectSummaryCard } from './ProjectCard.jsx'
import { audioProjects, contact, gameProjects, skills } from '../data/portfolio.js'

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
        <h1>Lina Alejandra<br /><span>Reina</span></h1>
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

function ProfileContent() {
  return (
    <div className="screen-content">
      <article className="lcd-card profile-card">
        <div className="photo-placeholder" role="img" aria-label="Espacio reservado para foto de perfil"><span>FOTO</span><small>tu imagen aquí</small></div>
        <div className="profile-intro"><p className="card-kicker">PERFIL DE ENTRENADORA</p><h2>Lina Alejandra Reina</h2><p className="profile-role">Game Developer | C# | Sound Designer | Unity</p></div>
      </article>
      <p className="photo-hint">FOTO DE PERFIL · sugerido: 512 × 512 px, cuadrada</p>
      <article className="lcd-card"><h3>■ BIOGRAFÍA DE ENTRENADORA</h3><p className="editable-placeholder">[Escribe aquí tu biografía: quién eres, qué te gusta crear y qué buscas en tus próximos proyectos.]</p></article>
      <article className="lcd-card skills-card"><h3>■ TECH STACK</h3><div className="skill-bars">{skills.map((skill) => <div className="skill-row" key={skill.name}><div className="skill-label"><span>{skill.name}</span><strong>{skill.value}%</strong></div><div className="skill-track" role="progressbar" aria-label={skill.name} aria-valuemin="0" aria-valuemax="100" aria-valuenow={skill.value}><span style={{ width: `${skill.value}%` }} /></div></div>)}</div></article>
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

function ContactContent() {
  return (
    <div className="screen-content">
      <article className="lcd-card contact-card">
        <p className="card-kicker">TARJETA DE ENTRENADORA</p>
        <h2>Lina Alejandra Reina</h2>
        <dl className="contact-list">
          <div><dt>EMAIL</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
          <div><dt>GITHUB</dt><dd><a href={contact.github} target="_blank" rel="noreferrer">github.com/LinaR3/Pokefolio ↗</a></dd></div>
          <div><dt>LINKEDIN</dt><dd>{contact.linkedin ? <a href={contact.linkedin} target="_blank" rel="noreferrer">Ver perfil ↗</a> : <span className="editable-placeholder">[Agrega aquí tu URL de LinkedIn]</span>}</dd></div>
        </dl>
        <a className="email-cta" href={`mailto:${contact.email}`}>✉ ENVIAR UN CORREO</a>
        <p className="sample-note">El correo es un dato de ejemplo: cámbialo por el tuyo antes de publicar.</p>
      </article>
    </div>
  )
}

function SectionContent({ section, selectedItem }) {
  if (section === 'profile') return <ProfileContent />
  if (section === 'projects') return <ProjectDetail projects={gameProjects} selectedItem={selectedItem} category="PROYECTO" />
  if (section === 'audio') return <ProjectDetail projects={audioProjects} selectedItem={selectedItem} category="AUDIO" />
  return <ContactContent />
}

export default function PokedexShell() {
  const [started, setStarted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedItems, setSelectedItems] = useState({ projects: 0, audio: 0 })
  const activeSection = sections[activeIndex]
  const itemList = activeSection.id === 'audio' ? audioProjects : gameProjects

  function selectSection(index) {
    setStarted(true)
    setActiveIndex((index + sections.length) % sections.length)
  }

  function cycleSection(direction) {
    selectSection(activeIndex + direction)
  }

  function cycleItem(direction) {
    if (activeSection.id !== 'projects' && activeSection.id !== 'audio') {
      cycleSection(direction)
      return
    }
    setSelectedItems((current) => ({ ...current, [activeSection.id]: (current[activeSection.id] + direction + itemList.length) % itemList.length }))
  }

  function handleAButton() {
    if (!started) {
      setStarted(true)
      return
    }
    if (activeSection.id === 'projects' || activeSection.id === 'audio') window.open(itemList[selectedItems[activeSection.id]].playUrl, '_blank', 'noopener,noreferrer')
    if (activeSection.id === 'contact') window.location.href = `mailto:${contact.email}`
  }

  function resetToWelcome() {
    setStarted(false)
    setActiveIndex(0)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return
      if (event.key === 'Escape') { resetToWelcome(); return }
      if (!started) {
        if (event.key === 'Enter' || event.key.toLowerCase() === 'a') setStarted(true)
        return
      }
      if (event.key === 'ArrowRight') { event.preventDefault(); cycleSection(1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); cycleSection(-1) }
      if (event.key === 'ArrowDown') { event.preventDefault(); cycleItem(1) }
      if (event.key === 'ArrowUp') { event.preventDefault(); cycleItem(-1) }
      if (event.key.toLowerCase() === 'a') handleAButton()
      if (event.key.toLowerCase() === 'b') setActiveIndex(0)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [started, activeIndex, activeSection.id, selectedItems, itemList])

  function handleUpDown(direction) {
    if (!started) setStarted(true)
    else cycleItem(direction)
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
                  <SectionContent section={activeSection.id} selectedItem={selectedItems[activeSection.id] ?? 0} />
                  <footer className="screen-footer"><span>● SISTEMA LISTO</span><span>{String(activeIndex + 1).padStart(2, '0')} / 04</span></footer>
                </div>
              )}
            </Screen>
          </div>

          <aside className="side-panel side-panel--right" aria-label="Controles A y B">
            <div className="sprite-orb">✦</div>
            <div className="ab-buttons">
              <button className="ab-button ab-button--a" onClick={handleAButton} aria-label="A, abrir o iniciar">A</button>
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
              <button className="dpad-button dpad-up" onClick={() => handleUpDown(-1)} aria-label="Elemento anterior">▲</button>
              <button className="dpad-button dpad-left" onClick={() => cycleSection(-1)} aria-label="Sección anterior">◀</button>
              <span className="dpad-center" />
              <button className="dpad-button dpad-right" onClick={() => cycleSection(1)} aria-label="Sección siguiente">▶</button>
              <button className="dpad-button dpad-down" onClick={() => handleUpDown(1)} aria-label="Elemento siguiente">▼</button>
            </div>
            <div className="mobile-ab-buttons"><button className="ab-button ab-button--a" onClick={handleAButton} aria-label="A, abrir o iniciar">A</button><button className="ab-button ab-button--b" onClick={() => started ? setActiveIndex(0) : setStarted(true)} aria-label="B, volver a perfil">B</button></div>
            {started && (activeSection.id === 'projects' || activeSection.id === 'audio') ? (
              <ProjectSelectionTray projects={itemList} activeSection={activeSection.id} selectedItem={selectedItems[activeSection.id]} onSelect={(index) => setSelectedItems((current) => ({ ...current, [activeSection.id]: index }))} />
            ) : (
              <div className="mini-card"><span className="mini-card-icon">{started ? activeSection.icon : '⚡'}</span><div><span className="mini-card-kicker">{started ? `SECCIÓN ${activeIndex + 1}` : 'ESTADO ENTRENADORA'}</span><strong>{started ? activeSection.label.toUpperCase() : 'LISTA PARA EXPLORAR'}</strong></div><span className="mini-card-status">ONLINE</span></div>
            )}
          </div>

          <footer className="console-footer"><button onClick={resetToWelcome}>◀ INICIO / REINICIAR</button><span>HECHO CON CURIOSIDAD <b>♥</b></span></footer>
        </div>
      </section>
    </main>
  )
}
