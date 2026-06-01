let survivors = [];
let currentRound = 0;
let highlightedIds = [];
let selectedSurvivorId = null;

function sortSurvivors(arr) {
    return arr.sort((a, b) => (b.performance - a.performance) || (b.generators - a.generators) || (a.priority - b.priority));
}

function init() {
    loadSurvivors();
    if (survivors.length === 0) {
        survivors = INITIAL_SURVIVORS.map(s => ({ ...s, performance: 0, lastRound: 0, wins: 0 }));
    }
    survivors.forEach(s => {
        if (s.played > 0) s.performance = parseFloat(((s.points / s.played) * 100).toFixed(1));
        else s.performance = 0;
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
        const rK = sortSurvivors(survivors.filter(x => x.rank === rank));

        col.innerHTML = `
            <div class="rank-header">
                <img src="img/rank_${rKey === 'iridiscente' ? 'iri' : rKey}.webp" class="rank-icon-side">
                <span class="rank-title">${rank}</span>
            </div>
            <div class="survivors-list">
                ${rK.map(s => {
                    const isHi = highlightedIds.includes(s.id);
                    const rColor = `var(--${rKey === 'iridiscente' ? 'iri' : rKey})`;
                    const starHTML = s.wins > 0 ? `
                        <div class="champion-star-container">
                            <img src="img/copa.png" class="trophy-img">
                            <span class="win-count">${s.wins}</span>
                        </div>` : '';
                    return `
                    <div id="survivor-${s.id}" class="survivor-card ${isHi ? 'resaltar-latido' : ''}" onclick="openSurvivorAction(${s.id})" style="position:relative; ${isHi ? 'color:' + rColor + '; border-color:' + rColor + ';' : ''}">
                        ${starHTML}
                        <img src="${s.img}" class="survivor-img">
                        <div class="survivor-info">
                            <span class="survivor-name">${s.name}</span>
                            <div class="survivor-stats">
                                <span class="perf-value">${s.performance.toFixed(1)}%</span>
                                <div class="stat-row">
                                    <span class="stat-item">PJ ${s.played}</span>
                                    <span class="stat-item"><img src="img/escape.webp" class="generator-icon"> ${s.points}</span>
                                    <span class="stat-item"><img src="img/gen.webp" class="generator-icon"> ${s.generators}</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        canvas.appendChild(col);
    });
    saveSurvivors();
}

function recalculatePriorities() {
    RANKS.forEach(r => {
        let col = survivors.filter(x => x.rank === r).sort((a, b) => (b.performance - a.performance) || (b.generators - a.generators) || (a.priority - b.priority));
        col.forEach((survivor, idx) => survivor.priority = idx + 1);
    });
}

function getAllSurvivorPerks() {
    let all = [];
    survivors.forEach(s => {
        if (s.expert_perks) all.push(...s.expert_perks);
    });
    return [...new Set(all)];
}

function updateChampionWinsDisplay() {
    const select = document.getElementById('champion-select');
    const winsInput = document.getElementById('champion-wins');
    if (select.value) {
        const s = survivors.find(x => x.id === parseInt(select.value));
        if (s) winsInput.value = s.wins || 0;
    }
}

function saveChampionWins() {
    const select = document.getElementById('champion-select');
    const winsInput = document.getElementById('champion-wins');
    if (select.value) {
        const s = survivors.find(x => x.id === parseInt(select.value));
        if (s) {
            s.wins = parseInt(winsInput.value) || 0;
            saveSurvivors();
            initChampionSelect();
            render();
        }
    }
}

function initChampionSelect() {
    const select = document.getElementById('champion-select');
    select.innerHTML = '<option value="">Seleccionar survivor</option>';
    const sorted = [...survivors].sort((a, b) => a.name.localeCompare(b.name));
    sorted.forEach(s => {
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = s.name + (s.wins > 0 ? ` (${s.wins}🏆)` : '');
        select.appendChild(option);
    });
}

function toggleConfig() {
    const p = document.getElementById('config-panel');
    p.style.display = p.style.display === 'flex' ? 'none' : 'flex';
}