function startRoulette() {
    const btn = document.getElementById('btn-roulette');
    btn.disabled = true;
    let candidates = survivors.filter(s => s.lastRound !== currentRound);
    if (candidates.length === 0) {
        currentRound++;
        saveCurrentRound(currentRound);
        candidates = survivors.filter(s => s.lastRound !== currentRound);
    }
    if (candidates.length === 0) {
        candidates = [...survivors];
    }
    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    const candidateIds = candidates.map(c => c.id);
    document.querySelectorAll('.survivor-card').forEach(card => {
        const id = parseInt(card.id.split('-')[1]);
        if (!candidateIds.includes(id)) card.classList.add('no-candidato');
    });
    let ticks = 0;
    let speed = ANIMATION_DURATIONS.ROULETTE_TICK;
    function tick() {
        document.querySelectorAll('.survivor-card').forEach(c => c.classList.remove('card-focus'));
        const tickSurvivorId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
        const el = document.getElementById(`survivor-${tickSurvivorId}`);
        if (el) el.classList.add('card-focus');
        ticks++;
        if (ticks < 20) {
            speed += 20;
            setTimeout(tick, speed);
        } else {
            document.querySelectorAll('.survivor-card').forEach(c => c.classList.remove('card-focus'));
            const wEl = document.getElementById(`survivor-${winner.id}`);
            if (wEl) {
                wEl.classList.add('card-focus', 'card-focus-final');
                wEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setTimeout(() => {
                document.querySelectorAll('.survivor-card').forEach(c => c.classList.remove('no-candidato'));
                btn.disabled = false;
                openSurvivorAction(winner.id);
            }, 1500);
        }
    }
    tick();
}