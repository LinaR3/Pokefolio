const statusClass = {
  READY: 'ready',
  'IN PROGRESS': 'progress',
  SUSPENDIDO: 'suspended',
}

export function ProjectPreview({ project, index = 0, compact = false }) {
  const content = compact && project.thumbnail
    ? <img src={project.thumbnail} alt={project.thumbnailLabel ?? project.visualLabel} loading="lazy" />
    : project.video
      ? <video src={project.video} poster={project.image} controls preload="none" aria-label={`Video de ${project.name}`} />
      : project.image
        ? <img src={project.image} alt={project.visualLabel} loading="lazy" />
        : <span>{project.visual}</span>

  return (
    <div className={`project-visual project-visual--${project.theme}${compact ? ' project-visual--compact' : ''}`} role={project.image || project.video || (compact && project.thumbnail) ? undefined : 'img'} aria-label={project.image || project.video || (compact && project.thumbnail) ? undefined : project.visualLabel}>
      {content}
      {!project.image && !project.video && !(compact && project.thumbnail) && <small>{compact ? String(index + 1).padStart(2, '0') : 'PREVIEW'}</small>}
    </div>
  )
}

export function ProjectSummaryCard({ project, index, selected, onSelect }) {
  const statusTone = statusClass[project.status] ?? 'progress'
  return (
    <button type="button" className={`project-summary${selected ? ' project-summary--selected' : ''}`} onClick={onSelect} aria-pressed={selected} aria-label={`Ver ${project.name}, ${project.status}`}>
      <ProjectPreview project={project} index={index} compact />
      <span className="project-summary-copy"><strong>{String(index + 1).padStart(2, '0')} · {project.name}</strong><small className={`project-summary-status project-status--${statusTone}`}><i />{project.status}</small></span>
    </button>
  )
}

export default function ProjectCard({ project, index, category = 'Proyecto' }) {
  const statusTone = statusClass[project.status] ?? 'progress'
  return (
    <article className={`lcd-card project-detail${project.wide ? ' project-detail--wide' : ''}`}>
      {!project.wide && <ProjectPreview project={project} index={index} />}
      <div className="project-detail-body">
        <div className="project-card-title-row">
          <div><p className="card-kicker">{category} #{String(index + 1).padStart(3, '0')}</p><h2>{project.name}</h2></div>
          <span className={`project-status project-status--${statusTone}`}><i />{project.status}</span>
        </div>
        {project.description && !project.hideDescription && <p className="project-description">{project.description}</p>}
        <dl className="project-details">
          {project.role && <div><dt>ROL</dt><dd>{project.role}</dd></div>}
          {project.members && <div><dt>EQUIPO</dt><dd>{project.members}</dd></div>}
          {project.contributions && <div><dt>APORTES</dt><dd>{project.contributions}</dd></div>}
          {project.engine && <div><dt>ENGINE</dt><dd>{project.engine}</dd></div>}
        </dl>
        {project.embedUrl && <iframe className="spotify-embed" src={project.embedUrl} title={`Reproductor de Spotify: ${project.name}`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" allowFullScreen style={project.embedHeight ? { height: `${project.embedHeight}px` } : undefined} />}
        {project.embedUrl && project.playUrl
          ? <a className="spotify-link" href={project.playUrl} target="_blank" rel="noreferrer">ABRIR EN SPOTIFY ↗</a>
          : project.playUrl
            ? <a className="project-play" href={project.playUrl} target="_blank" rel="noreferrer" aria-label={`Abrir ${project.name}`}><span>▶ PLAY</span><small>{project.linkLabel ?? 'ABRIR PROYECTO'}</small></a>
            : <span className="project-play project-play--disabled">PREVIEW GRATIS · PRÓXIMAMENTE</span>}
      </div>
    </article>
  )
}
