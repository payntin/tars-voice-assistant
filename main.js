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

let chatHistory = [];
let voices = [];
let selectedVoice = null;
let speechOutput = true;

// ======== Settings ========
function saveSettings() {
  localStorage.setItem('tars_api_key', apiKeyInput.value);
  localStorage.setItem('tars_humor', humorRange.value);
  localStorage.setItem('tars_honesty', honestyRange.value);
  localStorage.setItem('tars_verbosity', verbosityRange.value);
  localStorage.setItem('tars_mission', missionMode.value);
  localStorage.setItem('tars_theme', themeSelect.value);
  localStorage.setItem('tars_voice', voiceSelect.value);
  localStorage.setItem('tars_rate', rateRange.value);
  localStorage.setItem('tars_pitch', pitchRange.value);
  localStorage.setItem('tars_speech_output', speechOutputToggle.checked ? '1' : '');
}
function loadSettings() {
  apiKeyInput.value = localStorage.getItem('tars_api_key') || '';
  humorRange.value = localStorage.getItem('tars_humor') || 50;
  honestyRange.value = localStorage.getItem('tars_honesty') || 90;
  verbosityRange.value = localStorage.getItem('tars_verbosity') || 2;
  missionMode.value = localStorage.getItem('tars_mission') || 'default';
  themeSelect.value = localStorage.getItem('tars_theme') || 'tars';
  rateRange.value = localStorage.getItem('tars_rate') || 1;
  pitchRange.value = localStorage.getItem('tars_pitch') || 1.1;
  humorValue.textContent = humorRange.value;
  honestyValue.textContent = honestyRange.value;
  verbosityValue.textContent = verbosityRange.value;
  rateValue.textContent = rateRange.value;
  pitchValue.textContent = pitchRange.value;
  speechOutputToggle.checked = !!localStorage.getItem('tars_speech_output') || true;
  speechOutput = speechOutputToggle.checked;
}
function applyTheme() {
  tarsContainer.className = 'theme-' + themeSelect.value;
}
function saveChatHistory() {
  localStorage.setItem('tars_chat', JSON.stringify(chatHistory));
}
function loadChatHistory() {
  const c = localStorage.getItem('tars_chat');
  chatHistory = c ? JSON.parse(c) : [];
  chatWindow.innerHTML = '';
  for (const {role, text} of chatHistory) {
    addMessage(role, text, false);
  }
  updateMissionLog();
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
function clearChatHistory() {
  chatHistory = [];
  saveChatHistory();
  chatWindow.innerHTML = '';
  updateMissionLog();
}
function clearSession() {
  localStorage.clear();
  chatHistory = [];
  chatWindow.innerHTML = '';
  loadSettings();
  updateMissionLog();
  systemMessage("Session cleared. API key and settings wiped.");
}

// ======== Sidebar Toggle ==========
function toggleCore(forceOpen) {
  if (forceOpen === true) {
    personalityCore.classList.remove('collapsed');
  } else if (forceOpen === false) {
    personalityCore.classList.add('collapsed');
  } else {
    personalityCore.classList.toggle('collapsed');
  }
}
coreToggle.onclick = () => toggleCore(false);
coreToggleMain.onclick = () => toggleCore();

// ======== Settings Events ==========
apiKeyInput.oninput = humorRange.oninput = honestyRange.oninput =
verbosityRange.oninput = missionMode.onchange =
themeSelect.onchange = rateRange.oninput = pitchRange.oninput =
voiceSelect.onchange = speechOutputToggle.onchange = () => {
  humorValue.textContent = humorRange.value;
  honestyValue.textContent = honestyRange.value;
  verbosityValue.textContent = verbosityRange.value;
  rateValue.textContent = rateRange.value;
  pitchValue.textContent = pitchRange.value;
  speechOutput = speechOutputToggle.checked;
  saveSettings();
  if (themeSelect) applyTheme();
};
themeSelect.onchange = applyTheme;
applyTheme();
loadSettings();
loadChatHistory();

// ======== Voices ========
function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';
  voices.forEach((v, i) => {
    const opt = document.createElement('option');
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
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
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  if (store) {
    chatHistory.push({role, text});
    saveChatHistory();
    updateMissionLog();
  }
  if (role === 'tars') speak(text);
  if (role === 'user') {
    lastUserMsg.textContent = "Last: " + text.slice(0, 36) + (text.length > 36 ? "..." : "");
  }
}
function systemMessage(text) {
  addMessage('tars', text);
}
inputForm.onsubmit = async function(e) {
  e.preventDefault();
  const userText = textInput.value.trim();
  if (!userText) return;
  addMessage('user', userText);
  textInput.value = '';
  await getTARSResponse(userText);
}
async function getTARSResponse(prompt) {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    systemMessage('Please enter your OpenAI API key in the Personality Core.');
    return;
  }
  addMessage('tars', '...');
  const humor = humorRange.value;
  const honesty = honestyRange.value;
  const verbosity = verbosityRange.value;
  const mission = missionMode.value;
  // TARS persona system prompt
  const sysPrompt =
`You are TARS, a highly intelligent, witty, and honest AI robot from Interstellar.
Your personality parameters are: Humor (${humor}/100), Honesty (${honesty}/100), Verbosity (${verbosity}), Mission Mode (${mission}).
Respond in concise, console-like style, and stay in character as TARS at all times.
If Humor is high, use dry wit. If Honesty is high, be brutally honest. Adjust detail level based on Verbosity.
If Mission Mode is "explorer", use scientific curiosity; "survival", be pragmatic; "humorist", maximize wit; otherwise, be default TARS.
Never break character.`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: "system", content: sysPrompt },
          ...chatHistory.slice(-10).map(m => ({role: m.role === 'user' ? 'user' : 'assistant', content: m.text})),
          { role: "user", content: prompt }
        ],
        temperature: Math.abs((humor - 50)/100) + 0.4,
        max_tokens: 500,
        stream: false
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    // Remove '...' bubble
    chatWindow.removeChild(chatWindow.lastChild);
    const reply = data.choices[0].message.content.trim();
    addMessage('tars', reply);
  } catch (err) {
    chatWindow.removeChild(chatWindow.lastChild);
    systemMessage('Error: ' + err.message);
  }
}

// ======== Emergency Quips ========
const emergencyQuips = [
  "This is the absolute best I can do right now.",
  "Honesty parameter: 100%. You are in trouble.",
  "Initiating humor protocol. Just kidding... or am I?",
  "I suggest running. Fast.",
  "I'm not authorized to save you, but I can provide emotional support.",
  "Murph! Just kidding. That's not your name.",
  "Would you like to hear a joke about singularities?",
  "Brace yourself. It's going to get bumpy."
];
emergencyBtn.onclick = () => {
  const quip = emergencyQuips[Math.floor(Math.random()*emergencyQuips.length)];
  addMessage('tars', quip);
};

// ======== Interstellar Facts ========
const interstellarFacts = [
  "TARS and CASE are both robots designed for the Endurance mission.",
  "TARS has adjustable humor and honesty settings, just like in this app.",
  "Bill Irwin performed both the voice and puppetry for TARS.",
  "The TARS robot was physically built and operated on set for realism.",
  "The docking scene in Interstellar is considered one of the greatest in sci-fi cinema.",
  "Interstellar's wormhole scenes were based on real physics equations.",
  "TARS can split into four blocks for mobility—hence the logo!",
  "The robots in Interstellar were inspired by 2001: A Space Odyssey's monolith."
];
interstellarFactBtn.onclick = () => {
  const fact = interstellarFacts[Math.floor(Math.random() * interstellarFacts.length)];
  systemMessage("Interstellar Fact: " + fact);
};

// ======== Export/Import ========
exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(chatHistory, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tars-chat-history.json';
  a.click();
};
importBtn.onclick = () => importFile.click();
importFile.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      chatHistory = JSON.parse(evt.target.result);
      saveChatHistory();
      loadChatHistory();
      systemMessage("Chat history imported.");
    } catch {
      alert('Invalid chat history file.');
    }
  };
  reader.readAsText(file);
};
clearHistoryBtn.onclick = () => {
  if (confirm('Clear all chat history?')) clearChatHistory();
};
clearSessionBtn.onclick = () => {
  if (confirm('Clear all settings, API key, and chat history?')) clearSession();
};

// ======== About Modal ========
aboutBtn.onclick = () => aboutModal.classList.remove('hidden');
closeAbout.onclick = () => aboutModal.classList.add('hidden');
aboutModal.onclick = (e) => {
  if (e.target === aboutModal) aboutModal.classList.add('hidden');
};

// ======== Mission Log ========
function updateMissionLog() {
  msgCount.textContent = chatHistory.length + " exchange" + (chatHistory.length === 1 ? "" : "s");
  if (chatHistory.length) {
    let last = chatHistory.slice().reverse().find(m => m.role === 'user');
    lastUserMsg.textContent = last ? "Last: " + last.text.slice(0, 36) + (last.text.length > 36 ? "..." : "") : "";
  } else {
    lastUserMsg.textContent = "";
  }
}

// ======== Keyboard Shortcuts ========
document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    if (!personalityCore.classList.contains('collapsed')) personalityCore.classList.add('collapsed');
    if (!aboutModal.classList.contains('hidden')) aboutModal.classList.add('hidden');
  }
  if (e.ctrlKey && (e.key === "m" || e.key === "M")) {
    if (micBtn && !micBtn.disabled) micBtn.click();
    e.preventDefault();
  }
  if (e.key === "Tab" && !e.shiftKey) {
    textInput.focus();
  }
});
textInput.addEventListener('focus', () => textInput.select());

// ======== Initial ========
toggleCore(false);

// ======== Space Music Mute/Unmute ========
const audio = document.getElementById('space-audio');
const audioToggle = document.getElementById('audio-toggle');

if (audio && audioToggle) {
  audioToggle.onclick = () => {
    audio.muted = !audio.muted;
    audioToggle.textContent = audio.muted ? "🔇 Unmute Music" : "🔊 Mute Music";
  };
  // Restore mute state from previous session if needed (optional)
  // audio.muted = localStorage.getItem('tars_music_muted') === '1';
  // audioToggle.textContent = audio.muted ? "🔇 Unmute Music" : "🔊 Mute Music";
  // audio.onvolumechange = () => {
  //   localStorage.setItem('tars_music_muted', audio.muted ? '1' : '');
  // };
}
// --- Fix for Logo Not Appearing ---
document.querySelectorAll('img[id^="tars-logo"]').forEach(img => {
  img.onerror = () => {
    img.style.display = "none";
  };
});
