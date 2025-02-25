function loadVehicles() {
    return JSON.parse(localStorage.getItem('vehicles')) || [];
}

export { loadVehicles };