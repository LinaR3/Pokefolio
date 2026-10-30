# Pokefolio — Lina Reina

Portafolio interactivo de Lina Reina, Game Developer, programadora en C# y Python, y productora musical. La interfaz toma como referencia una Game Boy y una Pokédex: conserva una navegación lúdica mientras presenta proyectos, audio y formas de contacto.

## Funcionalidades

- Pantalla de bienvenida y consola responsiva con estética Game Boy.
- Secciones de proyectos, Audio / SFX y contacto.
- Fichas de proyectos que se amplían sobre la consola y enlazan a sus demos.
- Reproductores y enlaces externos para las publicaciones de Spotify; el ecualizador refleja el estado real de reproducción reportado por Spotify.
- Controles de consola, navegación por teclado y cursor temático de Poké Ball en dispositivos con puntero.
- Microanimaciones para la selección, los controles y el encendido de pantalla. Respetan la preferencia del sistema por reducir movimiento.

## Tecnologías

- React 19
- Vite 8
- JavaScript con módulos ES
- CSS con Grid, Flexbox y propiedades personalizadas
- Google Fonts: Inter, Press Start 2P, VT323 y JetBrains Mono

## Requisitos

- Node.js compatible con Vite 8
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

Vite mostrará la URL local en la terminal.

## Comandos disponibles

```bash
npm run dev      # inicia el servidor de desarrollo
npm run build    # genera la versión de producción en dist/
npm run preview  # sirve localmente la versión compilada
npm run lint     # revisa el código con oxlint
```

## Controles

- **Flechas izquierda / derecha:** cambiar de sección.
- **Flechas arriba / abajo:** recorrer fichas y proyectos.
- **K o botón A:** iniciar, abrir o activar la selección actual.
- **B o Escape:** volver al inicio; Escape también cierra una ficha ampliada.
- También puedes seleccionar una sección o una ficha con el puntero.

## Estructura del proyecto

```text
public/
  images/                 # retratos y recursos visuales
  pokeball-cursor.svg     # cursor personalizado
src/
  components/             # consola, pantallas, fichas y overlay
  data/portfolio.js       # proyectos, música y enlaces de contacto
  App.css                 # estilos y animaciones
  index.css               # estilos globales y cursor
  main.jsx                # entrada de React
index.html
```

Para actualizar proyectos, enlaces, roles o descripciones, edita `src/data/portfolio.js`. Las imágenes locales se guardan en `public/images/` y se referencian desde la raíz con `/images/nombre-del-archivo`.

## Publicación

El proyecto puede desplegarse en Vercel como aplicación Vite. La compilación de producción se genera con `npm run build`.
