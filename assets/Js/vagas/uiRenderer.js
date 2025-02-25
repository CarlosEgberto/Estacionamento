import { loadVehicles } from './storage.js';

function atualizarMapaVagas() {
    const vehicles = loadVehicles();
    const vagasOcupadas = vehicles.filter(v => v.ativo).map(v => ({ vaga: v.vaga, isMensalista: v.isMensalista }));
    const totalVagas = 50;

    const mapa = Array.from({ length: totalVagas }, (_, i) => {
        const vagaNum = (i + 1).toString().padStart(2, '0');
        const vagaInfo = vagasOcupadas.find(v => v.vaga === vagaNum);
        const ocupada = vagaInfo !== undefined;
        const texto = ocupada && vagaInfo.isMensalista ? 'Mensalista' : vagaNum;

        return `<div class="vaga ${ocupada ? 'ocupada' : 'livre'}">${texto}</div>`;
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