//Manipulação do localStorage.
// assets/Js/vagas/storage.js
function loadVehicles() {
    return JSON.parse(localStorage.getItem('vehicles')) || [];
}

export { loadVehicles };