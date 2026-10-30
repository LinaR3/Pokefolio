import { useEffect, useRef, useState } from 'react'

let spotifyApiPromise

function loadSpotifyIframeApi() {
  if (spotifyApiPromise) return spotifyApiPromise

  spotifyApiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://open.spotify.com/embed/iframe-api/v1'
    script.async = true
    script.onerror = () => {
      spotifyApiPromise = undefined
      reject(new Error('No se pudo cargar Spotify iFrame API'))
    }
    window.onSpotifyIframeApiReady = resolve
    document.body.appendChild(script)
  })

  return spotifyApiPromise
}

export default function SpotifyEmbed({ project, onPlaybackChange }) {
  const hostRef = useRef(null)
  const [apiFailed, setApiFailed] = useState(false)

  useEffect(() => {
    let disposed = false
    let controller

    loadSpotifyIframeApi()
      .then((iframeApi) => {
        if (disposed || !hostRef.current) return

        iframeApi.createController(hostRef.current, {
          url: project.embedUrl,
          width: '100%',
          height: String(project.embedHeight ?? 152),
        }, (embedController) => {
          if (disposed) {
            embedController.destroy()
            return
          }

          controller = embedController
          embedController.addListener('playback_started', () => onPlaybackChange(true))
          embedController.addListener('playback_update', (event) => {
            onPlaybackChange(!event.data.isPaused && !event.data.isBuffering)
          })
        })
      })
      .catch(() => {
        if (!disposed) setApiFailed(true)
      })

    return () => {
      disposed = true
      controller?.destroy()
    }
  }, [onPlaybackChange, project.embedHeight, project.embedUrl])

  return (
    <div className="spotify-embed-host" style={{ height: `${project.embedHeight ?? 152}px` }} aria-label={`Reproductor de Spotify: ${project.name}`}>
      <div ref={hostRef} />
      {apiFailed && (
        <iframe
          className="spotify-embed"
          src={project.embedUrl}
          title={`Reproductor de Spotify: ${project.name}`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          allowFullScreen
          style={project.embedHeight ? { height: `${project.embedHeight}px` } : undefined}
        />
      )}
    </div>
  )
}
