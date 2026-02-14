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

    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;

    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;

    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    createFloatingElements();
    setupMusicPlayer();
    initLoveMeter();
});

// ================= FLOATING =================
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    [...config.floatingEmojis.hearts, ...config.floatingEmojis.bears].forEach(e => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = e;
        div.style.left = Math.random() * 100 + 'vw';
        div.style.animationDelay = Math.random() * 5 + 's';
        div.style.animationDuration = 10 + Math.random() * 20 + 's';
        container.appendChild(div);
    });
}

// ================= QUESTIONS =================
function showNextQuestion(n) {
    document.querySelectorAll('.question-section').forEach(q => {
        q.classList.add('hidden');
        q.style.display = 'none';
    });

    const next = document.getElementById(`question${n}`);
    next.classList.remove('hidden');
    next.style.display = 'flex';
    next.style.flexDirection = 'column';
    next.style.alignItems = 'center';
}

// ================= NO BUTTON =================
function moveButton(btn) {
    if (btn.id === 'noBtn3') {
        const yesBtn = document.getElementById('yesBtn3');
        noScale = Math.max(0.3, noScale - 0.1);
        yesScale += 0.4;
        btn.style.transform = `scale(${noScale})`;
        yesBtn.style.transform = `scale(${yesScale})`;
    }

    btn.style.position = 'fixed';
    btn.style.left = Math.random() * 70 + 15 + 'vw';
    btn.style.top = Math.random() * 60 + 20 + 'vh';
}

// ================= LOVE METER =================
function initLoveMeter() {
    const meter = document.getElementById('loveMeter');
    const value = document.getElementById('loveValue');
    const nextBtn = document.getElementById('nextBtn');
    const extra = document.getElementById('extraLove');

    meter.value = 0;
    value.textContent = '0';
    nextBtn.style.display = 'none';

    meter.addEventListener('input', () => {
        if (+meter.value < +meter.max) {
            value.textContent = meter.value;
            extra.classList.add('hidden');
            nextBtn.style.display = 'none';
        } else {
            value.textContent = '∞';
            extra.textContent = 'Love has exceeded all limits!';
            extra.classList.remove('hidden');
            nextBtn.style.display = 'block';
        }
    });
}

// ================= CELEBRATION =================
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));

    const c = document.getElementById('celebration');
    c.classList.remove('hidden');
    c.innerHTML = `
        <h2>${config.celebration.title}</h2>
        <p>${config.celebration.message}</p>
        <img src="https://media.tenor.com/VhCWjJwTXNAAAAAi/happy-happy-happy.gif"
             style="width:100px;border-radius:20px;margin:15px 0">
    `;

    const btn = document.createElement('button');
    btn.textContent = 'Are you really love me? 😋';
    btn.className = 'cute-btn';
    btn.onclick = startMinesweeper;
    c.appendChild(btn);
}

// ================= MINESWEEPER =================
function getCellSize() {
    return Math.min(Math.floor((window.innerWidth - 40) / minesweeperSize), 60);
}

function startMinesweeper() {
    const celebration = document.getElementById('celebration');
    const game = document.getElementById('minesweeper');

    celebration.classList.add('hidden');
    game.classList.remove('hidden');
    game.innerHTML = '<h2>Prove Your Love 💣❤️</h2>';

    if (!minesweeperBombs) {
        minesweeperBombs = new Set();
        while (minesweeperBombs.size < minesweeperBombCount) {
            minesweeperBombs.add(Math.floor(Math.random() * 25));
        }
    }

    const size = getCellSize();
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(5, ${size}px)`;
    grid.style.gap = '6px';

    let gameOver = false;

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('button');
        cell.style.width = size + 'px';
        cell.style.height = size + 'px';
        cell.style.fontSize = size * 0.45 + 'px';

        cell.onclick = () => {
            if (gameOver || cell.disabled) return;
            if (minesweeperBombs.has(i)) {
                cell.textContent = '💣';
                gameOver = true;
                showGameOver(game, grid);
            } else {
                cell.textContent = '❤️';
                cell.disabled = true;
            }
        };

        grid.appendChild(cell);
    }

    game.appendChild(grid);
}

function showGameOver(container, grid) {
    [...grid.children].forEach((c, i) => {
        if (minesweeperBombs.has(i)) c.textContent = '💣';
    });

    const btn = document.createElement('button');
    btn.textContent = 'Try Again';
    btn.className = 'cute-btn';
    btn.onclick = () => {
        minesweeperBombs = null;
        startMinesweeper();
    };

    container.appendChild(btn);
}

// ================= MUSIC =================
function setupMusicPlayer() {
    if (!config.music.enabled) return;

    const toggle = document.getElementById('musicToggle');
    const music = document.getElementById('bgMusic');
    document.getElementById('musicSource').src = config.music.musicUrl;
    music.load();

    toggle.onclick = () => {
        music.paused ? music.play() : music.pause();
    };
}
