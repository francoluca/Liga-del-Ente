function openResetModal() {
    document.getElementById('config-panel').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('confirm-reset-modal').classList.add('visible');
}

function closeModals() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.querySelectorAll('.modal-base').forEach(m => m.classList.remove('visible'));
    document.getElementById('modal-hooks').value = '';
}

function registrarResultado(res) {
    const k = killers.find(x => x.id === selectedKillerId);
    const h = parseInt(document.getElementById('modal-hooks').value) || 0;
    document.querySelectorAll('.killer-card').forEach(c => c.classList.remove('card-focus', 'card-focus-final', 'no-candidato', 'cruzar-arriba', 'cruzar-abajo', 'subir-interno-anim', 'bajar-interno-anim', 'mismo-lugar-anim'));

    const currentRankListPrev = sortKillers(killers.filter(x => x.rank === k.rank));
    const oldInternalIndex = currentRankListPrev.findIndex(x => x.id === k.id);
    let implicadosIds = [k.id];
    let victimId = null;
    let rIndex = RANKS.indexOf(k.rank);
    const cardK = document.getElementById(`killer-${k.id}`);

    k.points += POINTS[res.toUpperCase()];
    k.played++;
    k.hooks += h;
    k.performance = parseFloat(((k.points / (k.played * 3)) * 100).toFixed(1));
    k.lastRound = currentRound;

    if (res === 'win' && rIndex < 4) {
        let rSup = RANKS[rIndex + 1];
        let victims = killers.filter(x => x.rank === rSup).sort((a, b) => (b.performance - a.performance) || (a.hooks - b.hooks) || (b.priority - a.priority));
        if (victims.length > 0) {
            victimId = victims[0].id;
            implicadosIds.push(victimId);
            const victimCard = document.getElementById(`killer-${victimId}`);
            cardK.classList.add('cruzar-arriba');
            victimCard.classList.add('cruzar-abajo');

            const victim = killers.find(x => x.id === victimId);
            const tempRank = k.rank;
            k.rank = victim.rank;
            victim.rank = tempRank;
            k.priority = 9999;
            victim.priority = 0.001;
            recalculatePriorities();
            saveKillers();
            closeModals();
            setTimeout(() => {
                highlightedIds = implicadosIds;
                render();
                setTimeout(() => { highlightedIds = []; render(); }, ANIMATION_DURATIONS.HIGHLIGHT);
            }, ANIMATION_DURATIONS.MODAL_DELAY);
            return;
        }
    } else if (res === 'loss' && rIndex > 0) {
        let rInf = RANKS[rIndex - 1];
        let heroes = killers.filter(x => x.rank === rInf).sort((a, b) => (b.performance - a.performance) || (b.hooks - a.hooks) || (a.priority - b.priority));
        if (heroes.length > 0) {
            victimId = heroes[0].id;
            implicadosIds.push(victimId);
            const victimCard = document.getElementById(`killer-${victimId}`);
            cardK.classList.add('cruzar-abajo');
            victimCard.classList.add('cruzar-arriba');

            const victim = killers.find(x => x.id === victimId);
            const tempRank = k.rank;
            k.rank = victim.rank;
            victim.rank = tempRank;
            k.priority = 0.001;
            victim.priority = 9999;
            recalculatePriorities();
            saveKillers();
            closeModals();
            setTimeout(() => {
                highlightedIds = implicadosIds;
                render();
                setTimeout(() => { highlightedIds = []; render(); }, ANIMATION_DURATIONS.HIGHLIGHT);
            }, ANIMATION_DURATIONS.MODAL_DELAY);
            return;
        }
    }

    recalculatePriorities();
    saveKillers();

    const tempPoints = k.points;
    const tempPerf = parseFloat(((tempPoints / ((k.played) * 3)) * 100).toFixed(1));
    const simulatedRankList = sortKillers(currentRankListPrev.map(x => x.id === k.id ? { ...x, performance: tempPerf, hooks: x.hooks + h } : x));
    const newInternalIndex = simulatedRankList.findIndex(x => x.id === k.id);

    if (newInternalIndex < oldInternalIndex) cardK.classList.add('subir-interno-anim');
    else if (newInternalIndex > oldInternalIndex) cardK.classList.add('bajar-interno-anim');
    else cardK.classList.add('mismo-lugar-anim');

    closeModals();
    setTimeout(() => {
        highlightedIds = [k.id];
        render();
        setTimeout(() => { highlightedIds = []; render(); }, ANIMATION_DURATIONS.HIGHLIGHT);
    }, 1500);
}

function confirmReset() {
    resetAllData();
}