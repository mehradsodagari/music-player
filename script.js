const songsList = [
  {
    title: "ghoroob",
    artist: "ghomeishi",
    cover: "./covers/ghomeishi.jpg",
    source: "./songs/ghoroob.mp3",
  },
  {
    title: "jomeh",
    artist: "farhad",
    cover: "./covers/farhad.jpg",
    source: "./songs/jomeh.mp3",
  },
  {
    title: "khaneh be doosh",
    artist: "sattar",
    cover: "./covers/sattar.jpg",
    source: "./songs/khane-be-doosh.mp3",
  },
];
let isPlaying = false;
let currentIndex = 0;
let currentSong = songsList[currentIndex];
const audio = document.getElementById("audio");
const duration = document.getElementById("duration");
const currentTime = document.getElementById("current-time");
const innerProgressBar = document.querySelector(".progress-bar-inner");
const volume = document.getElementById("volume");
const playlist = document.getElementById("playlist-list");
volume.value = 50;
audio.volume = 0.5;
function showCurrentSong() {
  const cover = document.getElementById("cover");
  const title = document.getElementById("title");
  const artist = document.getElementById("artist");
  audio.setAttribute("src", currentSong.source);
  cover.setAttribute("src", currentSong.cover);
  cover.setAttribute("alt", `${currentSong.title}-${currentSong.artist}`);
  title.textContent = currentSong.title;
  artist.textContent = currentSong.artist;
  active(playlist.querySelectorAll("li")[currentIndex]);
}
function active(item) {
  playlist
    .querySelectorAll("li")
    .forEach((li) => li.classList.remove("active"));
  item.classList.add("active");
}
function loadSong(newIndex) {
  currentIndex = newIndex;
  currentSong = songsList[currentIndex];
  showCurrentSong();
  if (isPlaying) {
    audio.play();
  }
}
function convertTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
function renderPlaylist() {
  songsList.forEach((song, index) => {
    let songInfo = document.createElement("li");
    let artistTitle = document.createElement("p");
    artistTitle.textContent = `${song.title} - ${song.artist}`;
    songInfo.addEventListener("click", (event) => {
      loadSong(index);
      audio.play();
      isPlaying = true;
      document.getElementById("status-icon").classList.remove("fa-circle-play");
      document.getElementById("status-icon").classList.add("fa-circle-pause");
    });
    songInfo.appendChild(artistTitle);
    playlist.appendChild(songInfo);
  });
}
document.getElementById("play").addEventListener("click", () => {
  const playBtnIcon = document.getElementById("status-icon");
  if (!isPlaying) {
    audio.play();
    playBtnIcon.classList.remove("fa-circle-play");
    playBtnIcon.classList.add("fa-circle-pause");
    isPlaying = true;
  } else {
    audio.pause();
    playBtnIcon.classList.remove("fa-circle-pause");
    playBtnIcon.classList.add("fa-circle-play");
    isPlaying = false;
  }
});
document.getElementById("next").addEventListener("click", () => {
  loadSong((currentIndex + 1) % songsList.length);
});
document.getElementById("previous").addEventListener("click", () => {
  loadSong((currentIndex - 1 + songsList.length) % songsList.length);
});
audio.addEventListener("ended", () => {
  loadSong((currentIndex + 1) % songsList.length);
});
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = convertTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = convertTime(audio.currentTime);
  let progressPercent = (audio.currentTime / audio.duration) * 100;
  innerProgressBar.style.width = `${progressPercent}%`;
});
document.getElementById("progress-bar").addEventListener("click", (event) => {
  let progressBar = event.currentTarget;
  let totalWidth = progressBar.clientWidth;
  let clickPosition = event.offsetX;
  audio.currentTime = (clickPosition / totalWidth) * audio.duration;
});
volume.addEventListener("input", () => {
  audio.volume = volume.value / 100;
  let volumeIcon = document.getElementById("volume-icon");
  if (audio.volume === 0) {
    volumeIcon.className = "";
    volumeIcon.classList.add("fas");
    volumeIcon.classList.add("fa-volume-mute");
  } else if (audio.volume <= 0.3) {
    volumeIcon.className = "";
    volumeIcon.classList.add("fas");
    volumeIcon.classList.add("fa-volume-low");
  } else if (audio.volume <= 0.7) {
    volumeIcon.className = "";
    volumeIcon.classList.add("fas");
    volumeIcon.classList.add("fa-volume-medium");
  } else {
    volumeIcon.className = "";
    volumeIcon.classList.add("fas");
    volumeIcon.classList.add("fa-volume-high");
  }
});
renderPlaylist();
loadSong(0);
