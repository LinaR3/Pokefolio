import { ProjectFacts, ProjectTechnology } from './ProjectFacts.jsx'

const statusClass = {
  READY: 'ready',
  'IN PROGRESS': 'progress',
  SUSPENDIDO: 'suspended',
}
const statusLabel = {
  READY: 'Disponible',
  'IN PROGRESS': 'En progreso',
  SUSPENDIDO: 'Pausa',
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
  const label = statusLabel[project.status] ?? project.status
  return (
    <button type="button" className={`project-summary${selected ? ' project-summary--selected' : ''}`} onClick={onSelect} aria-pressed={selected} aria-label={`Ver ${project.name}, ${label}`}>
      <ProjectPreview project={project} index={index} compact />
      <span className="project-summary-copy"><strong>{project.name}</strong></span>
      <span className={`project-status-dot project-status--${statusTone}`} title={label} aria-hidden="true" />
    </button>
  )
}

export default function ProjectCard({ project, index, category = 'Proyecto' }) {
  const statusTone = statusClass[project.status] ?? 'progress'
  const label = statusLabel[project.status] ?? project.status
  return (
    <article className={`lcd-card project-detail${project.wide ? ' project-detail--wide' : ''}`}>
      {!project.wide && <ProjectPreview project={project} index={index} />}
      <div className="project-detail-body">
        {category && <p className="card-kicker project-detail-category">{category} #{String(index + 1).padStart(3, '0')}</p>}
        <ProjectTechnology project={project} />
        <div className="project-card-title-row">
          <h2>{project.name}</h2>
          <span className={`project-status-dot project-status--${statusTone}`} title={label} role="img" aria-label={`Estado del proyecto: ${label}`} />
        </div>
        {project.description && !project.hideDescription && <p className="project-description">{project.description}</p>}
        <ProjectFacts project={project} />
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
