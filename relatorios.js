// relatorios.js
document.addEventListener('DOMContentLoaded', () => {
    carregarTotalArrecadado();
});

function carregarTotalArrecadado() {
    const veiculos = JSON.parse(localStorage.getItem('vehicles')) || [];
    const mesAtual = new Date().getMonth();
    
    const total = veiculos
        .filter(v => !v.ativo && new Date(v.entradaTimestamp).getMonth() === mesAtual)
        .reduce((acc, v) => acc + v.valorPago, 0);
    
    document.getElementById('totalMes').innerHTML = `
        <p>Total arrecadado este mês: R$ ${total.toFixed(2)}</p>
    `;
}

function pesquisarVeiculo() {
    const placa = document.getElementById('pesquisaPlaca').value.toUpperCase();
    const veiculos = JSON.parse(localStorage.getItem('vehicles')) || [];
    
    const historico = veiculos.filter(v => v.placa === placa);
    
    if (historico.length > 0) {
        const html = historico.map(v => `
            <div class="historico-item">
                <p>Data: ${new Date(v.entradaTimestamp).toLocaleDateString()}</p>
                <p>Modelo: ${v.modelo}</p>
                <p>Valor Pago: R$ ${v.valorPago?.toFixed(2) || '0.00'}</p>
            </div>
        `).join('');
        
        document.getElementById('resultadoPesquisa').innerHTML = html;
    } else {
        document.getElementById('resultadoPesquisa').innerHTML = '<p>Nenhum registro encontrado.</p>';
    }
}