// ================= CONFIG =================
const config = window.VALENTINE_CONFIG;

let noScale = 1;
let yesScale = 1;

let minesweeperBombs = null;
const minesweeperSize = 5;
const minesweeperBombCount = 5;

// ================= INIT =================
document.title = config.pageTitle;

window.addEventListener('DOMContentLoaded', () => {
    if (!config.valentineName) config.valentineName = "My love";

    document.getElementById('valentineTitle').textContent =
        `${config.valentineName}, in 2000 years`;

    // Question 1
    questionText('question1', config.questions.first);
    // Question 2
    questionText('question2', config.questions.second);
    // Question 3
    questionText('question3', config.questions.third);

    createFloatingElements();
    setupMusicPlayer();
    initLoveMeter();
});

// ================= HELPERS =================
function questionText(id, data) {
    const q = document.getElementById(id);
    if (!q) return;

    q.querySelector('h2').textContent = data.text;
    if (data.yesBtn) q.querySelector('[id^="yes"]').textContent = data.yesBtn;
    if (data.noBtn) q.querySelector('[id^="no"]').textContent = data.noBtn;
    if (data.secretAnswer)
        document.getElementById('secretAnswerBtn').textContent = data.secretAnswer;
}

// ================= FLOW =================
function showNextQuestion(num) {
    document.querySelectorAll('.question-section').forEach(q => {
        q.classList.add('hidden');
        q.style.display = 'none';
    });

    const next = document.getElementById(`question${num}`);
    if (!next) return;

    next.classList.remove('hidden');
    next.style.display = 'flex';
    next.style.flexDirection = 'column';
    next.style.alignItems = 'center';
}

// ================= BUTTON EVASIVE =================
function moveButton(btn) {
    if (btn.id === 'noBtn3') {
        const yes = document.getElementById('yesBtn3');
        noScale = Math.max(0.3, noScale - 0.1);
        yesScale += 0.4;

        btn.style.transform = `scale(${noScale})`;
        yes.style.transform = `scale(${yesScale})`;
    }

    const x = Math.random() * (window.innerWidth * 0.6) + window.innerWidth * 0.2;
    const y = Math.random() * (window.innerHeight * 0.5) + window.innerHeight * 0.2;

    btn.style.position = 'fixed';
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
}

// ================= LOVE METER =================
function initLoveMeter() {
    const meter = document.getElementById('loveMeter');
    if (!meter) return;

    const value = document.getElementById('loveValue');
    const nextBtn = document.getElementById('nextBtn');
    const extra = document.getElementById('extraLove');

    meter.value = 0;
    nextBtn.style.display = 'none';

    meter.addEventListener('input', () => {
        if (+meter.value < +meter.max) {
            value.textContent = meter.value;
            extra.classList.add('hidden');
            nextBtn.style.display = 'none';
        } else {
            value.textContent = "∞";
            extra.textContent = "Love beyond limits ❤️";
            extra.classList.remove('hidden');
            nextBtn.style.display = 'block';
        }
    });
}

// ================= CELEBRATION =================
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => {
        q.style.display = 'none';
    });

    const c = document.getElementById('celebration');
    c.classList.remove('hidden');
    c.style.display = 'flex';
    c.style.flexDirection = 'column';
    c.style.alignItems = 'center';

    document.getElementById('celebrationTitle').textContent =
        config.celebration.title;
    document.getElementById('celebrationMessage').textContent =
        config.celebration.message;

    document.getElementById('celebrationEmojis').innerHTML = `
        <img src="https://media.tenor.com/VhCWjJwTXNAAAAAi/happy-happy-happy.gif"
             style="width:100px;border-radius:16px;margin-top:10px;">
    `;

    addProveLoveButton();
}

// ================= PROVE LOVE BUTTON =================
function addProveLoveButton() {
    const c = document.getElementById('celebration');

    const btn = document.createElement('button');
    btn.textContent = 'Are you really love me? 😋';
    btn.className = 'cute-btn';

    btn.onclick = () => {
        c.style.display = 'none';
        startMinesweeper();
    };

    c.appendChild(btn);
}

// ================= MINESWEEPER =================
function startMinesweeper() {
    const game = document.getElementById('minesweeper');
    game.classList.remove('hidden');
    game.innerHTML = `<h2>Prove Your Love 💣❤️</h2>`;

    let gameOver = false;

    if (!minesweeperBombs) {
        minesweeperBombs = new Set();
        while (minesweeperBombs.size < minesweeperBombCount) {
            minesweeperBombs.add(
                Math.floor(Math.random() * minesweeperSize ** 2)
            );
        }
    }

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${minesweeperSize}, 60px)`;
    grid.style.gap = '8px';
    grid.style.marginTop = '20px';

    for (let i = 0; i < minesweeperSize ** 2; i++) {
        const cell = document.createElement('button');
        cell.style.width = '60px';
        cell.style.height = '60px';
        cell.style.fontSize = '26px';
        cell.style.borderRadius = '12px';

        cell.onclick = () => {
            if (gameOver || cell.disabled) return;

            if (minesweeperBombs.has(i)) {
                cell.textContent = '💣';
                gameOver = true;
                revealBombs(grid);
                game.appendChild(gameOverUI());
            } else {
                cell.textContent = '❤️';
                cell.disabled = true;
            }
        };

        grid.appendChild(cell);
    }

    game.appendChild(grid);
}

function revealBombs(grid) {
    minesweeperBombs.forEach(i => {
        grid.children[i].textContent = '💣';
    });
}

function gameOverUI() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<p>Boom 💥 Try again!</p>`;

    const retry = document.createElement('button');
    retry.textContent = 'Try Again';
    retry.className = 'cute-btn';

    retry.onclick = () => startMinesweeper();

    wrap.appendChild(retry);
    return wrap;
}

// ================= MUSIC =================
function setupMusicPlayer() {
    const toggle = document.getElementById('musicToggle');
    const music = document.getElementById('bgMusic');
    const source = document.getElementById('musicSource');

    if (!config.music.enabled) return;

    source.src = config.music.musicUrl;
    music.volume = config.music.volume || 0.5;
    music.load();

    toggle.onclick = () => {
        if (music.paused) {
            music.play();
            toggle.textContent = config.music.stopText;
        } else {
            music.pause();
            toggle.textContent = config.music.startText;
        }
    };
}

// ================= FLOATING =================
function createFloatingElements() {
    const c = document.querySelector('.floating-elements');
    [...config.floatingEmojis.hearts, ...config.floatingEmojis.bears]
        .forEach(e => {
            const d = document.createElement('div');
            d.innerHTML = e;
            d.className = 'heart';
            d.style.left = Math.random() * 100 + 'vw';
            d.style.animationDuration = 10 + Math.random() * 20 + 's';
            c.appendChild(d);
        });
}
