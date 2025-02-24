//Funções utilitárias (formatação, cálculos, etc.).
// utils.js
function formatarPlaca(placa) {
    const placaFormatada = placa.replace(/([A-Za-z]{3})([0-9]{0})([A-Za-z0-9]{4})/, '$1$2-$3');
    return placaFormatada.slice(0, 8);
}

function calcularTempo(entradaTimestamp) {
    const saidaTimestamp = new Date().getTime();
    const diff = saidaTimestamp - entradaTimestamp;
    return {
        horas: Math.floor(diff / 3600000),
        minutos: Math.floor((diff % 3600000) / 60000)
    };
}

function calcularValor(horas, minutos) {
    const taxaMinima = 5.00;
    const valorHora = 5.00;
    if (horas === 0 && minutos < 15) return taxaMinima;
    return Math.max(taxaMinima, (horas * valorHora) + (minutos > 0 ? valorHora : 0));
}

function limparFormulario() {
    document.getElementById('modelo').value = '';
    document.getElementById('placa').value = '';
    document.getElementById('cor').value = '';
    document.getElementById('vaga').value = '';
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('currentTime').textContent = timeString;
}

export { formatarPlaca, calcularTempo, calcularValor, limparFormulario, updateTime };