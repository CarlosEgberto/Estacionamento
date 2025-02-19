document.addEventListener('DOMContentLoaded', () => {
    atualizarMapaVagas();
});

function atualizarMapaVagas() {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vagasOcupadas = vehicles.filter(v => v.ativo).map(v => v.vaga);
    const totalVagas = 50; // Altere para o total real de vagas
    
    const mapa = Array.from({length: totalVagas}, (_, i) => {
        const vagaNum = (i + 1).toString().padStart(2, '0');
        const ocupada = vagasOcupadas.includes(vagaNum);
        
        return `<div class="vaga ${ocupada ? 'ocupada' : 'livre'}">${vagaNum}</div>`;
    }).join('');
    
    document.getElementById('mapaVagas').innerHTML = mapa;
}