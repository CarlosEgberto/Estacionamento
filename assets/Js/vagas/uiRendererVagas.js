import { loadVehicles } from '../index/storageIndex.js';

async function atualizarMapaVagas() {
    console.log('Atualizando mapa de vagas...');
    const vehicles = await loadVehicles();
    const vagasOcupadas = vehicles.filter(v => v.ativo).map(v => ({ vaga: v.vaga, isMensalista: v.isMensalista }));
    const totalVagas = 50;

    const mapa = Array.from({ length: totalVagas }, (_, i) => {
        const vagaNum = (i + 1).toString().padStart(2, '0');
        const vagaInfo = vagasOcupadas.find(v => v.vaga === vagaNum);
        const ocupada = vagaInfo !== undefined;
        const texto = ocupada && vagaInfo.isMensalista ? 'Mensalista' : vagaNum;

        return `<div class="vaga ${ocupada ? 'ocupada' : 'livre'}">${texto}</div>`;
    }).join('');

    const mapaVagas = document.getElementById('mapaVagas');
    if (!mapaVagas) {
        console.error('Elemento mapaVagas não encontrado');
        return;
    }
    mapaVagas.innerHTML = mapa;

    atualizarResumoVagas(vagasOcupadas.length, totalVagas);
    console.log('Mapa de vagas atualizado com', vagasOcupadas.length, 'vagas ocupadas');
}

function atualizarResumoVagas(vagasOcupadas, totalVagas) {
    const vagasOcupadasEl = document.getElementById('vagasOcupadas');
    const vagasLivresEl = document.getElementById('vagasLivres');
    const vagasLivresHeaderEl = document.getElementById('vagasLivresHeader');

    if (vagasOcupadasEl && vagasLivresEl && vagasLivresHeaderEl) {
        vagasOcupadasEl.textContent = vagasOcupadas;
        vagasLivresEl.textContent = totalVagas - vagasOcupadas;
        vagasLivresHeaderEl.textContent = totalVagas - vagasOcupadas;
        console.log('Resumo de vagas atualizado:', { ocupadas: vagasOcupadas, livres: totalVagas - vagasOcupadas });
    } else {
        console.error('Um ou mais elementos do resumo de vagas não encontrados');
    }
}

export { atualizarMapaVagas };