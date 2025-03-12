import { adicionarCarro, selecionarVeiculo, editarVaga, registrarSaida, verificarMensalistas, vehicles, initialize } from './vehicleManagerIndex.js';
import { renderVeiculos, mostrarComprovante, fecharComprovante, updateSelectedVehicleUI } from './uiRendererIndex.js';
import { limparFormulario, updateTime } from './utilsIndex.js';
import { saveIdCounter, loadIdCounter } from './storageIndex.js';

console.log('Index.js carregado'); // Verificar se o arquivo está sendo executado

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function checkDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    document.getElementById('darkModeToggle').checked = darkMode;
}

async function init() {
    try {
        console.log('Iniciando aplicação...');
        await initialize();
        renderVeiculos();
        if (!await loadIdCounter()) {
            await saveIdCounter(1000);
        }
        checkDarkMode();
        setInterval(updateTime, 1000);
        updateTime();

        verificarMensalistas();
        setInterval(verificarMensalistas, 60000);

        const btnAdicionarCarro = document.getElementById('btnAdicionarCarro');
        const btnRegistrarSaida = document.getElementById('btnRegistrarSaida');
        const btnFecharComprovante = document.getElementById('btnFecharComprovante');
        const btnImprimirComprovante = document.getElementById('btnImprimirComprovante');
        const darkModeToggle = document.getElementById('darkModeToggle');

        if (btnAdicionarCarro) {
            console.log('Botão Adicionar Carro encontrado');
            btnAdicionarCarro.addEventListener('click', async () => {
                console.log('Botão Adicionar Carro clicado');
                const modelo = document.getElementById('modelo').value;
                const placa = document.getElementById('placa').value;
                const cor = document.getElementById('cor').value;
                const vaga = document.getElementById('vaga').value;
                const isMensalista = document.getElementById('isMensalista').checked;
                const precoMensal = isMensalista ? document.getElementById('precoMensal').value : 0;

                const veiculo = await adicionarCarro(modelo, placa, cor, vaga, isMensalista, precoMensal);
                if (veiculo) {
                    limparFormulario();
                    renderVeiculos();
                    mostrarComprovante(veiculo);
                }
            });
        } else {
            console.error('Botão Adicionar Carro não encontrado');
        }

        if (btnRegistrarSaida) {
            console.log('Botão Registrar Saída encontrado');
            btnRegistrarSaida.addEventListener('click', async () => {
                console.log('Botão Registrar Saída clicado');
                if (await registrarSaida()) {
                    updateSelectedVehicleUI();
                    renderVeiculos();
                    alert('Saída registrada com sucesso!');
                }
            });
        } else {
            console.error('Botão Registrar Saída não encontrado');
        }

        if (btnFecharComprovante) {
            console.log('Botão Fechar Comprovante encontrado');
            btnFecharComprovante.addEventListener('click', fecharComprovante);
        } else {
            console.error('Botão Fechar Comprovante não encontrado');
        }

        if (btnImprimirComprovante) {
            console.log('Botão Imprimir Comprovante encontrado');
            btnImprimirComprovante.addEventListener('click', window.print);
        } else {
            console.error('Botão Imprimir Comprovante não encontrado');
        }

        if (darkModeToggle) {
            console.log('Toggle Modo Escuro encontrado');
            darkModeToggle.addEventListener('change', toggleDarkMode);
        } else {
            console.error('Toggle Modo Escuro não encontrado');
        }

        window.selecionarVeiculo = (id) => {
            console.log('Selecionar Veículo chamado com ID:', id);
            selecionarVeiculo(id);
            updateSelectedVehicleUI();
            renderVeiculos();
        };

        window.editarVaga = async (id) => {
            console.log('Editar Vaga chamado com ID:', id);
            const novaVaga = prompt('Digite a nova vaga:', vehicles.find(v => v.id === id)?.vaga);
            if (await editarVaga(id, novaVaga)) renderVeiculos();
        };

    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
}

window.onload = () => {
    console.log('Window.onload disparado');
    init();
};