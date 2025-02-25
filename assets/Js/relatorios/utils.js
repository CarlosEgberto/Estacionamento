import { loadVehicles } from './storage.js';

function calcularTotalArrecadado() {
    const vehicles = loadVehicles();
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

function ultimaEntrada(vehicle) {
    if (vehicle.historico && vehicle.historico.length > 0) {
        const ultimoRegistro = vehicle.historico[vehicle.historico.length - 1];
        return ultimoRegistro.entrada;
    }
    return '-';
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('currentTime').textContent = timeString;
    setTimeout(updateTime, 1000);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function checkDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    document.getElementById('darkModeToggle').checked = darkMode;
}

export { calcularTotalArrecadado, ultimaEntrada, updateTime, toggleDarkMode, checkDarkMode };