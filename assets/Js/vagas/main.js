// assets/Js/vagas/main.js Coordenação geral e eventos.
import { atualizarMapaVagas } from './uiRenderer.js';
import { updateTime, toggleDarkMode, checkDarkMode } from './utils.js';

function init() {
    atualizarMapaVagas();
    updateTime();

    // Evento do Dark Mode
    document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
    checkDarkMode();
}

document.addEventListener('DOMContentLoaded', init);