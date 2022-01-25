// gameVars
let guessStr;
let game;
let correctAns;
let outcome;
const stats = {
  gamesPlayed: 0,
  wins: 0,
  curStreak: 0,
  maxStreak: 0,
  spread: [0, 0, 0, 0, 0, 0],
};
initGame();

// elements
const statsBtn = document.getElementById("statsBtn");
const resetBtn = document.getElementById("resetBtn");
const keys = document.getElementsByClassName("key");
const gridItems = document.getElementsByClassName("box");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const gamesStat = document.getElementById("s1");
const winsStat = document.getElementById("s2");
const curStat = document.getElementById("s3");
const maxStat = document.getElementById("s4");
const distribs = document.getElementsByClassName("distrib");

// functions
function initGame() {
  if (stats.gamesPlayed > 0) {
    // set all blocks gray and clear letters
    for (let el of gridItems) {
      el.setAttribute("class", "box");
      el.textContent = "";
    }
    // set all keys gray
    for (let el of keys) {
      el.setAttribute("class", "key");
    }
    // set all stat bars grey
    for (let i = 0; i < stats.spread.length; i++) {
      distribs[i].style.backgroundColor = "rgb(80, 80, 80)";
    }
    closeModal();
  }
  outcome = "loss";
  guessStr = "";
  game = 0;
  correctAns = fetchWord();
}
function fetchWord() {
  const words = ["split", "prawn", "crimp", "bongo", "slide", "moods", "grape"];

  return words[Math.floor(Math.random() * words.length)];
}
function typeFunc() {
  if (game < 6) {
    if (this.id === "backspace") {
      if (guessStr === "") return;
      gridItems[game * 5 + guessStr.length - 1].textContent = "";
      guessStr = guessStr.slice(0, guessStr.length - 1);
    } else if (this.id === "enter") {
      if (guessStr === "") return;
      submitGuess();
    } else {
      if (guessStr.length < 5) {
        gridItems[game * 5 + guessStr.length].textContent = this.id;
        guessStr += this.id;
      }
    }
  }
}
function submitGuess() {
  if (game < 6) {
    // allow a guess
    let guess = guessStr;
    if (guess.length > 5) {
      return;
    }
    checkGuess(guess);
    game++;
    guessStr = "";
  }
}
function checkGuess(guess) {
  // loop through guess letters
  console.log(guess.length);
  for (let i = 0; i < guess.length; i++) {
    curBox = document.getElementById(`r${game + 1}c${i + 1}`);
    let letter = guess[i];
    keyboardLetter = document.getElementById(letter);
    curBox.textContent = letter;

    // check each letter
    // if letter in word
    if (correctAns.includes(letter)) {
      curBox.classList.add("present");
      keyboardLetter.classList.add("present");

      // if letter in correct place
      if (correctAns[i] === letter) {
        curBox.classList.add("correct");
        keyboardLetter.classList.add("correct");
      }
      // letter not in word
    } else {
      curBox.classList.add("wrong");
      keyboardLetter.classList.add("wrong");
    }
  }
  if (guess === correctAns) outcome = "win";
  if (game >= 5 || outcome === "win") endGame(outcome);
}
function endGame(outcome) {
  // update stats object
  if (outcome === "win") {
    stats.wins += 1;
    stats.spread[game] += 1;
    stats.curStreak += 1;
    stats.maxStreak =
      stats.curStreak > stats.maxStreak ? stats.curStreak : stats.maxStreak;
  } else {
    stats.curStreak = 0;
  }
  stats.gamesPlayed += 1;

  // update modal stats
  gamesStat.textContent = stats.gamesPlayed;
  winsStat.textContent = Math.trunc((stats.wins / stats.gamesPlayed) * 100);
  curStat.textContent = stats.curStreak;
  maxStat.textContent = stats.maxStreak;

  // show modal
  showModal();
}
function closeModal() {
  modal.classList.add("hidden");
}
function showModal() {
  // get highest part of win distribution to determine bar lengths
  let maxDist = Math.max(...stats.spread);
  if (maxDist === 0) maxDist = 1;

  // update dist numbers, highlight current, update widths
  for (let i = 0; i < stats.spread.length; i++) {
    distribs[i].textContent = stats.spread[i];
    if (outcome === "win" && i === game)
      distribs[i].style.backgroundColor = "rgb(68, 116, 68";
    distribs[i].style.width = `${
      Math.trunc((distribs[i].textContent / maxDist) * 100) + 5
    }%`;
  }
  modal.classList.remove("hidden");
}
// event listeners
statsBtn.addEventListener("click", showModal);
resetBtn.addEventListener("click", initGame);
closeModalBtn.addEventListener("click", closeModal);
for (el of keys) {
  el.addEventListener("click", typeFunc);
}

// endGame();
// alt+semicolon gives emojis!
