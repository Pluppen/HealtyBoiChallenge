const audioPlayerContainer = document.getElementById('audio-player-container');
const volumeSlider = document.getElementById('volume-slider');
const muteIconContainer = document.getElementById('mute-icon');
let muteState = 'unmute';

//const playAnimation = lottieWeb.loadAnimation({
//  container: playIconContainer,
//  path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json',
//  renderer: 'svg',
//  loop: false,
//  autoplay: false,
//  name: "Play Animation",
//});

//const muteAnimation = lottieWeb.loadAnimation({
//    container: muteIconContainer,
//    path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json',
//    renderer: 'svg',
//    loop: false,
//    autoplay: false,
//    name: "Mute Animation",
//});

muteIconContainer.addEventListener('click', () => {
    if(muteState === 'unmute') {
        //muteAnimation.playSegments([0, 15], true);
        muteIconContainer.innerText = 'Unmute'
        audio.muted = true;
        muteState = 'mute';
    } else {
        //muteAnimation.playSegments([15, 25], true);
        audio.muted = false;
        muteState = 'unmute';
        muteIconContainer.innerText = 'Mute'
    }
});

const showRangeProgress = (rangeInput) => {
    audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

volumeSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});

/** Implementation of the functionality of the audio player */

const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const currentTimeContainer = document.getElementById('current-time');
const outputContainer = document.getElementById('volume-output');
let raf = null;

volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;

    outputContainer.textContent = value;
    audio.volume = value / 100;
});
