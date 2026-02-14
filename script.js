// Initialize configuration
const config = window.VALENTINE_CONFIG;

let noScale = 1;
let yesScale = 1;

// Validate configuration
function validateConfig() {
    const warnings = [];
    if (!config.valentineName) {
        config.valentineName = "My love";
    }
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    validateConfig();

    // Set texts from config
    document.getElementById('valentineTitle').textContent = `${config.valentineName}, in 2000 years`;
    
    // Set first question texts
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;
    
    // Set second question texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;
    
    // Set third question texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    createFloatingElements();
    setupMusicPlayer();
    initLoveMeter();
});

// Create floating hearts and bears
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });
    config.floatingEmojis.bears.forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

// --- PERBAIKAN UTAMA: Agar tidak kosong dan di tengah ---
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => {
        q.classList.add('hidden');
        q.style.display = 'none'; // Pastikan yang lama benar-benar hilang
    });

    const nextQ = document.getElementById(`question${questionNumber}`);
    if (nextQ) {
        nextQ.classList.remove('hidden');
        // Gunakan flex agar isi di dalamnya otomatis ke tengah
        nextQ.style.display = 'flex'; 
        nextQ.style.flexDirection = 'column';
        nextQ.style.alignItems = 'center';
        nextQ.style.justifyContent = 'center';
    }
}

// Function to move the "No" button
function moveButton(button) {
    if (button.id === 'noBtn3') {
        const yesBtn = document.getElementById('yesBtn3');
        noScale -= 0.1;
        if (noScale < 0.3) noScale = 0.3;
        button.style.transform = `scale(${noScale})`;

        yesScale += 0.4;
        yesBtn.style.transform = `scale(${yesScale})`;
        
        button.style.transition = "all 0.3s ease";
        yesBtn.style.transition = "all 0.3s ease";
    }

    // Pindah posisi acak di area tengah layar (aman)
    const minX = window.innerWidth * 0.2;
    const maxX = window.innerWidth * 0.8 - button.offsetWidth;
    const minY = window.innerHeight * 0.2;
    const maxY = window.innerHeight * 0.8 - button.offsetHeight;

    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;
    
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
    button.style.zIndex = "1000";
}

function initLoveMeter() {
    const loveMeter = document.getElementById('loveMeter');
    const loveValue = document.getElementById('loveValue');
    const nextBtn = document.getElementById('nextBtn');
    const extraLove = document.getElementById('extraLove');

    if (!loveMeter) return;

    loveMeter.value = 0;
    loveValue.textContent = "0";
    nextBtn.style.display = 'none';

    loveMeter.addEventListener('input', () => {
        const value = parseInt(loveMeter.value);
        const max = parseInt(loveMeter.max);

        if (value < max) {
            loveValue.textContent = value.toLocaleString();
            nextBtn.style.display = 'none';
            extraLove.classList.add('hidden');
        } else {
            loveValue.textContent = "∞"; 
            loveValue.style.color = "#ff4d6d";
            extraLove.textContent = "Love has exceeded all limits!";
            extraLove.classList.remove('hidden');
            nextBtn.style.display = 'block';
            nextBtn.style.margin = "20px auto"; // Agar tombol di tengah
        }
    });
}

function celebrate() {
    // 1. Sembunyikan semua section pertanyaan sebelumnya
    document.querySelectorAll('.question-section').forEach(q => {
        q.classList.add('hidden');
        q.style.display = 'none';
    });

    // 2. Tampilkan container celebration
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    celebration.style.display = 'flex';
    celebration.style.flexDirection = 'column';
    celebration.style.alignItems = 'center';
    
    // 3. Isi teks dari config
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    
    // 4. MENGUBAH EMOJI MENJADI GIF
    // Kita ganti textContent menjadi innerHTML agar bisa membaca tag <img>
    const emojiArea = document.getElementById('celebrationEmojis');
    emojiArea.innerHTML = `
        <img src="https://media.tenor.com/VhCWjJwTXNAAAAAi/happy-happy-happy.gif" 
             alt="Happy Valentine GIF" 
             style="width: 100px; height: 100px; margin-top: 15px; border-radius: 20px;">
    `;
    
    // 5. Jalankan efek hati
    createHeartExplosion();
}

function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart';
        document.querySelector('.floating-elements').appendChild(heart);
        setRandomPosition(heart);
    }
}

function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    if (!config.music.enabled) {
        musicControls.style.display = 'none';
        return;
    }

    musicSource.src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText;
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText;
        }
    });
}
