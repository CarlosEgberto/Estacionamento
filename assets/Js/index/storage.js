//Manipulação do localStorage.
// storage.js
function loadVehicles() {
    return JSON.parse(localStorage.getItem('vehicles'));
}

function saveVehicles(vehicles) {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

function loadIdCounter() {
    return parseInt(localStorage.getItem('idCounter'));
}

function saveIdCounter(idCounter) {
    localStorage.setItem('idCounter', idCounter);
}

export { loadVehicles, saveVehicles, loadIdCounter, saveIdCounter };