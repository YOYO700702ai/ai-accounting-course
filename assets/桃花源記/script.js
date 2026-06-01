const ASSET_PATH = "assets/";
const ASSET_VERSION = "20260601-village";

const levels = [
  {
    chapter: "桃花林",
    scene: "scene1.png",
    explain: "explain1.png",
    answer: [
      { text: "緣溪行", image: "cards/l1-01.png" },
      { text: "忘路之遠近", image: "cards/l1-02.png" },
      { text: "忽逢桃花林", image: "cards/l1-03.png" },
      { text: "夾岸數百步", image: "cards/l1-04.png" }
    ],
    prose: "沿著溪水前行，不知不覺忘了路途的遠近；忽然遇上一整片桃花林，夾著兩岸延伸數百步。"
  },
  {
    chapter: "落英",
    scene: "scene2.png",
    explain: "explain2.png",
    answer: [
      { text: "中無雜樹", image: "cards/l2-01.png" },
      { text: "芳草鮮美", image: "cards/l2-02.png" },
      { text: "落英繽紛", image: "cards/l2-03.png" }
    ],
    prose: "林中沒有別的雜樹，芳草鮮嫩美麗，落下的花瓣紛紛揚揚，繽紛滿地。"
  },
  {
    chapter: "水源",
    scene: "scene3.png",
    explain: "explain3.png",
    answer: [
      { text: "漁人甚異之", image: "cards/l3-01.png" },
      { text: "復前行", image: "cards/l3-02.png" },
      { text: "欲窮其林", image: "cards/l3-03.png" },
      { text: "林盡水源", image: "cards/l3-04.png" }
    ],
    prose: "漁人對眼前景象感到十分驚奇，繼續往前走，想走到桃花林的盡頭；走著走著，桃林在溪水的源頭處到了盡頭。"
  },
  {
    chapter: "山口",
    scene: "scene4.png",
    explain: "explain4.png",
    answer: [
      { text: "便得一山", image: "cards/l4-01.png" },
      { text: "山有小口", image: "cards/l4-02.png" },
      { text: "彷彿若有光", image: "cards/l4-03.png" }
    ],
    prose: "於是出現一座山，山上有個小洞口，洞裡彷彿透著一絲光亮。"
  },
  {
    chapter: "入口",
    scene: "scene5.png",
    explain: "explain5.png",
    answer: [
      { text: "便捨船", image: "cards/l5-01.png" },
      { text: "從口入", image: "cards/l5-02.png" },
      { text: "初極狹", image: "cards/l5-03.png" },
      { text: "才通人", image: "cards/l5-04.png" },
      { text: "復行數十步", image: "cards/l5-05.png" },
      { text: "豁然開朗", image: "cards/l5-06.png" }
    ],
    prose: "漁人離開船，從洞口走進去。起初洞口極為狹窄，僅能容一個人通過；又走了數十步，眼前忽然變得開闊明亮。"
  }
];

const els = {
  game: document.getElementById("game"),
  sceneImage: document.getElementById("sceneImage"),
  titleScreen: document.getElementById("titleScreen"),
  playLayer: document.getElementById("playLayer"),
  puzzlePanel: document.getElementById("puzzlePanel"),
  answerTrack: document.getElementById("answerTrack"),
  resetButton: document.getElementById("resetButton"),
  messageToast: document.getElementById("messageToast"),
  petalLayer: document.getElementById("petalLayer"),
  explainLayer: document.getElementById("explainLayer"),
  explainImage: document.getElementById("explainImage"),
  explainText: document.getElementById("explainText"),
  endingScreen: document.getElementById("endingScreen")
};

let currentLevel = 0;
let chips = [];
let selectedChipIds = [];
let locked = false;
let explanationTimer = null;
let typeTimer = null;
let toastTimer = null;

setSceneImage("cover.png", false);

els.titleScreen.addEventListener("click", beginGame);
els.titleScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") beginGame();
});
els.resetButton.addEventListener("click", resetCurrentArrangement);
els.endingScreen.addEventListener("click", enterVillage);
els.endingScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") enterVillage();
});

function beginGame() {
  if (els.titleScreen.hidden) return;
  els.titleScreen.hidden = true;
  startLevel(0);
}

function startLevel(index) {
  currentLevel = index;
  locked = false;
  selectedChipIds = [];
  chips = createChips(levels[index]);
  clearTimers();
  hideToast();
  closePuzzlePanel(true);
  els.game.classList.remove("vignette", "flash");
  els.explainLayer.hidden = true;
  els.explainLayer.classList.remove("visible");
  els.endingScreen.hidden = true;
  els.endingScreen.classList.remove("visible");
  els.playLayer.innerHTML = "";
  setSceneImage(levels[index].scene, true);
  window.setTimeout(() => {
    renderPuzzlePanel();
    renderScatteredWords();
  }, 580);
}

function setSceneImage(file, animate) {
  els.sceneImage.className = "scene-image";
  const nextSource = assetUrl(file);
  const reveal = () => {
    els.sceneImage.classList.add("visible");
    if (animate) els.sceneImage.classList.add("kenburns");
  };
  els.sceneImage.onload = reveal;
  els.sceneImage.src = nextSource;
  if (els.sceneImage.complete) reveal();
}

function createChips(level) {
  const source = level.answer.map((item, index) => ({
    id: `${currentLevel}-${index}`,
    text: item.text,
    image: item.image,
    answerIndex: index,
    used: false
  }));
  let shuffled = shuffle(source);
  let attempts = 0;
  while (shuffled.every((chip, index) => chip.answerIndex === index) && attempts < 12) {
    shuffled = shuffle(source);
    attempts += 1;
  }
  if (shuffled.every((chip, index) => chip.answerIndex === index) && shuffled.length > 1) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

function renderPuzzlePanel() {
  els.puzzlePanel.hidden = false;
  els.puzzlePanel.className = "puzzle-panel open";
  renderAnswerTokens();
}

function renderScatteredWords() {
  const positions = makeScatterPositions(chips.length);
  chips.forEach((chip, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "word-card";
    card.dataset.chipId = chip.id;
    card.setAttribute("aria-label", chip.text);
    card.style.left = `${positions[index].x}%`;
    card.style.top = `${positions[index].y}%`;
    card.style.animationDelay = `${positions[index].delay}s`;
    card.appendChild(createCardImage(chip));
    card.addEventListener("click", () => selectChip(chip.id));
    els.playLayer.appendChild(card);
  });
}

function renderAnswerTokens(newChipId = null) {
  els.answerTrack.innerHTML = "";
  selectedChipIds.forEach((chipId, index) => {
    const chip = chips.find((item) => item.id === chipId);
    const token = document.createElement("button");
    token.type = "button";
    token.className = "answer-token";
    if (chipId === newChipId) token.classList.add("arrived");
    token.dataset.index = String(index);
    token.dataset.chipId = chip.id;
    token.setAttribute("aria-label", chip.text);
    token.appendChild(createCardImage(chip));
    token.addEventListener("click", () => removeSelectedChip(index));
    els.answerTrack.appendChild(token);
  });
}

function createCardImage(chip) {
  const img = document.createElement("img");
  img.className = "card-image";
  img.src = assetUrl(chip.image);
  img.alt = chip.text;
  img.draggable = false;
  return img;
}

function selectChip(chipId) {
  if (locked) return;
  const chip = chips.find((item) => item.id === chipId);
  if (!chip || chip.used) return;

  chip.used = true;
  selectedChipIds.push(chip.id);
  const sourceEl = getChipElement(chip.id);
  if (sourceEl) sourceEl.classList.add("used");
  renderAnswerTokens(chip.id);
  const targetEl = els.answerTrack.querySelector(`[data-chip-id="${chip.id}"]`);
  if (sourceEl && targetEl) animateChipFlight(sourceEl, targetEl, chip);

  if (selectedChipIds.length === levels[currentLevel].answer.length) {
    window.setTimeout(validateArrangement, 440);
  }
}

function removeSelectedChip(index) {
  if (locked) return;
  const [chipId] = selectedChipIds.splice(index, 1);
  const chip = chips.find((item) => item.id === chipId);
  if (chip) chip.used = false;
  const sourceEl = getChipElement(chipId);
  if (sourceEl) sourceEl.classList.remove("used");
  renderAnswerTokens();
  hideToast();
}

function resetCurrentArrangement() {
  if (locked) return;
  selectedChipIds.forEach((chipId) => {
    const chip = chips.find((item) => item.id === chipId);
    if (chip) chip.used = false;
    const sourceEl = getChipElement(chipId);
    if (sourceEl) sourceEl.classList.remove("used");
  });
  selectedChipIds = [];
  renderAnswerTokens();
  hideToast();
}

function validateArrangement() {
  if (locked) return;
  const selectedText = selectedChipIds.map((chipId) => chips.find((chip) => chip.id === chipId).text);
  const correct = levels[currentLevel].answer.every((item, index) => selectedText[index] === item.text);

  if (!correct) {
    els.puzzlePanel.classList.remove("wrong");
    void els.puzzlePanel.offsetWidth;
    els.puzzlePanel.classList.add("wrong");
    showToast("順序不太對，再想想原文句序");
    return;
  }

  passLevel();
}

async function passLevel() {
  locked = true;
  hideToast();

  els.puzzlePanel.classList.add("leaving");
  [...els.playLayer.children].forEach((card) => card.classList.add("leaving"));
  createPetals(currentLevel === 1 ? 92 : 48);
  await wait(540);
  closePuzzlePanel(true);
  els.playLayer.innerHTML = "";

  await wait(2100);
  await runTransition(currentLevel);
  closePuzzlePanel(true);
  showExplanation(currentLevel);
}

function closePuzzlePanel(immediate = false) {
  if (immediate) {
    els.puzzlePanel.hidden = true;
    els.puzzlePanel.className = "puzzle-panel";
    els.answerTrack.innerHTML = "";
  } else {
    els.puzzlePanel.classList.add("leaving");
  }
}

async function runTransition(index) {
  els.sceneImage.classList.remove("kenburns");
  els.sceneImage.classList.add(`transition-${index + 1}`);
  if (index === 3) els.game.classList.add("vignette");
  if (index === 4) els.game.classList.add("flash");
  if (index === 1) createPetals(130);
  if (index === 0) createPetals(52);
  await wait(index === 4 ? 4500 : 4200);
}

function showExplanation(index) {
  const level = levels[index];
  els.explainImage.src = assetUrl(level.explain);
  els.explainText.textContent = "";
  els.explainLayer.hidden = false;
  window.requestAnimationFrame(() => els.explainLayer.classList.add("visible"));

  typeText(level.prose, els.explainText, () => {
    explanationTimer = window.setTimeout(goNext, 3000);
  });

  const clickToContinue = () => goNext();
  window.setTimeout(() => {
    els.explainLayer.addEventListener("click", clickToContinue, { once: true });
  }, 650);

  function goNext() {
    clearTimers();
    els.explainLayer.removeEventListener("click", clickToContinue);
    els.explainLayer.classList.remove("visible");
    window.setTimeout(() => {
      els.explainLayer.hidden = true;
      if (index + 1 < levels.length) {
        startLevel(index + 1);
      } else {
        showEnding();
      }
    }, 620);
  }
}

function showEnding() {
  locked = true;
  els.playLayer.innerHTML = "";
  closePuzzlePanel(true);
  els.game.classList.remove("vignette", "flash");
  setSceneImage("village.png", true);
  createPetals(72);
  els.endingScreen.hidden = false;
  window.requestAnimationFrame(() => els.endingScreen.classList.add("visible"));
}

function enterVillage() {
  // TODO: 此處接續「桃花村」另一個遊戲，可改為跳轉網址或載入下一個場景。
  showToast("待續：桃花村遊戲尚未接續。");
}

window.enterVillage = enterVillage;

function animateChipFlight(sourceEl, targetEl, chip) {
  const source = sourceEl.getBoundingClientRect();
  const target = targetEl.getBoundingClientRect();
  const clone = document.createElement("div");
  clone.className = "flying-card";
  clone.style.left = `${source.left}px`;
  clone.style.top = `${source.top}px`;
  clone.style.width = `${source.width}px`;
  clone.style.height = `${source.height}px`;
  clone.appendChild(createCardImage(chip));
  document.body.appendChild(clone);

  const dx = target.left + target.width / 2 - source.left - source.width / 2;
  const dy = target.top + target.height / 2 - source.top - source.height / 2;
  window.requestAnimationFrame(() => {
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.86)`;
    clone.style.opacity = "0";
  });
  window.setTimeout(() => clone.remove(), 460);
}

function makeScatterPositions(count) {
  const positions = [];
  let guard = 0;
  while (positions.length < count && guard < 400) {
    guard += 1;
    const x = 7 + Math.random() * 67;
    const y = 12 + Math.random() * 53;
    const tooClose = positions.some((pos) => Math.abs(pos.x - x) < 16 && Math.abs(pos.y - y) < 13);
    if (!tooClose) {
      positions.push({
        x,
        y,
        delay: Number((Math.random() * -1.6).toFixed(2))
      });
    }
  }

  while (positions.length < count) {
    positions.push({
      x: 8 + positions.length * 11,
      y: 18 + (positions.length % 3) * 14,
      delay: -positions.length * 0.16
    });
  }

  return positions;
}

function createPetals(count) {
  for (let i = 0; i < count; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--fall-time", `${2 + Math.random() * 1.6}s`);
    petal.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
    petal.style.setProperty("--spin", `${160 + Math.random() * 360}deg`);
    petal.style.animationDelay = `${Math.random() * 0.85}s`;
    petal.style.opacity = `${0.55 + Math.random() * 0.38}`;
    els.petalLayer.appendChild(petal);
    window.setTimeout(() => petal.remove(), 4600);
  }
}

function typeText(text, target, done) {
  let index = 0;
  const tick = () => {
    target.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      typeTimer = window.setTimeout(tick, 34);
    } else if (done) {
      done();
    }
  };
  tick();
}

function getChipElement(chipId) {
  return els.playLayer.querySelector(`[data-chip-id="${chipId}"]`);
}

function showToast(message) {
  els.messageToast.textContent = message;
  els.messageToast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(hideToast, 2400);
}

function hideToast() {
  els.messageToast.classList.remove("visible");
}

function clearTimers() {
  window.clearTimeout(explanationTimer);
  window.clearTimeout(typeTimer);
  window.clearTimeout(toastTimer);
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function assetUrl(file) {
  return `${ASSET_PATH}${file}?v=${ASSET_VERSION}`;
}
