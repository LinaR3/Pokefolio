const statusClass = {
  READY: 'ready',
  'IN PROGRESS': 'progress',
  SUSPENDIDO: 'suspended',
}

export default function ProjectCard({ project, index, selected = false, category = 'Proyecto' }) {
  const statusTone = statusClass[project.status] ?? 'progress'

  return (
    <article className={`lcd-card project-card${selected ? ' project-card--selected' : ''}`} aria-current={selected ? 'true' : undefined}>
      <div className={`project-visual project-visual--${project.theme}`} role={project.image || project.video ? undefined : 'img'} aria-label={project.image || project.video ? undefined : project.visualLabel}>
        {project.video ? <video src={project.video} poster={project.image} controls preload="none" aria-label={`Video de ${project.name}`} /> : project.image ? <img src={project.image} alt={project.visualLabel} loading="lazy" /> : <span>{project.visual}</span>}
        {!project.image && !project.video && <small>{String(index + 1).padStart(2, '0')} · PREVIEW</small>}
      </div>
      <div className="project-card-body">
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
