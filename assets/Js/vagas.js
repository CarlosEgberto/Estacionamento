document.addEventListener('DOMContentLoaded', () => {
    atualizarMapaVagas();
    updateTime();

    // Dark Mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', toggleDarkMode);
    checkDarkMode();
});

function atualizarMapaVagas() {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vagasOcupadas = vehicles.filter(v => v.ativo).map(v => v.vaga);
    const totalVagas = 50; // Total de vagas disponíveis

    const mapa = Array.from({ length: totalVagas }, (_, i) => {
        const vagaNum = (i + 1).toString().padStart(2, '0');
        const ocupada = vagasOcupadas.includes(vagaNum);

        return `<div class="vaga ${ocupada ? 'ocupada' : 'livre'}">${vagaNum}</div>`;
    }).join('');

    document.getElementById('mapaVagas').innerHTML = mapa;

    // Atualizar resumo de vagas
    atualizarResumoVagas(vagasOcupadas.length, totalVagas);
}

function atualizarResumoVagas(vagasOcupadas, totalVagas) {
    document.getElementById('vagasOcupadas').textContent = vagasOcupadas;
    document.getElementById('vagasLivres').textContent = totalVagas - vagasOcupadas;
    document.getElementById('vagasLivresHeader').textContent = totalVagas - vagasOcupadas;
}

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function checkDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    document.getElementById('darkModeToggle').checked = darkMode;
}

// Atualizar horário atual
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('currentTime').textContent = timeString;
    setTimeout(updateTime, 1000);
}