document.addEventListener('DOMContentLoaded', () => {
    calcularTotalArrecadado();
    carregarListaVeiculos();

    const pesquisaPlaca = document.getElementById('pesquisaPlaca');
    pesquisaPlaca.addEventListener('input', filtrarListaVeiculos);
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

document.addEventListener('DOMContentLoaded', () => {
    calcularTotalArrecadado();
    carregarListaVeiculos();

    const pesquisaPlaca = document.getElementById('pesquisaPlaca');
    pesquisaPlaca.addEventListener('input', filtrarListaVeiculos);
});

// ... (funções calcularTotalArrecadado, carregarListaVeiculos, filtrarListaVeiculos, ultimaEntrada)

function exibirHistorico(placa) {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const veiculoEncontrado = vehicles.find(v => v.placa === placa);

    const resultadoPesquisa = document.getElementById('resultadoPesquisa');
    resultadoPesquisa.innerHTML = '';

    if (veiculoEncontrado) {
        const detalhesVeiculo = document.createElement('div');
        detalhesVeiculo.innerHTML = `<h3>${veiculoEncontrado.modelo}</h3><p>Placa: ${veiculoEncontrado.placa}</p><p>Cor: ${veiculoEncontrado.cor}</p><p>Vaga: ${veiculoEncontrado.vaga}</p>`;
        resultadoPesquisa.appendChild(detalhesVeiculo);

        if (veiculoEncontrado.historico && veiculoEncontrado.historico.length > 0) {
            const tabelaHistorico = document.createElement('table');
            tabelaHistorico.innerHTML = `
                <thead id="tabela-pesquisa">
                    <tr>
                        <th>Data</th>
                        <th>Entrada</th>
                        <th>Saída</th>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            resultadoPesquisa.appendChild(tabelaHistorico);

            const tbody = tabelaHistorico.querySelector('tbody');
            veiculoEncontrado.historico.forEach(registro => {
                const linha = tbody.insertRow();
                linha.innerHTML = `
                    <td>${registro.data || new Date(registro.entradaTimestamp).toLocaleDateString('pt-BR')}</td>
                    <td>${registro.entrada}</td>
                    <td>${registro.saida || '-'}</td>
                    <td>${registro.valor ? `R$ ${registro.valor.toFixed(2)}` : '-'}</td>
                    <td><button data-entrada="${registro.entrada}" onclick="excluirRegistro('${placa}', this.dataset.entrada)">Excluir</button></td>
                `;
            });
        }
    }
}
const botaoApagarRegistro = document.getElementById('botaoApagarRegistro')

function apagarTudo() {
    localStorage.removeItem('vehicles');
    localStorage.removeItem('idCounter');
    carregarListaVeiculos()
}

// Adiciona os eventos de clique aos botões.
botaoApagarRegistro.addEventListener('click', apagarTudo);


function excluirRegistro(placa, entrada) {
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const veiculo = vehicles.find(v => v.placa === placa);

    if (veiculo && veiculo.historico) {
        veiculo.historico = veiculo.historico.filter(r => r.entrada !== entrada);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        exibirHistorico(placa);
        calcularTotalArrecadado();
        carregarListaVeiculos(); // Atualiza a lista de veículos
    }
    carregarListaVeiculos()
}