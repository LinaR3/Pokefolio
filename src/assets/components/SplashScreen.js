export function renderSplashScreen(container, duration = 1500) {
  const splashHTML = `
    <div class="splash-screen" id="splash">
      <div class="splash-top">
        <span>PORTFOLIO / 2026</span>
        <span>GAME DEV & SOUND</span>
      </div>
      <div class="splash-center">
        <h1 class="splash-title">LINA<br>REINA</h1>
      </div>
      <div class="splash-bottom">
        <div class="splash-role">
          <span class="role-main">Game Developer</span>
          <span class="role-sub">Unity Game Programmer | C# | Sound Designer</span>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = splashHTML;

  const splashElement = document.getElementById('splash');

  // Ocultar banner después del tiempo especificado
  setTimeout(() => {
    if (splashElement) {
      splashElement.classList.add('fade-out');
    }
  }, duration);
}