import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ProjectPreview } from './ProjectCard.jsx'
import { ProjectFacts, ProjectTechnology } from './ProjectFacts.jsx'
import { PokeballMark } from './PokeballMark.jsx'

export default function ProjectOverlay({ project, origin, closing = false, onClose }) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)))
    return () => cancelAnimationFrame(frame)
  }, [])

  if (!project || !origin) return null

  return createPortal(
    <div className={`project-overlay${expanded && !closing ? ' is-expanded' : ''}`}>
      <button className="project-overlay__backdrop" onClick={onClose} aria-label="Cerrar ficha ampliada" />
      <section
        className="project-overlay__screen"
        style={{
          '--origin-left': `${origin.left}px`,
          '--origin-top': `${origin.top}px`,
          '--origin-width': `${origin.width}px`,
          '--origin-height': `${origin.height}px`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Proyecto ${project.name}`}
      >
        <header className="project-overlay__header">
          <span><PokeballMark /> FICHA DE PROYECTO</span>
          <button onClick={onClose} aria-label="Volver al Pokefolio">✕ CERRAR</button>
        </header>
        <div className="project-overlay__body">
          <div className="project-overlay__preview">
            <ProjectPreview project={project} />
            <a className="project-overlay__play" href={project.playUrl} target="_blank" rel="noreferrer">
              {project.playLabel ?? '▶ JUGAR DEMO ↗'}
            </a>
          </div>
          <article className="project-overlay__copy">
            <ProjectTechnology project={project} />
            <h2>{project.name}</h2>
            <p className="project-overlay__description">{project.description}</p>
            <ProjectFacts project={project} className="project-overlay__facts" />
            <button className="project-overlay__return" onClick={onClose}>◀ VOLVER AL POKEFOLIO</button>
          </article>
        </div>
      </section>
    </div>,
    document.body,
  )
}
