export function ProjectTechnology({ project }) {
  if (!project.technology) return null

  return (
    <p className="project-technology">
      <span>Tecnología:</span>
      <strong>{project.technology}</strong>
    </p>
  )
}

export function ProjectFacts({ project, className = '' }) {
  const gameTypes = Array.isArray(project.gameType) ? project.gameType : []
  const hasFacts = project.role || gameTypes.length > 0

  if (!hasFacts) return null

  return (
    <dl className={`project-facts${className ? ` ${className}` : ''}`}>
      {project.role && (
        <div className="project-facts__role">
          <dt>Rol:</dt>
          <dd>{project.role}</dd>
        </div>
      )}
      {gameTypes.length > 0 && (
        <div className="project-facts__type">
          <dt>Tipo de juego</dt>
          <dd className="project-game-types">
            {gameTypes.map((type, index) => (
              <span key={type}>{type}{index < gameTypes.length - 1 ? ',' : ''}</span>
            ))}
          </dd>
        </div>
      )}
    </dl>
  )
}
