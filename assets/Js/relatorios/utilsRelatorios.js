import { loadVehicles } from '../index/storageIndex.js';

// Função para calcular o total arrecadado no mês selecionado
async function calcularTotalArrecadado(selectedMonth = new Date()) {
    const vehicles = await loadVehicles();
    const totalMesElement = document.getElementById('totalMes');
    if (!totalMesElement) {
        console.error('Elemento totalMes não encontrado');
        return;
    }

    const selectedMonthIndex = selectedMonth.getMonth();
    const selectedYear = selectedMonth.getFullYear();

    let total = 0;

    vehicles.forEach(vehicle => {
        if (vehicle.historico && vehicle.historico.length > 0) {
            vehicle.historico.forEach(entrada => {
                const entradaDate = new Date(entrada.dataEntrada);
                if (
                    entradaDate.getMonth() === selectedMonthIndex &&
                    entradaDate.getFullYear() === selectedYear
                ) {
                    // Supondo que cada entrada tem um campo "valor" com o preço pago
                    total += entrada.valor || 0;
                }
            });
        }

        // Se for mensalista, adicionar o valor mensal se o mês corresponder
        if (vehicle.isMensalista) {
            const ultimaEntrada = vehicle.historico?.length > 0
                ? new Date(vehicle.historico[vehicle.historico.length - 1].dataEntrada)
                : null;
            if (
                ultimaEntrada &&
                ultimaEntrada.getMonth() <= selectedMonthIndex &&
                ultimaEntrada.getFullYear() <= selectedYear
            ) {
                total += vehicle.precoMensal || 0;
            }
        }
    });

    totalMesElement.textContent = `R$ ${total.toFixed(2)}`;
    console.log(`Total arrecadado em ${formatMonthYear(selectedMonth)}: R$ ${total.toFixed(2)}`);
}

// Função para obter a última entrada de um veículo
function ultimaEntrada(vehicle) {
    if (!vehicle.historico || vehicle.historico.length === 0) return 'N/A';
    const ultima = vehicle.historico.reduce((latest, current) => {
        const latestDate = new Date(latest.dataEntrada);
        const currentDate = new Date(current.dataEntrada);
        return currentDate > latestDate ? current : latest;
    });
    return new Date(ultima.dataEntrada).toLocaleDateString('pt-BR');
}

// Função auxiliar para formatar mês e ano
function formatMonthYear(date) {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Funções existentes
function updateTime() {
    const currentTime = document.getElementById('currentTime');
    if (currentTime) {
        const now = new Date();
        currentTime.textContent = now.toLocaleTimeString();
        setInterval(() => {
            currentTime.textContent = new Date().toLocaleTimeString();
        }, 1000);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function checkDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
}

export { calcularTotalArrecadado, updateTime, toggleDarkMode, checkDarkMode, ultimaEntrada };