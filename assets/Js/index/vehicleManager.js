import { saveVehicles, loadVehicles, saveIdCounter, loadIdCounter } from './storage.js';
import { formatarPlaca, calcularTempo, calcularValor } from './utils.js';

let selectedVehicle = null;
let vehicles = loadVehicles() || [];
let idCounter = loadIdCounter() || 1000;
const totalVagas = 50;
const UM_MES = 1000 * 60 * 60 * 24 * 30; // 30 dias

function gerarID() {
    idCounter++;
    if (idCounter > 9999) idCounter = 1000;
    saveIdCounter(idCounter);
    return idCounter.toString().padStart(4, '0');
}

function adicionarCarro(modelo, placa, cor, vaga, isMensalista = false, precoMensal = 0) {
    if (!modelo || !placa || !cor || !vaga) {
        alert('Preencha todos os campos obrigatórios!');
        return null;
    }

    vaga = vaga.toString().padStart(2, '0');

    if (vehicles.some(v => v.vaga === vaga && v.ativo)) {
        alert('Vaga já ocupada! Escolha outra vaga.');
        return null;
    }

    if (parseInt(vaga) > totalVagas || parseInt(vaga) <= 0) {
        alert('Vaga inválida [min:01 e max:50]');
        return null;
    }

    if (!isMensalista && vehicles.some(v => v.isMensalista && v.ativo && v.vaga === vaga)) {
        alert('Esta vaga está reservada para um mensalista!');
        return null;
    }

    const novoID = gerarID();
    const dataHoraEntrada = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const newVehicle = {
        id: novoID,
        modelo: modelo.toUpperCase(),
        placa: formatarPlaca(placa.toUpperCase().replace(/-/g, '')),
        cor: cor.toUpperCase(),
        vaga,
        horaEntrada: dataHoraEntrada, // Agora inclui data e hora
        entradaTimestamp: new Date().getTime(),
        ativo: true,
        isMensalista,
        precoMensal: isMensalista ? parseFloat(precoMensal) || 0 : 0,
        dataInicioMensalista: isMensalista ? new Date().getTime() : null,
        historico: [{
            entrada: dataHoraEntrada,
            saida: null,
            valor: isMensalista ? parseFloat(precoMensal) || 0 : null
        }]
    };

    vehicles.push(newVehicle);
    saveVehicles(vehicles);
    return newVehicle;
}

function verificarMensalistas() {
    const agora = new Date().getTime();
    vehicles.forEach(veiculo => {
        if (veiculo.isMensalista && veiculo.ativo && veiculo.dataInicioMensalista) {
            const tempoDecorrido = agora - veiculo.dataInicioMensalista;
            if (tempoDecorrido >= UM_MES) {
                alert(`Aviso: O mensalista ${veiculo.placa} (${veiculo.modelo}) na vaga ${veiculo.vaga} completou 1 mês. Nova cobrança será iniciada.`);
                veiculo.dataInicioMensalista = agora;
                saveVehicles(vehicles);
            }
        }
    });
}

function selecionarVeiculo(id) {
    selectedVehicle = vehicles.find(v => v.id === id);
    return selectedVehicle;
}

function editarVaga(id, novaVaga) {
    const veiculo = vehicles.find(v => v.id === id);
    novaVaga = novaVaga.toString().padStart(2, '0');

    if (novaVaga && !vehicles.some(v => v.vaga === novaVaga && v.ativo && v.id !== id)) {
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

    const veiculo = vehicles.find(v => v.id === selectedVehicle.id);
    const dataHoraSaida = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    if (veiculo.isMensalista) {
        const confirmar = confirm(
            `CONFIRMAR SAÍDA:\n\nID: ${veiculo.id}\nPlaca: ${veiculo.placa}\nMensalista - Valor Fixo: R$ ${veiculo.precoMensal.toFixed(2)}\n\nClique em OK para confirmar`
        );

        if (confirmar) {
            veiculo.historico[veiculo.historico.length - 1].saida = dataHoraSaida; // Inclui data
            veiculo.historico[veiculo.historico.length - 1].valor = veiculo.precoMensal;
            veiculo.ativo = false;
            saveVehicles(vehicles);
            selectedVehicle = null;
            return true;
        }
        return false;
    }

    const tempo = calcularTempo(selectedVehicle.entradaTimestamp);
    const valor = calcularValor(tempo.dias, tempo.horas, tempo.minutos);

    const confirmar = confirm(
        `CONFIRMAR SAÍDA:\n\nID: ${veiculo.id}\nPlaca: ${veiculo.placa}\nTempo: ${tempo.dias}d ${tempo.horas}h ${tempo.minutos}m\nValor: R$ ${valor.toFixed(2)}\n\nClique em OK para confirmar`
    );

    if (confirmar) {
        veiculo.historico[veiculo.historico.length - 1].saida = dataHoraSaida; // Inclui data
        veiculo.historico[veiculo.historico.length - 1].valor = valor;
        veiculo.ativo = false;
        saveVehicles(vehicles);
        selectedVehicle = null;
        return true;
    }
    return false;
}

export { adicionarCarro, selecionarVeiculo, editarVaga, registrarSaida, verificarMensalistas, vehicles, totalVagas, selectedVehicle };