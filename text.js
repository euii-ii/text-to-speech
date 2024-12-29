const synth = window.speechSynthesis;
const textToConvert = document.getElementById('textToConvert');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const pauseBtn = document.getElementById('pauseBtn');
const progressBar = document.getElementById('progressBar');
const voiceSelect = document.getElementById('voiceSelect');
const speedSelect = document.getElementById('speedSelect');
const volumeSelect = document.getElementById('volumeSelect');

let isPaused = false;
let currentUtterance = null;
let voices = [];

function populateVoices() {
    voices = synth.getVoices();
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = voice.name;
        voiceSelect.appendChild(option);
    });
}

function speakText() {
    if (textToConvert.value.trim() === '') {
        document.querySelector('.error-para').textContent = 'Please enter some text to convert to speech.';
        return;
    }
    document.querySelector('.error-para').textContent = '';
    
    currentUtterance = new SpeechSynthesisUtterance(textToConvert.value);
    currentUtterance.voice = voices.find(voice => voice.name === voiceSelect.value);
    currentUtterance.rate = speedSelect.value;
    currentUtterance.volume = volumeSelect.value;

    currentUtterance.onstart = () => {
        progressBar.style.width = '0%';
    };

    currentUtterance.onboundary = (event) => {
        const progress = (event.charIndex / textToConvert.value.length) * 100;
        progressBar.style.width = progress + '%';
    };

    synth.speak(currentUtterance);
}

function pauseSpeech() {
    if (synth.speaking) {
        synth.pause();
        isPaused = true;
    } else if (isPaused) {
        synth.resume();
        isPaused = false;
    }
}

function clearText() {
    textToConvert.value = '';
}

convertBtn.addEventListener('click', speakText);
clearBtn.addEventListener('click', clearText);
pauseBtn.addEventListener('click', pauseSpeech);

// Populate voice options on load
window.addEventListener('load', populateVoices);
