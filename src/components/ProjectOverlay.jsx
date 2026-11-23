import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ProjectPreview } from './ProjectCard.jsx'
import { ProjectFacts, ProjectTechnology } from './ProjectFacts.jsx'
import { PokeballMark } from './PokeballMark.jsx'

function usesTouchPlayer(isAirRace) {
  const query = isAirRace
    ? '(pointer: coarse)'
    : '(max-width: 700px), (pointer: coarse) and (max-width: 900px)'
  return window.matchMedia(query).matches
}

export default function ProjectOverlay({ project, origin, closing = false, onClose }) {
  const isAirRace = project?.name.startsWith('Air Race')
  const [expanded, setExpanded] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [mobileGameMode, setMobileGameMode] = useState(false)
  const screenRef = useRef(null)
  const gameFrameRef = useRef(null)
  const pressedKeysRef = useRef(new Map())

  function releaseAllMobileKeys() {
    for (const [key, { canvas, gameWindow, options }] of pressedKeysRef.current) {
      canvas.dispatchEvent(new gameWindow.KeyboardEvent('keyup', options))
      pressedKeysRef.current.delete(key)
    }
  }

  function finishMobileGame() {
    releaseAllMobileKeys()
    setMobileGameMode(false)
    setGameStarted(false)
    try { window.screen.orientation?.unlock?.() } catch { /* The browser may not expose orientation locking. */ }
    if (document.fullscreenElement === screenRef.current) {
      document.exitFullscreen?.().catch(() => {})
    }
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!mobileGameMode) return undefined

    function leaveOnFullscreenExit() {
      if (!document.fullscreenElement) finishMobileGame()
    }

    function leaveOnEscape(event) {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      finishMobileGame()
    }

    document.addEventListener('fullscreenchange', leaveOnFullscreenExit)
    window.addEventListener('keydown', leaveOnEscape)
    return () => {
      document.removeEventListener('fullscreenchange', leaveOnFullscreenExit)
      window.removeEventListener('keydown', leaveOnEscape)
    }
  }, [mobileGameMode])

  if (!project || !origin) return null

  async function startGame() {
    setGameStarted(true)
    if (!usesTouchPlayer(isAirRace)) return

    setMobileGameMode(true)
    try {
      await screenRef.current?.requestFullscreen?.()
    } catch { /* Keep the CSS full-screen fallback if native fullscreen is unavailable. */ }
    try {
      await window.screen.orientation?.lock?.('landscape')
    } catch { /* The rotate hint stays visible until the phone is turned sideways. */ }
  }

  function returnToProject() {
    if (mobileGameMode) finishMobileGame()
    else setGameStarted(false)
  }

  function closeOverlay() {
    if (mobileGameMode) finishMobileGame()
    onClose?.()
  }

  function openDesktopFullscreen() {
    gameFrameRef.current?.requestFullscreen?.().catch(() => {})
  }

  function pressMobileKey(event, key) {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    if (pressedKeysRef.current.has(key)) return

    const canvas = gameFrameRef.current?.querySelector('iframe')?.contentDocument?.querySelector('#unity-canvas')
    const gameWindow = canvas?.ownerDocument?.defaultView
    if (!canvas || !gameWindow) return

    gameWindow.focus()
    canvas.focus({ preventScroll: true })
    const keyCodes = { ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39, Space: 32 }
    const airRaceKeys = { ArrowUp: ['w', 'KeyW', 87], ArrowDown: ['s', 'KeyS', 83], ArrowLeft: ['a', 'KeyA', 65], ArrowRight: ['d', 'KeyD', 68], Space: [' ', 'Space', 32], Shift: ['Shift', 'ShiftLeft', 16] }
    const [mappedKey, mappedCode, mappedKeyCode] = isAirRace ? airRaceKeys[key] : [key === 'Space' ? ' ' : key, key, keyCodes[key]]
    const options = { key: mappedKey, code: mappedCode, keyCode: mappedKeyCode, which: mappedKeyCode, bubbles: true, cancelable: true }
    canvas.dispatchEvent(new gameWindow.KeyboardEvent('keydown', options))
    pressedKeysRef.current.set(key, { canvas, gameWindow, options })
  }

  function releaseMobileKey(event, key) {
    event.preventDefault()
    const pressedKey = pressedKeysRef.current.get(key)
    if (!pressedKey) return
    const { canvas, gameWindow, options } = pressedKey
    canvas.dispatchEvent(new gameWindow.KeyboardEvent('keyup', options))
    pressedKeysRef.current.delete(key)
  }

  return createPortal(
    <div className={`project-overlay${expanded && !closing ? ' is-expanded' : ''}`}>
      <button className="project-overlay__backdrop" onClick={closeOverlay} aria-label="Cerrar ficha ampliada" />
      <section
        ref={screenRef}
        className={`project-overlay__screen${isAirRace && gameStarted ? ' is-air-race-player' : ''}${mobileGameMode ? ' is-mobile-game-mode' : ''}`}
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
          <button onClick={closeOverlay} aria-label="Volver al Pokefolio">✕ CERRAR</button>
        </header>
        <div className={`project-overlay__body${project.webglUrl ? ' project-overlay__body--playable' : ''}${mobileGameMode ? ' project-overlay__body--mobile-player' : ''}`}>
          <div className={`project-overlay__preview${mobileGameMode ? ' project-overlay__preview--mobile-player' : ''}`}>
            {project.webglUrl ? (
              <>
                <div className="project-overlay__game-frame" ref={gameFrameRef}>
                  {gameStarted ? (
                    <iframe
                      src={project.webglUrl}
                      title={`Jugar ${project.name}`}
                      allow="autoplay; fullscreen; gamepad; screen-wake-lock"
                      allowFullScreen
                      onLoad={isAirRace ? (event) => event.currentTarget.focus({ preventScroll: true }) : undefined}
                    />
                  ) : (
                    <div className="project-overlay__game-poster">
                      {project.thumbnail && <img src={project.thumbnail} alt={project.thumbnailLabel ?? `Vista previa de ${project.name}`} />}
                      <span>DEMO WEBGL · UNITY</span>
                    </div>
                  )}
                </div>
                {mobileGameMode ? (
                  <>
                    <button className="project-overlay__mobile-back" onClick={returnToProject}>↩ VOLVER A LA FICHA</button>
                    <div className="project-overlay__mobile-controls" aria-label="Controles táctiles del juego">
                      <div className="project-overlay__dpad">
                        <button className="is-up" aria-label="Mover hacia arriba" onPointerDown={(event) => pressMobileKey(event, 'ArrowUp')} onPointerUp={(event) => releaseMobileKey(event, 'ArrowUp')} onPointerCancel={(event) => releaseMobileKey(event, 'ArrowUp')} onLostPointerCapture={(event) => releaseMobileKey(event, 'ArrowUp')}>▲</button>
                        <button className="is-left" aria-label="Mover hacia la izquierda" onPointerDown={(event) => pressMobileKey(event, 'ArrowLeft')} onPointerUp={(event) => releaseMobileKey(event, 'ArrowLeft')} onPointerCancel={(event) => releaseMobileKey(event, 'ArrowLeft')} onLostPointerCapture={(event) => releaseMobileKey(event, 'ArrowLeft')}>◀</button>
                        <button className="is-right" aria-label="Mover hacia la derecha" onPointerDown={(event) => pressMobileKey(event, 'ArrowRight')} onPointerUp={(event) => releaseMobileKey(event, 'ArrowRight')} onPointerCancel={(event) => releaseMobileKey(event, 'ArrowRight')} onLostPointerCapture={(event) => releaseMobileKey(event, 'ArrowRight')}>▶</button>
                        <button className="is-down" aria-label="Mover hacia abajo" onPointerDown={(event) => pressMobileKey(event, 'ArrowDown')} onPointerUp={(event) => releaseMobileKey(event, 'ArrowDown')} onPointerCancel={(event) => releaseMobileKey(event, 'ArrowDown')} onLostPointerCapture={(event) => releaseMobileKey(event, 'ArrowDown')}>▼</button>
                      </div>
                      <div className="project-overlay__flight-actions">
                        <button className="project-overlay__fire" aria-label={isAirRace ? 'Activar impulso' : 'Lanzar comida'} onPointerDown={(event) => pressMobileKey(event, 'Space')} onPointerUp={(event) => releaseMobileKey(event, 'Space')} onPointerCancel={(event) => releaseMobileKey(event, 'Space')} onLostPointerCapture={(event) => releaseMobileKey(event, 'Space')}>{isAirRace ? <><span aria-hidden="true">⚡</span><small>IMPULSO</small></> : 'A'}</button>
                        {isAirRace && <button className="project-overlay__brake" aria-label="Frenar y cerrar el giro" onPointerDown={(event) => pressMobileKey(event, 'Shift')} onPointerUp={(event) => releaseMobileKey(event, 'Shift')} onPointerCancel={(event) => releaseMobileKey(event, 'Shift')} onLostPointerCapture={(event) => releaseMobileKey(event, 'Shift')}><strong>SHIFT</strong><small>FRENO / GIRO</small></button>}
                      </div>
                    </div>
                    <div className="project-overlay__rotate-hint" role="status">
                      <span aria-hidden="true">↻</span>
                      <strong>GIRA TU CELULAR</strong>
                      <small>{isAirRace ? 'Air Race se juega mejor en horizontal.' : 'HunterFood se juega mejor en horizontal.'}</small>
                    </div>
                  </>
                ) : gameStarted ? (
                  <div className="project-overlay__player-toolbar">
                    <span>{project.name.toUpperCase()} · DEMO ACTIVA</span>
                    <button onClick={openDesktopFullscreen}>⛶ PANTALLA COMPLETA</button>
                    <button onClick={returnToProject}>VOLVER A LA VISTA PREVIA</button>
                  </div>
                ) : (
                  <button className="project-overlay__play" onClick={startGame}>{project.playLabel ?? '▶ JUGAR DEMO'}</button>
                )}
              </>
            ) : (
              <>
                <ProjectPreview project={project} />
                <a className="project-overlay__play" href={project.playUrl} target="_blank" rel="noreferrer">
                  {project.playLabel ?? '▶ JUGAR DEMO ↗'}
                </a>
              </>
            )}
          </div>
          <article className="project-overlay__copy" aria-hidden={mobileGameMode || undefined}>
            <ProjectTechnology project={project} />
            <h2>{project.name}</h2>
            <p className="project-overlay__description">{project.description}</p>
            <ProjectFacts project={project} className="project-overlay__facts" />
            {project.webglUrl && project.playUrl && (
              <a className="project-overlay__external" href={project.playUrl} target="_blank" rel="noreferrer">↗ {project.externalLabel ?? project.linkLabel ?? 'ABRIR PROYECTO'}</a>
            )}
            <button className="project-overlay__return" onClick={closeOverlay}>◀ VOLVER AL POKEFOLIO</button>
          </article>
          {project.webglUrl && (
            <div className="project-overlay__mobile-actions" aria-hidden={mobileGameMode || undefined}>
            {project.playUrl && <a className="project-overlay__external" href={project.playUrl} target="_blank" rel="noreferrer">↗ {project.externalLabel ?? project.linkLabel ?? 'ABRIR EN ITCH.IO'}</a>}
              <button className="project-overlay__return" onClick={closeOverlay}>◀ VOLVER AL POKEFOLIO</button>
            </div>
          )}
        </div>
      </section>
    </div>,
    document.body,
  )
}
