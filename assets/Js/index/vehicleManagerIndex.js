import { saveVehicles, loadVehicles, saveIdCounter, loadIdCounter } from '../index/storageIndex.js';
import { formatarPlaca, calcularTempo, calcularValor } from './utilsIndex.js';

let selectedVehicle = null;
let vehicles = [];
let idCounter = 1000;
const totalVagas = 50;
const UM_MES = 1000 * 60 * 60 * 24 * 30;

async function initialize() {
    vehicles = await loadVehicles();
    idCounter = await loadIdCounter();
}

async function gerarID() {
    idCounter++;
    if (idCounter > 9999) idCounter = 1000;
    await saveIdCounter(idCounter);
    return idCounter.toString().padStart(4, '0');
}

async function adicionarCarro(modelo, placa, cor, vaga, isMensalista = false, precoMensal = 0) {
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

    if (!isMensalista && vehicles.some(v => v.is_mensalista && v.ativo && v.vaga === vaga)) {
        alert('Esta vaga está reservada para um mensalista!');
        return null;
    }

    const novoID = await gerarID();
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
        hora_entrada: dataHoraEntrada,
        entrada_timestamp: new Date().getTime(),
        ativo: true,
        is_mensalista: isMensalista,
        preco_mensal: isMensalista ? parseFloat(precoMensal) || 0 : 0,
        data_inicio_mensalista: isMensalista ? new Date().getTime() : null,
        historico: [{
            entrada: dataHoraEntrada,
            saida: null,
            valor: isMensalista ? parseFloat(precoMensal) || 0 : null
        }]
    };

    vehicles.push(newVehicle);
    await saveVehicles(vehicles);
    return newVehicle;
}

async function verificarMensalistas() {
    const agora = new Date().getTime();
    vehicles.forEach(async veiculo => {
        if (veiculo.is_mensalista && veiculo.ativo && veiculo.data_inicio_mensalista) {
            const tempoDecorrido = agora - veiculo.data_inicio_mensalista;
            if (tempoDecorrido >= UM_MES) {
                alert(`Aviso: O mensalista ${veiculo.placa} (${veiculo.modelo}) na vaga ${veiculo.vaga} completou 1 mês. Nova cobrança será iniciada.`);
                veiculo.data_inicio_mensalista = agora;
                await saveVehicles(vehicles);
            }
        }
    });
}

function selecionarVeiculo(id) {
    selectedVehicle = vehicles.find(v => v.id === id);
    return selectedVehicle;
}

async function editarVaga(id, novaVaga) {
    const veiculo = vehicles.find(v => v.id === id);
    novaVaga = novaVaga.toString().padStart(2, '0');

    if (novaVaga && !vehicles.some(v => v.vaga === novaVaga && v.ativo && v.id !== id)) {
        veiculo.vaga = novaVaga;
        await saveVehicles(vehicles);
        return true;
    }
    alert('Vaga já ocupada ou inválida!');
    return false;
}

async function registrarSaida() {
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

    if (veiculo.is_mensalista) {
        const confirmar = confirm(
            `CONFIRMAR SAÍDA:\n\nID: ${veiculo.id}\nPlaca: ${veiculo.placa}\nMensalista - Valor Fixo: R$ ${veiculo.preco_mensal.toFixed(2)}\n\nClique em OK para confirmar`
        );

        if (confirmar) {
            veiculo.historico[veiculo.historico.length - 1].saida = dataHoraSaida;
            veiculo.historico[veiculo.historico.length - 1].valor = veiculo.preco_mensal;
            veiculo.ativo = false;
            await saveVehicles(vehicles);
            selectedVehicle = null;
            return true;
        }
        return false;
    }

    const tempo = calcularTempo(selectedVehicle.entrada_timestamp);
    const valor = calcularValor(tempo.dias, tempo.horas, tempo.minutos);

    const confirmar = confirm(
        `CONFIRMAR SAÍDA:\n\nID: ${veiculo.id}\nPlaca: ${veiculo.placa}\nTempo: ${tempo.dias}d ${tempo.horas}h ${tempo.minutos}m\nValor: R$ ${valor.toFixed(2)}\n\nClique em OK para confirmar`
    );

    if (confirmar) {
        veiculo.historico[veiculo.historico.length - 1].saida = dataHoraSaida;
        veiculo.historico[veiculo.historico.length - 1].valor = valor;
        veiculo.ativo = false;
        await saveVehicles(vehicles);
        selectedVehicle = null;
        return true;
    }
    return false;
}

export { adicionarCarro, selecionarVeiculo, editarVaga, registrarSaida, verificarMensalistas, vehicles, totalVagas, selectedVehicle, initialize };