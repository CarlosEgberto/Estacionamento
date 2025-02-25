import { atualizarMapaVagas } from './uiRenderer.js';
import { updateTime, toggleDarkMode, checkDarkMode } from './utils.js';

function init() {
    atualizarMapaVagas();
    updateTime();

    document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
    checkDarkMode();
}

document.addEventListener('DOMContentLoaded', init);