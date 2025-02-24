//Manipulação do localStorage.
// assets/Js/relatorios/storage.js
function loadVehicles() {
    return JSON.parse(localStorage.getItem('vehicles')) || [];
}

function clearStorage() {
    localStorage.removeItem('vehicles');
    localStorage.removeItem('idCounter');
}

export { loadVehicles, clearStorage };