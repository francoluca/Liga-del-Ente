function saveSurvivors() {
    localStorage.setItem(DB_KEY, JSON.stringify(survivors));
}

function loadSurvivors() {
    try {
        const saved = localStorage.getItem(DB_KEY);
        if (saved) {
            survivors = JSON.parse(saved);
            survivors.forEach(s => {
                if (s.lastRound === undefined) s.lastRound = 0;
                if (s.wins === undefined) s.wins = 0;
            });
        }
    } catch (e) {
        console.error('Error loading survivors:', e);
    }
}

function loadCurrentRound() {
    const stored = localStorage.getItem('liga_currentRound_survivors');
    return stored ? parseInt(stored) : 0;
}

function saveCurrentRound(round) {
    localStorage.setItem('liga_currentRound_survivors', round.toString());
}

function exportSurvivors() {
    const io = document.getElementById('json-io');
    io.style.display = 'block';
    io.value = JSON.stringify(survivors, null, 2);
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
            survivors = imported;
            saveSurvivors();
            render();
            document.getElementById('config-panel').style.display = 'none';
        }
    } catch (e) {
        alert('JSON inválido. Por favor verifica el formato.');
    }
}

function resetAllData() {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem('liga_currentRound_survivors');
    location.reload();
}

function cleanForFilename(str) {
    if (!str) return 'empty';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '_');
}