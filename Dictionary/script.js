const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const speechBtn = document.getElementById("speech-btn");
const inpWord = document.getElementById("inp-word");

btn.addEventListener("click", searchWord);
speechBtn.addEventListener("click", startSpeechRecognition);

function searchWord() {
  const word = inpWord.value.trim();
  if (word === "") {
    result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
    return;
  }

  fetch(`${url}${word}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWordDetails(word, data);
    })
    .catch(() => {
      result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
    });
}

function displayWordDetails(word, data) {
  result.innerHTML = `
    <div class="word">
      <h3>${word}</h3>
      <button onclick="playSound()">
        <i class="fas fa-volume-up"></i>
      </button>
    </div>
    <div class="details">
      <p>${data[0].meanings[0].partOfSpeech}</p>
      <p>/${data[0].phonetic}/</p>
    </div>
    <p class="word-meaning">
      ${data[0].meanings[0].definitions[0].definition}
    </p>
    <p class="word-example">
      ${data[0].meanings[0].definitions[0].example || ""}
    </p>`;
  sound.setAttribute("src", `https:${data[0].phonetics[0].audio}`);
}

function playSound() {
  // Check if Audio is supported
  if ("HTMLAudioElement" in window) {
    const audio = new Audio();
    audio.src = sound.src;

    // Play the audio
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  } else {
    console.error("Audio playback not supported in this browser.");
  }
}

function startSpeechRecognition() {
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.addEventListener("result", (event) => {
      const transcript = event.results[0][0].transcript;
      inpWord.value = transcript;
      searchWord();
    });

    recognition.addEventListener("error", (event) => {
      console.error("Speech recognition error:", event.error);
    });

    recognition.start();
  } else {
    console.error("Speech recognition not supported in this browser.");
  }
}
