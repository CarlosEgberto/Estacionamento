//Gerenciamento de veículos (CRUD, lógica de vagas, etc.).

// vehicleManager.js
import { saveVehicles, loadVehicles, saveIdCounter, loadIdCounter } from './storage.js';
import { formatarPlaca, calcularTempo, calcularValor } from './utils.js';

let selectedVehicle = null;
let vehicles = loadVehicles() || [];
let idCounter = loadIdCounter() || 1000;
const totalVagas = 50;

function gerarID() {
    idCounter++;
    if (idCounter > 9999) idCounter = 1000;
    saveIdCounter(idCounter);
    return idCounter.toString().padStart(4, '0');
}

function adicionarCarro(modelo, placa, cor, vaga) {
    if (!modelo || !placa || !cor || !vaga) {
        alert('Preencha todos os campos obrigatórios!');
        return null;
    }

    if (vehicles.some(v => v.vaga === vaga && v.ativo)) {
        alert('Vaga já ocupada! Escolha outra vaga.');
        return null;
    }

    if (vaga > 50 || vaga <= 0) {
        alert('Vaga inválida [min:01 e max:50]');
        return null;
    }

    const novoID = gerarID();
    const horaEntrada = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newVehicle = {
        id: novoID,
        modelo: modelo.toUpperCase(),
        placa: formatarPlaca(placa.toUpperCase().replace(/-/g, '')),
        cor: cor.toUpperCase(),
        vaga: vaga.padStart(2, '0'),
        horaEntrada,
        entradaTimestamp: new Date().getTime(),
        ativo: true,
        historico: [{ entrada: horaEntrada, saida: null, valor: null }]
    };

    vehicles.push(newVehicle);
    saveVehicles(vehicles);
    return newVehicle;
}

function selecionarVeiculo(id) {
    selectedVehicle = vehicles.find(v => v.id === id);
    return selectedVehicle;
}

function editarVaga(id, novaVaga) {
    const veiculo = vehicles.find(v => v.id === id);
    if (novaVaga && !vehicles.some(v => v.vaga === novaVaga && v.ativo)) {
        veiculo.vaga = novaVaga;
        saveVehicles(vehicles);
        return true;
    }
    alert('Vaga já ocupada ou inválida!');
    return false;
}

function registrarSaida() {
    if (!selectedVehicle) {
        alert('Selecione um veículo primeiro!');
        return false;
    }

    const tempo = calcularTempo(selectedVehicle.entradaTimestamp);
    const valor = calcularValor(tempo.horas, tempo.minutos);

    const confirmar = confirm(
        `CONFIRMAR SAÍDA:\n\nID: ${selectedVehicle.id}\nPlaca: ${selectedVehicle.placa}\nTempo: ${tempo.horas}h ${tempo.minutos}m\nValor: R$ ${valor.toFixed(2)}\n\nClique em OK para confirmar`
    );

    if (confirmar) {
        const veiculo = vehicles.find(v => v.id === selectedVehicle.id);
        veiculo.historico[veiculo.historico.length - 1].saida = new Date().toLocaleTimeString('pt-BR');
        veiculo.historico[veiculo.historico.length - 1].valor = valor;
        veiculo.ativo = false;
        saveVehicles(vehicles);
        selectedVehicle = null;
        return true;
    }
    return false;
}

export { adicionarCarro, selecionarVeiculo, editarVaga, registrarSaida, vehicles, totalVagas, selectedVehicle };