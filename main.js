// ======== Starfield Background ========
const starsBg = document.getElementById('stars-bg');
function createStars(n) {
  let html = "";
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const s = Math.random() * 1.3 + 0.7;
    const o = Math.random() * 0.5 + 0.5;
    html += `<div style="position:absolute;left:${x}vw;top:${y}vh;width:${s}px;height:${s}px;background:#fff;border-radius:50%;opacity:${o};"></div>`;
  }
  starsBg.innerHTML = html;
}
if (starsBg) createStars(120);

// ======== Elements ========
const chatWindow = document.getElementById('chat-window');
const inputForm = document.getElementById('input-form');
const textInput = document.getElementById('text-input');
const micBtn = document.getElementById('mic-btn');
const sendBtn = document.getElementById('send-btn');
const coreToggle = document.getElementById('core-toggle');
const coreToggleMain = document.getElementById('core-toggle-main');
const personalityCore = document.getElementById('personality-core');
const apiKeyInput = document.getElementById('api-key');
const humorRange = document.getElementById('humor-range');
const humorValue = document.getElementById('humor-value');
const honestyRange = document.getElementById('honesty-range');
const honestyValue = document.getElementById('honesty-value');
const verbosityRange = document.getElementById('verbosity-range');
const verbosityValue = document.getElementById('verbosity-value');
const missionMode = document.getElementById('mission-mode');
const themeSelect = document.getElementById('theme-select');
const aboutBtn = document.getElementById('about-btn');
const aboutModal = document.getElementById('about-modal');
const closeAbout = document.getElementById('close-about');
const clearHistoryBtn = document.getElementById('clear-history');
const exportBtn = document.getElementById('export-history');
const importBtn = document.getElementById('import-history');
const importFile = document.getElementById('import-file');
const voiceSelect = document.getElementById('voice-select');
const rateRange = document.getElementById('rate-range');
const pitchRange = document.getElementById('pitch-range');
const rateValue = document.getElementById('rate-value');
const pitchValue = document.getElementById('pitch-value');
const emergencyBtn = document.getElementById('emergency-btn');
const tarsContainer = document.getElementById('tars-container');
const tarsVoicePresetBtn = document.getElementById('tars-voice-preset');
const speechOutputToggle = document.getElementById('speech-output-toggle');
const clearSessionBtn = document.getElementById('clear-session');
const missionLog = document.getElementById('mission-log');
const msgCount = document.getElementById('msg-count');
const lastUserMsg = document.getElementById('last-user-msg');
const interstellarFactBtn = document.getElementById('interstellar-fact-btn');

// ======== Music Sidebar Toggle Integration ========
const audio = document.getElementById('space-audio');
const audioToggle = document.getElementById('audio-toggle');
const musicToggleStatus = document.getElementById('music-toggle-status');
let audioStarted = false;

// Restore mute state from previous session
if (audio) {
  audio.muted = localStorage.getItem('tars_music_muted') === '1';
  updateMusicUI();
}

function updateMusicUI() {
  if (!audio) return;
  if (audio.muted) {
    musicToggleStatus.textContent = "🔇";
    audioToggle.textContent = "Unmute Music";
  } else {
    musicToggleStatus.textContent = "🔊";
    audioToggle.textContent = "Mute Music";
  }
}

if (audio && audioToggle) {
  audioToggle.onclick = () => {
    audio.muted = !audio.muted;
    updateMusicUI();
    localStorage.setItem('tars_music_muted', audio.muted ? '1' : '');
    if (!audio.muted) {
      audio.play().then(() => {
        audioStarted = true;
        removeManualPlayBtn();
      }).catch(err => {
        showManualPlayBtn();
      });
    }
  };

  // Try to play on first user interaction with the toggle (for autoplay block)
  if (!audioStarted && !audio.muted) {
    audio.play().then(() => {
      audioStarted = true;
      removeManualPlayBtn();
    }).catch(err => {
      showManualPlayBtn();
    });
  }
}

// Manual play fallback if autoplay is blocked
function showManualPlayBtn() {
  if (document.getElementById('manual-play-music-btn')) return;
  const playBtn = document.createElement('button');
  playBtn.textContent = "▶️ Play Music";
  playBtn.id = 'manual-play-music-btn';
  playBtn.style.margin = "0.5em 0";
  playBtn.style.width = "100%";
  playBtn.onclick = () => {
    audio.play().then(() => {
      audioStarted = true;
      removeManualPlayBtn();
      audio.muted = false;
      updateMusicUI();
      localStorage.setItem('tars_music_muted', '');
    });
  };
  // Insert at the top of the sidebar section
  const sidebarSection = document.querySelector('#personality-core > section');
  if (sidebarSection) {
    sidebarSection.insertBefore(playBtn, sidebarSection.firstChild);
  }
}

function removeManualPlayBtn() {
  const btn = document.getElementById('manual-play-music-btn');
  if (btn) btn.remove();
}

// Also try to play as soon as user interacts with the page (for stricter browsers)
window.addEventListener*

