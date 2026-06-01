function openResetModal() {
    document.getElementById('config-panel').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('confirm-reset-modal').classList.add('visible');
}

function closeModals() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.querySelectorAll('.modal-base').forEach(m => m.classList.remove('visible'));
    document.getElementById('modal-generators').value = '';
}

function registrarResultado(res) {
    const s = survivors.find(x => x.id === selectedSurvivorId);
    const g = parseInt(document.getElementById('modal-generators').value) || 0;
    document.querySelectorAll('.survivor-card').forEach(c => c.classList.remove('card-focus', 'card-focus-final', 'no-candidato', 'cruzar-arriba', 'cruzar-abajo', 'subir-interno-anim', 'bajar-interno-anim', 'mismo-lugar-anim'));

    const currentRankListPrev = sortSurvivors(survivors.filter(x => x.rank === s.rank));
    const oldInternalIndex = currentRankListPrev.findIndex(x => x.id === s.id);
    let implicadosIds = [s.id];
    let victimId = null;
    let rIndex = RANKS.indexOf(s.rank);
    const cardS = document.getElementById(`survivor-${s.id}`);

    s.points += POINTS[res.toUpperCase()];
    s.played++;
    s.generators += g;
    s.performance = parseFloat(((s.points / s.played) * 100).toFixed(1));
    s.lastRound = currentRound;

    if (res === 'win' && rIndex < 4) {
        let rSup = RANKS[rIndex + 1];
        let victims = survivors.filter(x => x.rank === rSup).sort((a, b) => (a.performance - b.performance) || (a.generators - b.generators) || (b.priority - a.priority));
        if (victims.length > 0) {
            victimId = victims[0].id;
            implicadosIds.push(victimId);
            const victimCard = document.getElementById(`survivor-${victimId}`);
            cardS.classList.add('cruzar-arriba');
            victimCard.classList.add('cruzar-abajo');

            const victim = survivors.find(x => x.id === victimId);
            const tempRank = s.rank;
            s.rank = victim.rank;
            victim.rank = tempRank;
            s.priority = 9999;
            victim.priority = 0.001;
            recalculatePriorities();
            saveSurvivors();
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
        let heroes = survivors.filter(x => x.rank === rInf).sort((a, b) => (b.performance - a.performance) || (b.generators - a.generators) || (a.priority - b.priority));
        if (heroes.length > 0) {
            victimId = heroes[0].id;
            implicadosIds.push(victimId);
            const victimCard = document.getElementById(`survivor-${victimId}`);
            cardS.classList.add('cruzar-abajo');
            victimCard.classList.add('cruzar-arriba');

            const victim = survivors.find(x => x.id === victimId);
            const tempRank = s.rank;
            s.rank = victim.rank;
            victim.rank = tempRank;
            s.priority = 0.001;
            victim.priority = 9999;
            recalculatePriorities();
            saveSurvivors();
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
    saveSurvivors();

    const tempPoints = s.points;
    const tempPerf = parseFloat(((tempPoints / (s.played)) * 100).toFixed(1));
    const simulatedRankList = sortSurvivors(currentRankListPrev.map(x => x.id === s.id ? { ...x, performance: tempPerf, generators: x.generators + g } : x));
    const newInternalIndex = simulatedRankList.findIndex(x => x.id === s.id);

    if (newInternalIndex < oldInternalIndex) cardS.classList.add('subir-interno-anim');
    else if (newInternalIndex > oldInternalIndex) cardS.classList.add('bajar-interno-anim');
    else cardS.classList.add('mismo-lugar-anim');

    closeModals();
    setTimeout(() => {
        highlightedIds = [s.id];
        render();
        setTimeout(() => { highlightedIds = []; render(); }, ANIMATION_DURATIONS.HIGHLIGHT);
    }, 1500);
}

function confirmReset() {
    resetAllData();
}