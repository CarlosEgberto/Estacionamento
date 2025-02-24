//Renderização do mapa de vagas e resumo.
// assets/Js/vagas/uiRenderer.js
import { loadVehicles } from './storage.js';

function atualizarMapaVagas() {
    const vehicles = loadVehicles();
    const vagasOcupadas = vehicles.filter(v => v.ativo).map(v => v.vaga);
    const totalVagas = 50;

    const mapa = Array.from({ length: totalVagas }, (_, i) => {
        const vagaNum = (i + 1).toString().padStart(2, '0');
        const ocupada = vagasOcupadas.includes(vagaNum);
        return `<div class="vaga ${ocupada ? 'ocupada' : 'livre'}">${vagaNum}</div>`;
    }).join('');

    document.getElementById('mapaVagas').innerHTML = mapa;

    atualizarResumoVagas(vagasOcupadas.length, totalVagas);
}

function atualizarResumoVagas(vagasOcupadas, totalVagas) {
    document.getElementById('vagasOcupadas').textContent = vagasOcupadas;
    document.getElementById('vagasLivres').textContent = totalVagas - vagasOcupadas;
    document.getElementById('vagasLivresHeader').textContent = totalVagas - vagasOcupadas;
}

export { atualizarMapaVagas };