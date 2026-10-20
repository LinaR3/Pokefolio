import { useEffect, useState } from 'react'

export default function SplashScreen({ duration = 1500 }) {
  const [isExiting, setIsExiting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setIsExiting(true), duration)
    const removeTimer = window.setTimeout(() => setIsVisible(false), duration + 800)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(removeTimer)
    }
  }, [duration])

  if (!isVisible) return null

  return (
    <div className={`splash-screen${isExiting ? ' fade-out' : ''}`} aria-label="Bienvenida al Pokefolio de Lina Reina">
      <div className="splash-top">
        <span>PORTFOLIO / 2026</span>
        <span>GAME DEV &amp; SOUND</span>
      </div>
      <div className="splash-center">
        <p className="splash-eyebrow">POKEFOLIO · LINA REINA</p>
        <h1 className="splash-title">LINA REINA</h1>
      </div>
      <div className="splash-bottom">
        <div className="splash-role">
          <span className="role-main">Game Developer</span>
          <span className="role-sub">Unity Game Programmer | C# | Sound Designer</span>
        </div>
        <span className="splash-index">PRESS START <b>↗</b></span>
      </div>
    </div>
  )
}
