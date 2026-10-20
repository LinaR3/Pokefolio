export function renderPokedexShell(container) {
  container.innerHTML = `
    <div class="shell" style="padding: 40px; text-align: center; color: white;">
      <h2 style="font-family: 'Press Start 2P', monospace; font-size: 16px; color: #60a5fa; margin-bottom: 16px;">
        🎮 POKÉFOLIO DE LINA
      </h2>
      <p style="color: #9ca3af; max-width: 480px; margin: 0 auto 20px; line-height: 1.6;">
        Aquí irá la estructura principal de la GameBoy con los proyectos (#001, #002...), tu perfil y tus muestras de audio.
      </p>
    </div>
  `;
}