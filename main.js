// ================== TARS Voice Assistant JS ==================

// ======== Initialization ========
const textInput = document.getElementById('text-input');
const inputForm = document.getElementById('input-form');
const chatWindow = document.getElementById('chat-window');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const voiceSelect = document.getElementById('voice-select');
const rateRange = document.getElementById('rate-range');
const pitchRange = document.getElementById('pitch-range');
const rateValue = document.getElementById('rate-value');
const pitchValue = document.getElementById('pitch-value');
const tarsVoicePresetBtn = document.getElementById('tars-voice-preset');
const speechOutputToggle = document.getElementById('speech-output-toggle');

let selectedVoice;
let voices = [];
let speechOutput = speechOutputToggle.checked;

// ======== Voice Synthesis Setup ========
function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [default]' : ''}`;
    voiceSelect.appendChild(option);
  });
  // Try preferred TARS voice
  let tarsVoice = voices.find(v => /david|fred|robot|en[-_]?us/i.test(v.name));
  const saved = localStorage.getItem('tars_voice');
  if (saved && voices.find(v => v.name === saved)) {
    voiceSelect.value = saved;
    selectedVoice = voices.find(v => v.name === saved);
  } else if (tarsVoice) {
    voiceSelect.value = tarsVoice.name;
    selectedVoice = tarsVoice;
  } else if (voices[0]) {
    voiceSelect.value = voices[0].name;
    selectedVoice = voices[0];
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = populateVoices;
  populateVoices();
  voiceSelect.onchange = () =>
    selectedVoice = voices.find(v => v.name === voiceSelect.value);
}

// ======== TARS Voice Preset Button ========
tarsVoicePresetBtn.onclick = () => {
  // Try to find a TARS-like voice
  let tarsVoice = voices.find(v => /david|fred|robot|en[-_]?us/i.test(v.name));
  if (tarsVoice) {
    voiceSelect.value = tarsVoice.name;
    selectedVoice = tarsVoice;
  } else if (voices[0]) {
    voiceSelect.value = voices[0].name;
    selectedVoice = voices[0];
  }
  rateRange.value = 0.95;
  pitchRange.value = 0.82;
  rateValue.textContent = rateRange.value;
  pitchValue.textContent = pitchRange.value;
  saveSettings();
  systemMessage("TARS voice preset applied.");
};

// ======== Speech Recognition ========
let recognizing = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onstart = () => micBtn.classList.add('active');
  recognition.onend = () => micBtn.classList.remove('active');
  recognition.onerror = e => {
    micBtn.classList.remove('active');
    alert('Voice recognition error: ' + e.error);
  };
  recognition.onresult = e => {
    const transcript = Array.from(e.results)
      .map(r => r[0])
      .map(r => r.transcript)
      .join('');
    textInput.value = transcript;
    textInput.focus();
  };
  micBtn.onclick = () => {
    if (recognizing) {
      recognition.stop();
      recognizing = false;
    } else {
      recognition.start();
      recognizing = true;
    }
  };
} else {
  micBtn.disabled = true;
  micBtn.title = "Speech recognition not supported";
}

// ======== Speech Synthesis ========
function speak(text) {
  if (!window.speechSynthesis || !speechOutput) return;
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.voice = selectedVoice || voices[0];
  utter.lang = utter.voice ? utter.voice.lang : 'en-US';
  utter.rate = Number(rateRange.value || 1);
  utter.pitch = Number(pitchRange.value || 1.1);
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
}

// ======== Chat Logic ========
function addMessage(role, text, store=true) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  if (role === 'assistant' && speechOutput) {
    speak(text);
  }
  if (store && window.localStorage) {
    // Implement chat history storage if needed
  }
}

inputForm.onsubmit = (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  if (text) {
    addMessage('user', text);
    textInput.value = '';
    // Simulate TARS response (replace with real AI call)
    setTimeout(() => addMessage('assistant', "I'm TARS. How can I help you?"), 700);
  }
};

rateRange.oninput = () => {
  rateValue.textContent = rateRange.value;
  saveSettings();
};
pitchRange.oninput = () => {
  pitchValue.textContent = pitchRange.value;
  saveSettings();
};
speechOutputToggle.onchange = () => {
  speechOutput = speechOutputToggle.checked;
  saveSettings();
};

function saveSettings() {
  if (window.localStorage) {
    localStorage.setItem('tars_voice', voiceSelect.value);
    localStorage.setItem('tars_rate', rateRange.value);
    localStorage.setItem('tars_pitch', pitchRange.value);
    localStorage.setItem('tars_speech_output', speechOutput ? "1" : "0");
  }
}

function systemMessage(msg) {
  addMessage('system', msg, false);
}

// ======== Space Music Controls Addition ========
document.addEventListener('DOMContentLoaded', function () {
  // Space music audio controls
  const audio = document.getElementById('space-audio');
  const audioToggle = document.getElementById('audio-toggle');
  if (audio && audioToggle) {
    audio.volume = 0.6; // Comfortable background level

    let muted = false;
    audioToggle.onclick = () => {
      muted = !muted;
      audio.muted = muted;
      audioToggle.textContent = muted ? '🔇 Unmute Music' : '🔊 Mute Music';
    };

    // For mobile browsers: enable music after first user gesture
    function enableAudioOnGesture() {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
      document.removeEventListener('touchstart', enableAudioOnGesture);
      document.removeEventListener('click', enableAudioOnGesture);
    }
    document.addEventListener('touchstart', enableAudioOnGesture);
    document.addEventListener('click', enableAudioOnGesture);
  }
});

// ========== End of main.js ==========
