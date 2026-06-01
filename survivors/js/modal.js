function openSurvivorAction(id) {
    selectedSurvivorId = id;
    const s = survivors.find(x => x.id === id);
    document.getElementById('modal-img').src = s.img;
    document.getElementById('modal-title').innerText = s.name;
    document.getElementById('modal-rank-text').innerText = s.rank;
    const key = s.rank.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    document.getElementById('modal-rank-icon-bg').src = `img/rank_${key === 'iridiscente' ? 'iri' : key}.webp`;
    generateModalPerks(s);
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('action-modal').classList.add('visible');
}

function generateModalPerks(s) {
    const container = document.getElementById('modal-perks-container');
    container.innerHTML = '';
    const allExpertPerks = getAllSurvivorPerks();
    let pool = [...new Set([...GENERIC_POOL, ...allExpertPerks])];
    let result = [];
    for (let i = 0; i < 4; i++) {
        const options = [...pool, null];
        const pick = options[Math.floor(Math.random() * options.length)];
        result.push(pick);
        if (pick !== null) {
            pool = pool.filter(p => p !== pick);
        }
    }

    document.getElementById('modal-mission-title').innerText = 'Build Aleatoria';
    for (let i = 0; i < 4; i++) {
        const pN = result[i];
        container.innerHTML += `<div style="display:flex; flex-direction:column; align-items:center; width:140px;">
            <div class="perk-slot" id="slot-unit-${i}"><img src="img/perks/agil.png" class="perk-img-mod"></div>
            <div id="label-perk-${i}" class="perk-label-name" style="opacity:0;">${pN ? pN.replace(/_/g, ' ') : ''}</div>
        </div>`;
        animateSlot(`slot-unit-${i}`, `label-perk-${i}`, result[i], i * 1000);
    }
}

async function animateSlot(cId, lId, fP, d) {
    setTimeout(() => {
        const sU = document.getElementById(cId);
        if (!sU) return;
        const img = sU.querySelector('.perk-img-mod');
        const label = document.getElementById(lId);
        const pool = [...GENERIC_POOL, ...getAllSurvivorPerks()];
        img.classList.add('spinning-img');
        const start = Date.now();
        const interval = setInterval(() => {
            const temp = pool[Math.floor(Math.random() * pool.length)];
            img.src = `img/perks/${cleanForFilename(temp)}.png`;
            if (Date.now() - start > 1500 + d) {
                clearInterval(interval);
                img.classList.remove('spinning-img');
                if (fP) {
                    img.src = `img/perks/${cleanForFilename(fP)}.png`;
                } else {
                    sU.innerHTML = `<div style="transform:rotate(-45deg); color:rgba(255,255,255,0.15); font-family:'Orbitron',sans-serif; font-size:2rem; font-weight:700;">?</div>`;
                }
                label.style.opacity = 1;
            }
        }, 100);
    }, 10);
}