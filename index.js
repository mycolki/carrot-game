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
}

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
  $effectSounds[3].play();
  numbOfCarrots--;
  ev.target.remove();
  $remainingCarrots.textContent = numbOfCarrots;
  !numbOfCarrots && showResultWindow(timerID);
}

function arrangeBugs(timerID) {
  for (let i = 0; i < numOfBugs; i++) {
    const bugImg = document.createElement('span');
    const bugLocationX = makeRandomCoordinate().x;
    const bugLocationY = makeRandomCoordinate().y;

    $playGround.append(bugImg);
    bugImg.className = 'bug';
    bugImg.style.transform = `translate(${bugLocationX}px, ${bugLocationY}px)`;

    bugImg.addEventListener('click', () => {
      $effectSounds[2].play();
      showResultWindow(timerID);
    });
  }
}

function arrangeCarrots(timerID) {
  for (let i = 0; i < numbOfCarrots; i++) {
    const carrotImg = document.createElement('span');
    const carrotLocationX = makeRandomCoordinate().x;
    const carrotLocationY = makeRandomCoordinate().y;

    $playGround.append(carrotImg);
    carrotImg.className = 'carrot';
    carrotImg.style.transform = `translate(${carrotLocationX}px, ${carrotLocationY}px)`;
    $remainingCarrots.textContent = numbOfCarrots;

    carrotImg.addEventListener('click', ev => {
      handleCarrotClick(ev, timerID)
    });
  }
}

function makeRandomCoordinate() {
  const body = document.querySelector('body');
  const randomLocationX = Math.floor(Math.random() * body.clientWidth-50);
  const randomLocationY = Math.floor(Math.random() * 270);
  const randomLocation = { x: randomLocationX, y: randomLocationY };

  return randomLocation;
}

function startTimeLimit() {
  let time = 10;
  $remainingSec.textContent = time;

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

function handleStartGame() {
  $effectSounds[1].play();
  $playButton.removeEventListener('click', handleStartGame);
  $playButton.addEventListener('click', () => {
    $effectSounds[0].play();
  });

  startTimeLimit();
}

function startIntro() {
  $remainingCarrots.textContent = startingNumOfCarrots;
  $playButton.addEventListener('click', handleStartGame);
}

startIntro();
