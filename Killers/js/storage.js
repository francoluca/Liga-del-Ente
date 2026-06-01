function saveKillers() {
    localStorage.setItem(DB_KEY, JSON.stringify(killers));
}

function loadKillers() {
    try {
        const saved = localStorage.getItem(DB_KEY);
        if (saved) {
            killers = JSON.parse(saved);
            killers.forEach(k => {
                if (k.lastRound === undefined) k.lastRound = 0;
                if (k.wins === undefined) k.wins = 0;
            });
        }
    } catch (e) {
        console.error('Error loading killers:', e);
    }
}

function loadCurrentRound() {
    const stored = localStorage.getItem('liga_currentRound_killers');
    return stored ? parseInt(stored) : 0;
}

function saveCurrentRound(round) {
    localStorage.setItem('liga_currentRound_killers', round.toString());
}

function exportKillers() {
    const io = document.getElementById('json-io');
    io.style.display = 'block';
    io.value = JSON.stringify(killers, null, 2);
    io.select();
    document.execCommand('copy');
}

function showImportDialog() {
    const io = document.getElementById('json-io');
    io.style.display = 'block';
    io.value = '';
    document.getElementById('btn-load').style.display = 'block';
}

function confirmImport() {
    try {
        const imported = JSON.parse(document.getElementById('json-io').value);
        if (Array.isArray(imported)) {
            killers = imported;
            saveKillers();
            render();
            document.getElementById('config-panel').style.display = 'none';
        }
    } catch (e) {
        alert('JSON inválido. Por favor verifica el formato.');
    }
}

function resetAllData() {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem('liga_currentRound_killers');
    location.reload();
}

function cleanForFilename(str) {
    if (!str) return 'empty';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '_');
}