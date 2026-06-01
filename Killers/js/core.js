let killers = [];
let currentRound = 0;
let highlightedIds = [];
let selectedKillerId = null;

function sortKillers(arr) {
    return arr.sort((a, b) => (b.performance - a.performance) || (b.hooks - a.hooks) || (a.priority - b.priority));
}

function init() {
    loadKillers();
    if (killers.length === 0) {
        killers = INITIAL_KILLERS.map(k => ({ ...k, performance: 0, lastRound: 0 }));
    }
    killers.forEach(k => {
        if (k.played > 0) k.performance = parseFloat(((k.points / (k.played * 3)) * 100).toFixed(1));
        else k.performance = 0;
    });
    currentRound = loadCurrentRound();
    render();
}

function render() {
    const canvas = document.getElementById('liga-canvas');
    canvas.innerHTML = '';

    [...RANKS].reverse().forEach(rank => {
        const col = document.createElement('div');
        const rKey = rank.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        col.className = `rank-column col-${rKey}`;
        const rK = sortKillers(killers.filter(x => x.rank === rank));

        col.innerHTML = `
            <div class="rank-header">
                <img src="img/rank_${rKey === 'iridiscente' ? 'iri' : rKey}.webp" class="rank-icon-side">
                <span class="rank-title">${rank}</span>
            </div>
            <div class="killers-list">
                ${rK.map(k => {
                    const isHi = highlightedIds.includes(k.id);
                    const rColor = `var(--${rKey === 'iridiscente' ? 'iri' : rKey})`;
                    const starHTML = k.wins > 0 ? `
                        <div class="champion-star-container">
                            <img src="img/copa.png" class="trophy-img">
                            <span class="win-count">${k.wins}</span>
                        </div>` : '';
                    return `
                    <div id="killer-${k.id}" class="killer-card ${isHi ? 'resaltar-latido' : ''}" onclick="openKillerAction(${k.id})" style="position:relative; ${isHi ? 'color:' + rColor + '; border-color:' + rColor + ';' : ''}">
                        ${starHTML}
                        <img src="${k.img}" class="killer-img">
                        <div class="killer-info">
                            <span class="killer-name">${k.name}</span>
                            <div class="killer-stats">
                                <span class="perf-value">${k.performance.toFixed(1)}%</span>
                                <div class="stat-row">
                                    <span class="stat-item">PJ ${k.played}</span>
                                    <span class="stat-item">PTS ${k.points}</span>
                                    <span class="stat-item"><img src="img/hook.webp" class="hook-icon"> ${k.hooks}</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        canvas.appendChild(col);
    });
    saveKillers();
}

function recalculatePriorities() {
    RANKS.forEach(r => {
        let col = killers.filter(x => x.rank === r).sort((a, b) => (b.performance - a.performance) || (b.hooks - a.hooks) || (a.priority - b.priority));
        col.forEach((killer, idx) => killer.priority = idx + 1);
    });
}

function getAllKillerPerks() {
    let all = [];
    killers.forEach(k => {
        if (k.expert_perks) all.push(...k.expert_perks);
    });
    return [...new Set(all)];
}

function updateChampionWinsDisplay() {
    const select = document.getElementById('champion-select');
    const winsInput = document.getElementById('champion-wins');
    if (select.value) {
        const k = killers.find(x => x.id === parseInt(select.value));
        if (k) winsInput.value = k.wins || 0;
    }
}

function saveChampionWins() {
    const select = document.getElementById('champion-select');
    const winsInput = document.getElementById('champion-wins');
    if (select.value) {
        const k = killers.find(x => x.id === parseInt(select.value));
        if (k) {
            k.wins = parseInt(winsInput.value) || 0;
            saveKillers();
            initChampionSelect();
            render();
        }
    }
}

function initChampionSelect() {
    const select = document.getElementById('champion-select');
    select.innerHTML = '<option value="">Seleccionar killer</option>';
    const sorted = [...killers].sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach(k => {
        const option = document.createElement('option');
        option.value = k.id;
        option.textContent = k.name + (k.wins > 0 ? ` (${k.wins}🏆)` : '');
        select.appendChild(option);
    });
}

function toggleConfig() {
    const p = document.getElementById('config-panel');
    p.style.display = p.style.display === 'flex' ? 'none' : 'flex';
}