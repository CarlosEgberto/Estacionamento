// script.js
let selectedVehicle = null;
let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
let idCounter = parseInt(localStorage.getItem('idCounter')) || 1000;
const totalVagas = 50; // Total de vagas disponíveis no estacionamento

// Função para gerar ID único de 4 dígitos
function gerarID() {
    idCounter++;
    if (idCounter > 9999) idCounter = 1000;
    localStorage.setItem('idCounter', idCounter);
    return idCounter.toString().padStart(4, '0');
}

// Função principal para adicionar veículos
function adicionarCarro() {
    const modelo = document.getElementById('modelo').value;
    const placa = document.getElementById('placa').value.toUpperCase().replace(/-/g, '');
    const cor = document.getElementById('cor').value;
    const vaga = document.getElementById('vaga').value;

    // Validação dos campos
    if (!modelo || !placa || !cor || !vaga) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    // Verificar se a vaga já está ocupada
    if (vehicles.some(v => v.vaga === vaga && v.ativo)) {
        alert('Vaga já ocupada! Escolha outra vaga.');
        return;
    }

    // Criar novo veículo
    const novoID = gerarID();
    const horaEntrada = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const newVehicle = {
        id: novoID,
        modelo,
        placa: formatarPlaca(placa),
        cor,
        vaga,
        horaEntrada,
        entradaTimestamp: new Date().getTime(),
        ativo: true,
        historico: [{
            entrada: horaEntrada,
            saida: null,
            valor: null
        }]
    };

    vehicles.push(newVehicle);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    renderVeiculos();
    limparFormulario();
    mostrarComprovante(newVehicle);
}

// Formatar placa automática
function formatarPlaca(placa) {
    const placaFormatada = placa.replace(/([A-Za-z]{3})([0-9]{1})([A-Za-z0-9]{3})/, '$1$2-$3');
    return placaFormatada.slice(0, 8);
}

// Limpar formulário após cadastro
function limparFormulario() {
    document.getElementById('modelo').value = '';
    document.getElementById('placa').value = '';
    document.getElementById('cor').value = '';
    document.getElementById('vaga').value = '';
}

// Exibir comprovante
function mostrarComprovante(veiculo) {
    // Atualizar informações
    document.getElementById('compId').textContent = veiculo.id;
    document.getElementById('compPlaca').textContent = veiculo.placa;
    document.getElementById('compModelo').textContent = veiculo.modelo;
    document.getElementById('compEntrada').textContent = veiculo.horaEntrada;

    // Gerar código de barras
    JsBarcode("#barcode", veiculo.id, {
        format: "CODE128",
        displayValue: true,
        fontSize: 16,
        height: 50,
        width: 2
    });

    // Exibir modal
    document.getElementById('comprovanteContainer').style.display = 'block';
}

// Fechar comprovante
function fecharComprovante() {
    document.getElementById('comprovanteContainer').style.display = 'none';
    JsBarcode("#barcode").init(); // Resetar código
}

// Imprimir comprovante
function imprimirComprovante() {
    window.print();
}

// Renderizar lista de veículos
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
                <div class="vehicle-entrada">Entrada: ${vehicle.horaEntrada}</div>
            </div>
            <button class="btn-selecionar" onclick="selecionarVeiculo('${vehicle.id}')">
                ${selectedVehicle?.id === vehicle.id ? '✓ Selecionado' : 'Selecionar'}
            </button>
            <button class="btn-editar" onclick="editarVaga('${vehicle.id}')">Editar Vaga</button>
        `;
        container.appendChild(card);
    });

    // Atualizar contador de vagas
    atualizarContadorVagas();
}

// Selecionar veículo para saída
function selecionarVeiculo(id) {
    selectedVehicle = vehicles.find(v => v.id === id);
    document.getElementById('selectedVehicle').textContent =
        `Veículo selecionado: ID ${selectedVehicle.id} (${selectedVehicle.placa})`;
    renderVeiculos();
}

// Editar vaga do veículo
function editarVaga(id) {
    const veiculo = vehicles.find(v => v.id === id);
    const novaVaga = prompt('Digite a nova vaga:', veiculo.vaga);

    if (novaVaga && !vehicles.some(v => v.vaga === novaVaga && v.ativo)) {
        veiculo.vaga = novaVaga;
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        renderVeiculos();
    } else {
        alert('Vaga já ocupada ou inválida!');
    }
}

// Registrar saída do veículo
function registrarSaida() {
    if (!selectedVehicle) {
        alert('Selecione um veículo primeiro!');
        return;
    }

    const tempo = calcularTempo(selectedVehicle.entradaTimestamp);
    const valor = calcularValor(tempo.horas, tempo.minutos);

    const confirmar = confirm(
        `CONFIRMAR SAÍDA:\n\n` +
        `ID: ${selectedVehicle.id}\n` +
        `Placa: ${selectedVehicle.placa}\n` +
        `Tempo: ${tempo.horas}h ${tempo.minutos}m\n` +
        `Valor: R$ ${valor.toFixed(2)}\n\n` +
        'Clique em OK para confirmar'
    );

    if (confirmar) {
        // Atualizar histórico
        const veiculo = vehicles.find(v => v.id === selectedVehicle.id);
        veiculo.historico[veiculo.historico.length - 1].saida = new Date().toLocaleTimeString('pt-BR');
        veiculo.historico[veiculo.historico.length - 1].valor = valor;
        veiculo.ativo = false;

        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        selectedVehicle = null;
        document.getElementById('selectedVehicle').textContent = 'Nenhum veículo selecionado';
        renderVeiculos();
        alert('Saída registrada com sucesso!');
    }
}

// Cálculo de tempo estacionado
function calcularTempo(entradaTimestamp) {
    const saidaTimestamp = new Date().getTime();
    const diff = saidaTimestamp - entradaTimestamp;

    return {
        horas: Math.floor(diff / 3600000),
        minutos: Math.floor((diff % 3600000) / 60000)
    };
}

// Cálculo de valor (R$ 10/hora + taxa mínima)
function calcularValor(horas, minutos) {
    const taxaMinima = 15.00;
    const valorHora = 10.00;

    if (horas === 0 && minutos < 15) return taxaMinima;
    return Math.max(taxaMinima, (horas * valorHora) + (minutos > 0 ? valorHora : 0));
}

// Atualizar contador de vagas
function atualizarContadorVagas() {
    const vagasOcupadas = vehicles.filter(v => v.ativo).length;
    document.getElementById('vagasOcupadas').textContent = `Vagas ocupadas: ${vagasOcupadas}`;
    document.getElementById('vagasLivres').textContent = `Vagas livres: ${totalVagas - vagasOcupadas}`;
}

// Inicialização
window.onload = () => {
    renderVeiculos();
    if (!localStorage.getItem('idCounter')) {
        localStorage.setItem('idCounter', '1000');
    }
};