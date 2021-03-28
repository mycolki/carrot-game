const $playButton = document.querySelector('.play-button');
const $replayButton = document.querySelector('.replay-button');
const $remainingCarrots = document.querySelector('.remaining-carrot');
const $remainingSec = document.querySelector('.remaining-time');
const $resultWindow = document.querySelector('.result-window__container');
const $resultComment = document.querySelector('.result-comment');
const $playGround = document.querySelector('.play-ground');

const $effectSounds = document.querySelectorAll('audio');
const [alert, bg, bug_pull, carrot_pull, game_win] = $effectSounds;

let numbOfCarrots = 10;
let numOfBugs = 20;

const startingNumOfCarrots = numbOfCarrots;
const DISPLAY_NONE = 'display--none';
const GAME_COMMENT = {
  CLICKED_ALL_CARROTS: 'SUCCESS! Carrots are Yours.',
  CLICKED_BUG: 'FAIL! Bugs will have all carrots.'
};

function handleReplayBtnClick() {
  $resultWindow.classList.add(DISPLAY_NONE);
  $playGround.innerHTML = '';
  $remainingCarrots.textContent = startingNumOfCarrots;
  $effectSounds[1].play();
  numbOfCarrots = startingNumOfCarrots;

  startTimeLimit()
}

function showResultWindow(timerID) {
  $resultWindow.classList.remove(DISPLAY_NONE);
  clearInterval(timerID);

  if (!numbOfCarrots) {
    $effectSounds[4].play();
    $resultComment.textContent = GAME_COMMENT.CLICKED_ALL_CARROTS;
  } else {
    $resultComment.textContent = GAME_COMMENT.CLICKED_BUG;
  }

  $replayButton.addEventListener('click', handleReplayBtnClick);
}

function handleCarrotClick(ev, timerID) {
  numbOfCarrots--;
  ev.target.remove();
  $effectSounds[3].play();
  $remainingCarrots.textContent = numbOfCarrots;

  !numbOfCarrots && showResultWindow(timerID);
}

function arrangeBugs(timerID) {
  for (let i = 0; i < numOfBugs; i++) {
    const bug = document.createElement('span');
    const location = makeRandomLocation(bug);

    $playGround.append(bug);
    bug.className = 'bug';
    bug.style.transform = `translate(${location.x}px, ${location.y}px)`;

    bug.addEventListener('click', () => {
      $effectSounds[2].play();
      showResultWindow(timerID);
    });
  }
}

function arrangeCarrots(timerID) {
  for (let i = 0; i < numbOfCarrots; i++) {
    const carrot = document.createElement('span');
    const randomLocation = makeRandomLocation(carrot);

    $playGround.append(carrot);
    carrot.className = 'carrot';
    carrot.style.transform = `translate(${randomLocation.x}px, ${randomLocation.y}px)`;

    carrot.addEventListener('click', ev => {
      handleCarrotClick(ev, timerID)
    });
  }
}

function makeRandomLocation(carrotOrBug) {
  const $body = document.querySelector('body');
  const randomNumberX = Math.floor(Math.random() * $body.clientWidth - 80);
  const randomNumberY = Math.floor(Math.random() * 240);

  const carrotOrBugX = Math.abs(randomNumberX - carrotOrBug.getBoundingClientRect().x);
  const carrotOrBugY = Math.abs(randomNumberY - carrotOrBug.getBoundingClientRect().y);

  const randomLocation = { x: carrotOrBugX, y: carrotOrBugY };
  return randomLocation;
}

function startTimeLimit() {
  let time = 10;
  $remainingSec.textContent = time;
  $remainingCarrots.textContent = numbOfCarrots;

  timerID = setInterval(function () {
    time--;
    $remainingSec.textContent = time;

    if (time < 1) {
      clearInterval(timerID);
      showResultWindow();
    }
  }, 1000);

  arrangeCarrots(timerID);
  arrangeBugs(timerID);
}

function handlePlayGame() {
  $effectSounds[1].play();
  $playButton.removeEventListener('click', handlePlayGame);
  $playButton.addEventListener('click', () => {
    $effectSounds[0].play();
  });

  startTimeLimit();
}

function startIntro() {
  $remainingCarrots.textContent = startingNumOfCarrots;
  $playButton.addEventListener('click', handlePlayGame);
}

startIntro();
