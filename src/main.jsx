import { renderSplashScreen } from './components/SplashScreen.js';
import { renderPokedexShell } from './components/PokedexShell.js';

document.addEventListener('DOMContentLoaded', () => {
  const splashRoot = document.getElementById('splash-root');
  const appRoot = document.getElementById('app');

  // Renderizar Splash Screen con duración de 1.5 segundos
  renderSplashScreen(splashRoot, 1500);

  // Renderizar el Pokéfolio
  renderPokedexShell(appRoot);
});