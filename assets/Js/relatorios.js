document.addEventListener('DOMContentLoaded', () => {
    calcularTotalArrecadado();
    carregarListaVeiculos();

    const pesquisaPlaca = document.getElementById('pesquisaPlaca');
    pesquisaPlaca.addEventListener('input', filtrarListaVeiculos);

    const botaoApagarRegistro = document.getElementById('botaoApagarRegistro');
    botaoApagarRegistro.addEventListener('click', apagarTudo);
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
}

function excluirRegistro(placa, entrada) {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const veiculo = vehicles.find(v => v.placa === placa);

    if (veiculo && veiculo.historico) {
        veiculo.historico = veiculo.historico.filter(r => r.entrada !== entrada);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        calcularTotalArrecadado();
        carregarListaVeiculos();
    }
}