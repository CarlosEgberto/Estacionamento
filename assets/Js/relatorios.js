document.addEventListener('DOMContentLoaded', () => {
    calcularTotalArrecadado();
    carregarListaVeiculos();
    updateTime();

    const pesquisaPlaca = document.getElementById('pesquisaPlaca');
    pesquisaPlaca.addEventListener('input', filtrarListaVeiculos);

    const botaoApagarRegistro = document.getElementById('botaoApagarRegistro');
    botaoApagarRegistro.addEventListener('click', apagarTudo);

    // Dark Mode
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', toggleDarkMode);
    checkDarkMode();
});

function calcularTotalArrecadado() {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    let total = 0;

    vehicles.forEach(vehicle => {
        if (vehicle.historico && vehicle.historico.length > 0) {
            vehicle.historico.forEach(registro => {
                if (registro.valor) {
                    total += registro.valor;
                }
            });
        }
    });

    document.getElementById('totalMes').textContent = `R$ ${total.toFixed(2)}`;
}

function carregarListaVeiculos() {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const listaVeiculos = document.getElementById('listaVeiculos');
    listaVeiculos.innerHTML = '';

    vehicles.forEach(vehicle => {
        const veiculoDiv = document.createElement('div');
        veiculoDiv.classList.add('veiculo-item');
        veiculoDiv.dataset.placa = vehicle.placa;
        veiculoDiv.innerHTML = `
            <h3>${vehicle.modelo}</h3>
            <p>Placa: ${vehicle.placa}</p>
            <p>Cor: ${vehicle.cor}</p>
            <p>Última entrada: ${ultimaEntrada(vehicle)}</p>
        `;
        listaVeiculos.appendChild(veiculoDiv);
    });
}

function filtrarListaVeiculos() {
    const pesquisaPlaca = document.getElementById('pesquisaPlaca');
    const filtro = pesquisaPlaca.value.toUpperCase();
    const listaVeiculos = document.getElementById('listaVeiculos');
    const veiculosItens = listaVeiculos.querySelectorAll('.veiculo-item');

    veiculosItens.forEach(item => {
        const placa = item.dataset.placa.toUpperCase();
        if (placa.includes(filtro)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function ultimaEntrada(vehicle) {
    if (vehicle.historico && vehicle.historico.length > 0) {
        const ultimoRegistro = vehicle.historico[vehicle.historico.length - 1];
        return ultimoRegistro.entrada;
    }
    return '-';
}

function apagarTudo() {
    localStorage.removeItem('vehicles');
    localStorage.removeItem('idCounter');
    carregarListaVeiculos();
    calcularTotalArrecadado();
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