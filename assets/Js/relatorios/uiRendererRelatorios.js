import { loadVehicles } from '../index/storageIndex.js';
import { ultimaEntrada } from './utilsRelatorios.js';

async function renderListaVeiculos() {
    console.log('Renderizando lista de veículos...');
    const vehicles = await loadVehicles();
    const listaVeiculos = document.getElementById('listaVeiculos');
    if (!listaVeiculos) {
        console.error('Elemento listaVeiculos não encontrado');
        return;
    }
    listaVeiculos.innerHTML = '';

    // Filtrar apenas veículos ativos ou com histórico
    const activeVehicles = vehicles.filter(vehicle => vehicle.ativo || vehicle.historico?.length > 0);

    if (activeVehicles.length === 0) {
        console.log('Nenhum veículo ativo encontrado');
        listaVeiculos.innerHTML = '<p>Nenhum veículo registrado.</p>';
    } else {
        activeVehicles.forEach(vehicle => {
            const veiculoDiv = document.createElement('div');
            veiculoDiv.classList.add('veiculo-item');
            veiculoDiv.dataset.placa = vehicle.placa;
            veiculoDiv.innerHTML = `
                <h3>${vehicle.modelo || 'N/A'}</h3>
                <p>Placa: ${vehicle.placa || 'N/A'}</p>
                <p>Cor: ${vehicle.cor || 'N/A'}</p>
                <p>Última entrada: ${ultimaEntrada(vehicle)}</p>
                <p>Tipo: ${vehicle.isMensalista ? `Mensalista (R$ ${vehicle.precoMensal?.toFixed(2) || '0.00'})` : 'Avulso'}</p>
            `;
            listaVeiculos.appendChild(veiculoDiv);
        });
        console.log('Lista de veículos renderizada com', activeVehicles.length, 'itens');
    }
}

function filtrarListaVeiculos() {
    const filtro = document.getElementById('pesquisaPlaca')?.value.toUpperCase() || '';
    const listaVeiculos = document.getElementById('listaVeiculos');
    if (!listaVeiculos) {
        console.error('Elemento listaVeiculos não encontrado para filtragem');
        return;
    }
    const veiculosItens = listaVeiculos.querySelectorAll('.veiculo-item');

    veiculosItens.forEach(item => {
        const placa = item.dataset.placa.toUpperCase();
        item.style.display = placa.includes(filtro) ? 'block' : 'none';
    });
    console.log('Filtro aplicado para:', filtro);
}

export { renderListaVeiculos, filtrarListaVeiculos };