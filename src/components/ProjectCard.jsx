const statusClass = {
  READY: 'ready',
  'IN PROGRESS': 'progress',
  SUSPENDIDO: 'suspended',
}

function ProjectVisual({ project, index, compact = false }) {
  const content = project.video
    ? <video src={project.video} poster={project.image} controls preload="none" aria-label={`Video de ${project.name}`} />
    : project.image
      ? <img src={project.image} alt={project.visualLabel} loading="lazy" />
      : <span>{project.visual}</span>

  return (
    <div className={`project-visual project-visual--${project.theme}${compact ? ' project-visual--compact' : ''}`} role={project.image || project.video ? undefined : 'img'} aria-label={project.image || project.video ? undefined : project.visualLabel}>
      {content}
      {!project.image && !project.video && <small>{compact ? String(index + 1).padStart(2, '0') : 'PREVIEW'}</small>}
    </div>
  )
}

export function ProjectSummaryCard({ project, index, selected, onSelect }) {
  const statusTone = statusClass[project.status] ?? 'progress'
  return (
    <button type="button" className={`project-summary${selected ? ' project-summary--selected' : ''}`} onClick={onSelect} aria-pressed={selected} aria-label={`Ver ${project.name}, ${project.status}`}>
      <ProjectVisual project={project} index={index} compact />
      <span className="project-summary-copy"><strong>{String(index + 1).padStart(2, '0')} · {project.name}</strong><small className={`project-summary-status project-status--${statusTone}`}><i />{project.status}</small></span>
    </button>
  )
}

export default function ProjectCard({ project, index, category = 'Proyecto' }) {
  const statusTone = statusClass[project.status] ?? 'progress'
  return (
    <article className="lcd-card project-detail">
      <ProjectVisual project={project} index={index} />
      <div className="project-detail-body">
        <div className="project-card-title-row">
          <div><p className="card-kicker">{category} #{String(index + 1).padStart(3, '0')}</p><h2>{project.name}</h2></div>
          <span className={`project-status project-status--${statusTone}`}><i />{project.status}</span>
        </div>
        <p className="project-description">{project.description}</p>
        <dl className="project-details">
          <div><dt>ROL</dt><dd>{project.role}</dd></div>
          <div><dt>INTEGRANTES</dt><dd>{project.members}</dd></div>
          <div><dt>ENGINE</dt><dd>{project.engine}</dd></div>
        </dl>
        <a className="project-play" href={project.playUrl} target="_blank" rel="noreferrer" aria-label={`Abrir enlace de ejemplo para ${project.name}`}>
          <span>▶ PLAY</span><small>ENLACE DE EJEMPLO</small>
        </a>
      </div>
    </article>
  )
}
