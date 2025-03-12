import { vehicles, selectedVehicle, totalVagas } from './vehicleManagerIndex.js';

function renderVeiculos() {
    const container = document.getElementById('veiculosList');
    container.innerHTML = '';

    vehicles.filter(v => v.ativo).forEach(vehicle => {
        const card = document.createElement('div');
        card.className = `vehicle-card ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="vehicle-info">
                <div class="vehicle-id">ID ${vehicle.id}</div>
                <div class="vehicle-modelo">${vehicle.modelo}</div>
                <div class="vehicle-placa">${vehicle.placa}</div>
                <div class="vehicle-vaga">Vaga: ${vehicle.vaga}</div>
                <div class="vehicle-entrada">Entrada: ${vehicle.hora_entrada}</div>
            </div>
            <div id="button-500px">
                <button class="btn-selecionar" onclick="selecionarVeiculo('${vehicle.id}')">
                    ${selectedVehicle?.id === vehicle.id ? '✓ Selecionado' : 'Selecionar'}
                </button>
                <button class="btn-editar" onclick="editarVaga('${vehicle.id}')">Editar Vaga</button>
            </div>
        `;
        container.appendChild(card);
    });

    atualizarContadorVagas();
}

function mostrarComprovante(veiculo) {
    document.getElementById('compId').textContent = veiculo.id;
    document.getElementById('compPlaca').textContent = veiculo.placa;
    document.getElementById('compModelo').textContent = veiculo.modelo;
    document.getElementById('compEntrada').textContent = veiculo.hora_entrada;

    JsBarcode("#barcode", veiculo.id, {
        format: "CODE128",
        displayValue: true,
        fontSize: 16,
        height: 50,
        width: 2
    });

    document.getElementById('comprovanteContainer').style.display = 'block';
}

function fecharComprovante() {
    document.getElementById('comprovanteContainer').style.display = 'none';
    JsBarcode("#barcode").init();
}

function atualizarContadorVagas() {
    const vagasOcupadas = vehicles.filter(v => v.ativo).length;
    document.getElementById('vagasOcupadas').textContent = vagasOcupadas;
    document.getElementById('vagasLivres').textContent = totalVagas - vagasOcupadas;
    document.getElementById('vagasLivresHeader').textContent = totalVagas - vagasOcupadas;
}

function updateSelectedVehicleUI() {
    document.getElementById('selectedVehicle').textContent = selectedVehicle
        ? `Veículo selecionado: ID ${selectedVehicle.id} (${selectedVehicle.placa})`
        : 'Nenhum veículo selecionado';
}

export { renderVeiculos, mostrarComprovante, fecharComprovante, updateSelectedVehicleUI };