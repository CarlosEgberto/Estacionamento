document.addEventListener('DOMContentLoaded', () => {
    atualizarMapaVagas();

    // Adicione os ouvintes de eventos para os botões de adicionar e registrar saída
    const btnAdicionar = document.querySelector('.btn-salvar'); // Seletor do botão "Salvar"
    const btnRegistrarSaida = document.querySelector('.btn-finalizar'); // Seletor do botão "Finalizar"

    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => {
            atualizarMapaVagas();
        });
    }

    if (btnRegistrarSaida) {
        btnRegistrarSaida.addEventListener('click', () => {
            atualizarMapaVagas();
        });
    }
});

function atualizarMapaVagas() {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vagasOcupadas = vehicles.filter(v => v.ativo).map(v => v.vaga);
    const totalVagas = 50; // Altere para o total real de vagas

    const mapa = Array.from({ length: totalVagas }, (_, i) => {
        const vagaNum = (i + 1).toString().padStart(2, '0');
        const ocupada = vagasOcupadas.includes(vagaNum);

        return `<div class="vaga ${ocupada ? 'ocupada' : 'livre'}">${vagaNum}</div>`;
    }).join('');

    document.getElementById('mapaVagas').innerHTML = mapa;

    // Atualizar também o resumo de vagas
    atualizarResumoVagas(vagasOcupadas.length, totalVagas);
}

function atualizarResumoVagas(vagasOcupadas, totalVagas) {
    document.getElementById('vagasOcupadas').textContent = vagasOcupadas;
    document.getElementById('vagasLivres').textContent = totalVagas - vagasOcupadas;
}