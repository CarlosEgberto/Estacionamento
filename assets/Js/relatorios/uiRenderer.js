//Renderização da interface e filtros.
// assets/Js/relatorios/uiRenderer.js
import { loadVehicles } from './storage.js';
import { ultimaEntrada } from './utils.js';

function renderListaVeiculos() {
    const vehicles = loadVehicles();
    const listaVeiculos = document.getElementById('listaVeiculos');
    listaVeiculos.innerHTML = '';

    vehicles.forEach(vehicle => {
        const veiculoDiv = document.createElement('div');
        veiculoDiv.classList.add('veiculo-item');
        veiculoDiv.dataset.placa = vehicle.placa;
        veiculoDiv.innerHTML = `
            <h3>${vehicle.modelo}</h3>
            <p>Placa: ${vehicle.placa}</p>
            <p>Cor: ${vehicle.cor}</p>
            <p>Última entrada: ${ultimaEntrada(vehicle)}</p>
        `;
        listaVeiculos.appendChild(veiculoDiv);
    });
}

function filtrarListaVeiculos() {
    const filtro = document.getElementById('pesquisaPlaca').value.toUpperCase();
    const listaVeiculos = document.getElementById('listaVeiculos');
    const veiculosItens = listaVeiculos.querySelectorAll('.veiculo-item');

    veiculosItens.forEach(item => {
        const placa = item.dataset.placa.toUpperCase();
        item.style.display = placa.includes(filtro) ? 'block' : 'none';
    });
}

export { renderListaVeiculos, filtrarListaVeiculos };