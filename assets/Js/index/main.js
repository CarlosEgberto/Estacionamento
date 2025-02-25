import { adicionarCarro, selecionarVeiculo, editarVaga, registrarSaida, verificarMensalistas, vehicles } from './vehicleManager.js';
import { renderVeiculos, mostrarComprovante, fecharComprovante, updateSelectedVehicleUI } from './uiRenderer.js';
import { limparFormulario, updateTime } from './utils.js';
import { saveIdCounter, loadIdCounter } from './storage.js';

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function checkDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    document.getElementById('darkModeToggle').checked = darkMode;
}

function init() {
    renderVeiculos();
    if (!loadIdCounter()) {
        saveIdCounter(1000);
    }
    checkDarkMode();
    setInterval(updateTime, 1000);
    updateTime();

    verificarMensalistas();
    setInterval(verificarMensalistas, 60000); // Verifica a cada 1 minuto

    window.adicionarCarro = () => {
        const modelo = document.getElementById('modelo').value;
        const placa = document.getElementById('placa').value;
        const cor = document.getElementById('cor').value;
        const vaga = document.getElementById('vaga').value;
        const isMensalista = document.getElementById('isMensalista').checked;
        const precoMensal = isMensalista ? document.getElementById('precoMensal').value : 0;

        const veiculo = adicionarCarro(modelo, placa, cor, vaga, isMensalista, precoMensal);
        if (veiculo) {
            limparFormulario();
            renderVeiculos();
            mostrarComprovante(veiculo);
        }
    };

    window.registrarSaida = () => {
        if (registrarSaida()) {
            updateSelectedVehicleUI();
            renderVeiculos();
            alert('Saída registrada com sucesso!');
        }
    };

    window.selecionarVeiculo = id => {
        selecionarVeiculo(id);
        updateSelectedVehicleUI();
        renderVeiculos();
    };

    window.editarVaga = id => {
        const novaVaga = prompt('Digite a nova vaga:', vehicles.find(v => v.id === id)?.vaga);
        if (editarVaga(id, novaVaga)) renderVeiculos();
    };

    window.fecharComprovante = fecharComprovante;
    window.imprimirComprovante = window.print;

    document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
}

window.onload = init;