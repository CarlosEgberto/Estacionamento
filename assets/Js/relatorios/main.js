import { loadVehicles, clearStorage } from './storage.js';
import { renderListaVeiculos, filtrarListaVeiculos } from './uiRenderer.js';
import { calcularTotalArrecadado, updateTime, toggleDarkMode, checkDarkMode } from './utils.js';

function init() {
    calcularTotalArrecadado();
    renderListaVeiculos();
    updateTime();

    document.getElementById('pesquisaPlaca').addEventListener('input', filtrarListaVeiculos);
    document.getElementById('botaoApagarRegistro').addEventListener('click', () => {
        clearStorage();
        renderListaVeiculos();
        calcularTotalArrecadado();
    });
    document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);

    checkDarkMode();
}

document.addEventListener('DOMContentLoaded', init);