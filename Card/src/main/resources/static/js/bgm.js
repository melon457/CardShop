const YOUTUBE_VIDEO_ID = 'IYYpLHBu-kY';

let player;
let isPlaying = false;
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'loop': 1,
      'playlist': YOUTUBE_VIDEO_ID
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  const savedTime = localStorage.getItem('bgm_time');
  const savedState = localStorage.getItem('bgm_playing');

  if (savedTime) {
    player.seekTo(parseFloat(savedTime));
  }

  if (savedState === 'true') {
    player.playVideo();
    isPlaying = true;
    updateBgmButton();
  }

  setInterval(() => {
    if (player && player.getCurrentTime) {
      localStorage.setItem('bgm_time', player.getCurrentTime());
    }
  }, 1000);
}

function toggleBGM() {
  if (!player) return;

  if (isPlaying) {
    player.pauseVideo();
    isPlaying = false;
    localStorage.setItem('bgm_playing', 'false');
  } else {
    player.playVideo();
    isPlaying = true;
    localStorage.setItem('bgm_playing', 'true');
  }
  updateBgmButton();
}

function updateBgmButton() {
  const btn = document.getElementById('bgm-toggle-btn');
  if (btn) {
    btn.innerText = isPlaying ? '🎵 BGM OFF' : '🎵 BGM ON';
  }
}