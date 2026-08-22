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
  {
    title: "maach",
    artist: "afshin",
    cover: "./covers/afshin.jpg",
    source: "./songs/maach.mp3",
  },
  {
    title: "yavare hamishe momen",
    artist: "dariush",
    cover: "./covers/dariush.jpg",
    source: "./songs/yavare-hamishe-momen.mp3",
  },
  {
    title: "mara cheshmist khoon afshan",
    artist: "shajarian",
    cover: "./covers/shajarian.jpg",
    source: "./songs/mara-cheshmist-khoon-afshan.mp3",
  },
  {
    title: "saghi",
    artist: "hayedeh",
    cover: "./covers/hayedeh.jpg",
    source: "./songs/saghi.mp3",
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
const themeToggle = document.getElementById("theme-toggle");
const theme = localStorage.getItem("theme-mode");
const isPlay = document.getElementById("cover");
const state = document.getElementById("state");
let stateIcon = document.getElementById("state-icon");
let savedState = localStorage.getItem("music-state");
if (savedState === "repeat") {
  stateIcon.classList.remove("fa-list-ol");
  stateIcon.classList.add("fa-repeat");
} else if (savedState === "shuffle") {
  stateIcon.classList.remove("fa-list-ol");
  stateIcon.classList.add("fa-shuffle");
}
if (theme === "dark-mode") {
  document.body.classList.add(theme);
  document.getElementById("header-btn").classList.add("fa-sun");
} else {
  document.body.classList.add(theme);
  document.getElementById("header-btn").classList.add("fa-moon");
}
const musicVolume = localStorage.getItem("music-volume");
volume.value = musicVolume === null ? 50 : musicVolume;
audio.volume = volume.value / 100;
let previousVolume = volume.value;
let isShuffle = savedState === "shuffle";
let isRepeat = savedState === "repeat";
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
  item.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
    songInfo.tabIndex = 0;
    songInfo.addEventListener("click", (event) => {
      loadSong(index);
      audio.play();
      isPlaying = true;
      isPlay.classList.add("is-play");
      isPlay.style.animationPlayState = "running";
      document.getElementById("status-icon").classList.remove("fa-circle-play");
      document.getElementById("status-icon").classList.add("fa-circle-pause");
    });
    songInfo.addEventListener("keydown", (event) => {
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        songInfo.click();
      }
    });
    songInfo.appendChild(artistTitle);
    playlist.appendChild(songInfo);
  });
}
function changeVolumeIcon() {
  audio.volume = volume.value / 100;
  let volumeIcon = document.getElementById("volume-icon");
  localStorage.setItem("music-volume", volume.value);
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
}
function getRandomNumber() {
  let nextSong = Math.floor(Math.random() * songsList.length);
  while (nextSong === currentIndex) {
    nextSong = Math.floor(Math.random() * songsList.length);
  }
  return nextSong;
}
document.getElementById("play").addEventListener("click", () => {
  const playBtnIcon = document.getElementById("status-icon");
  if (!isPlaying) {
    audio.play();
    playBtnIcon.classList.remove("fa-circle-play");
    playBtnIcon.classList.add("fa-circle-pause");
    isPlaying = true;
    isPlay.classList.add("is-play");
    isPlay.style.animationPlayState = "running";
  } else {
    audio.pause();
    playBtnIcon.classList.remove("fa-circle-pause");
    playBtnIcon.classList.add("fa-circle-play");
    isPlaying = false;
    isPlay.style.animationPlayState = "paused";
  }
});
document.addEventListener("keydown", (event) => {
  const active = document.activeElement.tagName;
  if (
    active === "INPUT" ||
    active === "TEXTAREA" ||
    (active === "BUTTON" && event.code === "Space")
  ) {
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    const playBtnIcon = document.getElementById("status-icon");
    if (!isPlaying) {
      audio.play();
      playBtnIcon.classList.remove("fa-circle-play");
      playBtnIcon.classList.add("fa-circle-pause");
      isPlaying = true;
      isPlay.style.animationPlayState = "running";
      isPlay.classList.add("is-play");
    } else {
      audio.pause();
      playBtnIcon.classList.remove("fa-circle-pause");
      playBtnIcon.classList.add("fa-circle-play");
      isPlaying = false;
      isPlay.style.animationPlayState = "paused";
    }
  } else if (!event.shiftKey && event.code === "ArrowRight") {
    event.preventDefault();
    if (isShuffle) {
      loadSong(getRandomNumber());
    } else {
      loadSong((currentIndex + 1) % songsList.length);
    }
    if (!isPlaying) {
      isPlay.classList.remove("is-play");
    }
  } else if (!event.shiftKey && event.code === "ArrowLeft") {
    event.preventDefault();
    if (isShuffle) {
      loadSong(getRandomNumber());
    } else {
      loadSong((currentIndex - 1 + songsList.length) % songsList.length);
    }
    if (!isPlaying) {
      isPlay.classList.remove("is-play");
    }
  } else if (event.code === "ArrowUp") {
    event.preventDefault();
    audio.volume = Math.min(1, audio.volume + 0.01);
    volume.value = audio.volume * 100;
    changeVolumeIcon();
  } else if (event.code === "ArrowDown") {
    event.preventDefault();
    audio.volume = Math.max(0, audio.volume - 0.01);
    volume.value = audio.volume * 100;
    changeVolumeIcon();
  } else if (
    event.shiftKey &&
    event.code === "ArrowRight" &&
    !isNaN(audio.duration) &&
    audio.duration !== 0
  ) {
    event.preventDefault();
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  } else if (
    event.shiftKey &&
    event.code === "ArrowLeft" &&
    !isNaN(audio.duration) &&
    audio.duration !== 0
  ) {
    event.preventDefault();
    audio.currentTime = Math.max(0, audio.currentTime - 5);
  }
});
document.getElementById("next").addEventListener("click", () => {
  if (isShuffle) {
    loadSong(getRandomNumber());
  } else {
    loadSong((currentIndex + 1) % songsList.length);
  }
  if (!isPlaying) {
    isPlay.classList.remove("is-play");
  }
});
document.getElementById("previous").addEventListener("click", () => {
  if (isShuffle) {
    loadSong(getRandomNumber());
  } else {
    loadSong((currentIndex - 1 + songsList.length) % songsList.length);
  }
  if (!isPlaying) {
    isPlay.classList.remove("is-play");
  }
});
audio.addEventListener("ended", () => {
  if (isRepeat) {
    loadSong(currentIndex);
  } else if (isShuffle) {
    loadSong(getRandomNumber());
  } else {
    loadSong((currentIndex + 1) % songsList.length);
  }
});
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = convertTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = convertTime(audio.currentTime);
  if (!isNaN(audio.duration) && audio.duration !== 0) {
    let progressPercent = (audio.currentTime / audio.duration) * 100;
    innerProgressBar.style.width = `${progressPercent}%`;
  }
});
document.getElementById("progress-bar").addEventListener("click", (event) => {
  if (!isNaN(audio.duration) && audio.duration !== 0) {
    let progressBar = event.currentTarget;
    let totalWidth = progressBar.clientWidth;
    let clickPosition = event.offsetX;
    audio.currentTime = (clickPosition / totalWidth) * audio.duration;
  }
});
volume.addEventListener("input", changeVolumeIcon);
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme-mode", "dark-mode");
    document.getElementById("header-btn").classList.remove("fa-moon");
    document.getElementById("header-btn").classList.add("fa-sun");
  } else {
    localStorage.setItem("theme-mode", "light-mode");
    document.getElementById("header-btn").classList.remove("fa-sun");
    document.getElementById("header-btn").classList.add("fa-moon");
  }
});
document.getElementById("volume-icon").addEventListener("click", () => {
  if (audio.volume > 0) {
    previousVolume = volume.value;
    volume.value = 0;
  } else {
    if (previousVolume === 0) {
      volume.value = 50;
    } else {
      volume.value = previousVolume;
    }
  }
  changeVolumeIcon();
});
state.addEventListener("click", () => {
  if (stateIcon.classList.contains("fa-list-ol")) {
    stateIcon.classList.remove("fa-list-ol");
    stateIcon.classList.add("fa-repeat");
    isShuffle = false;
    isRepeat = true;
    localStorage.setItem("music-state", "repeat");
  } else if (stateIcon.classList.contains("fa-repeat")) {
    stateIcon.classList.remove("fa-repeat");
    stateIcon.classList.add("fa-shuffle");
    isShuffle = true;
    isRepeat = false;
    localStorage.setItem("music-state", "shuffle");
  } else {
    stateIcon.classList.remove("fa-shuffle");
    stateIcon.classList.add("fa-list-ol");
    isShuffle = false;
    isRepeat = false;
    localStorage.setItem("music-state", "list");
  }
});
changeVolumeIcon();
renderPlaylist();
loadSong(0);
