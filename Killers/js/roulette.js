function startRoulette() {
    const btn = document.getElementById('btn-roulette');
    btn.disabled = true;
    let candidates = killers.filter(k => k.lastRound !== currentRound);
    if (candidates.length === 0) {
        currentRound++;
        saveCurrentRound(currentRound);
        candidates = killers.filter(k => k.lastRound !== currentRound);
    }
    if (candidates.length === 0) {
        candidates = [...killers];
    }
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    const candidateIds = candidates.map(c => c.id);
    document.querySelectorAll('.killer-card').forEach(card => {
        const id = parseInt(card.id.split('-')[1]);
        if (!candidateIds.includes(id)) card.classList.add('no-candidato');
    });
    let ticks = 0;
    let speed = ANIMATION_DURATIONS.ROULETTE_TICK;
    function tick() {
        document.querySelectorAll('.killer-card').forEach(c => c.classList.remove('card-focus'));
        const tickKillerId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
        const el = document.getElementById(`killer-${tickKillerId}`);
        if (el) el.classList.add('card-focus');
        ticks++;
        if (ticks < 20) {
            speed += 20;
            setTimeout(tick, speed);
        } else {
            document.querySelectorAll('.killer-card').forEach(c => c.classList.remove('card-focus'));
            const wEl = document.getElementById(`killer-${winner.id}`);
            if (wEl) {
                wEl.classList.add('card-focus', 'card-focus-final');
                wEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(() => {
                document.querySelectorAll('.killer-card').forEach(c => c.classList.remove('no-candidato'));
                btn.disabled = false;
                openKillerAction(winner.id);
            }, 1500);
        }
    }
    tick();
}