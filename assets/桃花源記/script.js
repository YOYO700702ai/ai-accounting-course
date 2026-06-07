const ASSET_PATH = "assets/";
const ASSET_VERSION = "20260601-village-dialogue";

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

const villageInteractions = [
  {
    id: "elder",
    name: "村中長者",
    image: "npc_elder.png",
    hotspot: { x: 28, y: 52 },
    line: "（見你大驚）客從何處來？此地與世隔絕已久……",
    options: ["我循溪而入，無意間來到此處", "我也說不清，彷彿做了一場夢"],
    response: "我等先祖避秦時之亂，率家人鄉鄰來此，自此不再出去，竟與外人隔絕了。",
    answer: [
      { text: "自云先世避秦時亂", image: "cards/v1-01.png" },
      { text: "率妻子邑人來此絕境", image: "cards/v1-02.png" },
      { text: "不復出焉", image: "cards/v1-03.png" },
      { text: "遂與外人間隔", image: "cards/v1-04.png" }
    ],
    prose: "他們說祖先為了躲避秦朝的戰亂，帶著妻子兒女和鄉鄰來到這與世隔絕的地方，從此不再出去，於是就跟外面的人斷了往來。"
  },
  {
    id: "farmer",
    name: "農夫",
    image: "npc_farmer.png",
    hotspot: { x: 62, y: 53 },
    line: "你是外鄉人吧？快告訴我——如今外頭是什麼世道？",
    options: ["如今已是晉朝了", "說來話長，朝代換了好幾輪"],
    response: "漢？魏？晉？這些朝代我們竟聞所未聞……",
    answer: [
      { text: "問今是何世", image: "cards/v2-01.png" },
      { text: "乃不知有漢", image: "cards/v2-02.png" },
      { text: "無論魏晉", image: "cards/v2-03.png" }
    ],
    prose: "他們問起現在是什麼朝代，竟然不知道有漢朝，更別說漢朝之後的魏朝和晉朝了。"
  },
  {
    id: "well",
    name: "井邊村民",
    image: "obj_well.png",
    hotspot: { x: 42, y: 68 },
    line: "井邊聚著幾位村民，見你來，個個又驚又喜……",
    options: ["叨擾了，我自溪外而來", "請別緊張，我並無惡意"],
    response: "村民見你，十分驚訝，連忙問你從何而來，要邀你到家中作客。",
    answer: [
      { text: "見漁人", image: "cards/v3-01.png" },
      { text: "乃大驚", image: "cards/v3-02.png" },
      { text: "問所從來", image: "cards/v3-03.png" },
      { text: "便要還家", image: "cards/v3-04.png" }
    ],
    prose: "村民看見漁人，十分驚訝，問他從哪裡來，隨即邀請他到家中作客。"
  },
  {
    id: "feast",
    name: "待客飯桌",
    image: "obj_feast.png",
    hotspot: { x: 73, y: 66 },
    line: "村民熱情張羅，擺酒殺雞，還喚來其他鄉鄰一同款待你……",
    options: ["如此盛情，實在感激", "叨擾各位了"],
    response: "他們設酒殺雞做飯，村裡其他人也都來邀你到家中作客。",
    answer: [
      { text: "設酒殺雞作食", image: "cards/v4-01.png" },
      { text: "餘人各復延至其家", image: "cards/v4-02.png" },
      { text: "皆出酒食", image: "cards/v4-03.png" }
    ],
    prose: "他們擺酒、殺雞、做飯招待漁人；村裡其他的人也各自邀請他到家中，都拿出酒菜來款待。"
  }
];

const farmhouseInteraction = {
  id: "farmhouse",
  name: "樸實村民",
  image: "npc_villager_humble.png",
  line: "客人，在我們這兒住了好些天啦。你要走了……有句話可得記著。",
  options: ["請說，我必記在心上", "這些日子，真是謝謝你們"],
  response: "外頭的事我們不問，我們這兒的事，也別對外人說起啊。",
  answer: [
    { text: "停數日", image: "cards/v5-01.png" },
    { text: "辭去", image: "cards/v5-02.png" },
    { text: "此中人語云", image: "cards/v5-03.png" },
    { text: "不足為外人道也", image: "cards/v5-04.png" }
  ],
  prose: "漁人停留了幾天後告辭離開。臨走時，村裡的人對他說：這裡的事，不值得對外面的人說啊。"
};

const finalPuzzle = {
  id: "farewell",
  answer: [
    { text: "既出", image: "cards/end-01.png" },
    { text: "處處誌之", image: "cards/end-02.png" },
    { text: "尋向所誌", image: "cards/end-03.png" },
    { text: "遂迷", image: "cards/end-04.png" },
    { text: "不復得路", image: "cards/end-05.png" }
  ],
  prose: "漁人出來後，沿途處處做了記號；後來再去尋找先前的記號，卻迷失了，再也找不到那條路了。"
};

const els = {
  game: document.getElementById("game"),
  sceneImage: document.getElementById("sceneImage"),
  titleScreen: document.getElementById("titleScreen"),
  bgMusic: document.getElementById("bgMusic"),
  musicToggle: document.getElementById("musicToggle"),
  villageLayer: document.getElementById("villageLayer"),
  playLayer: document.getElementById("playLayer"),
  puzzlePanel: document.getElementById("puzzlePanel"),
  answerTrack: document.getElementById("answerTrack"),
  resetButton: document.getElementById("resetButton"),
  dialogueLayer: document.getElementById("dialogueLayer"),
  dialogueImage: document.getElementById("dialogueImage"),
  dialogueName: document.getElementById("dialogueName"),
  dialogueText: document.getElementById("dialogueText"),
  dialogueOptions: document.getElementById("dialogueOptions"),
  messageToast: document.getElementById("messageToast"),
  petalLayer: document.getElementById("petalLayer"),
  explainLayer: document.getElementById("explainLayer"),
  explainImage: document.getElementById("explainImage"),
  explainText: document.getElementById("explainText"),
  endingScreen: document.getElementById("endingScreen")
};

let currentLevel = 0;
let currentPuzzle = null;
let chips = [];
let selectedChipIds = [];
let locked = false;
let endingMode = "enterVillage";
let villageCompleted = new Set();
let explanationTimer = null;
let typeTimer = null;
let toastTimer = null;

setSceneImage("cover.png", false);

els.musicToggle.addEventListener("click", toggleMusic);
els.titleScreen.addEventListener("click", beginGame);
els.titleScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") beginGame();
});
els.resetButton.addEventListener("click", resetCurrentArrangement);
els.endingScreen.addEventListener("click", handleEndingClick);
els.endingScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") handleEndingClick();
});

function beginGame() {
  if (els.titleScreen.hidden) return;
  els.titleScreen.hidden = true;
  startBackgroundMusic();
  startLevel(0);
}

let audioCtx = null;
let musicMuted = false;

function ensureAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function startBackgroundMusic() {
  if (!els.bgMusic) return;
  els.bgMusic.volume = 0.42;
  if (!musicMuted) {
    const promise = els.bgMusic.play();
    if (promise && promise.catch) promise.catch(() => {});
  }
  ensureAudioCtx();
}

function toggleMusic() {
  if (!els.bgMusic) return;
  musicMuted = !musicMuted;
  if (musicMuted) {
    els.bgMusic.pause();
    els.musicToggle.textContent = "♪ 靜音";
    els.musicToggle.setAttribute("aria-pressed", "false");
    els.musicToggle.setAttribute("aria-label", "開啟背景音樂");
    els.musicToggle.classList.add("muted");
  } else {
    const promise = els.bgMusic.play();
    if (promise && promise.catch) promise.catch(() => {});
    els.musicToggle.textContent = "♪ 音樂";
    els.musicToggle.setAttribute("aria-pressed", "true");
    els.musicToggle.setAttribute("aria-label", "關閉背景音樂");
    els.musicToggle.classList.remove("muted");
  }
}

function playPetalScatterSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  const bufferSize = Math.floor(ctx.sampleRate * 0.9);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 3200;
  bandpass.Q.value = 1.4;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.09, now + 0.06);
  noiseGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.85);
  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(now);
  noise.stop(now + 0.92);

  const tones = [1318.5, 1567.98, 1760.0, 2093.0];
  tones.forEach((freq, i) => {
    const start = now + i * 0.085 + Math.random() * 0.02;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.07, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.75);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + 0.82);
  });
}

function startLevel(index) {
  currentLevel = index;
  resetInteractiveLayers();
  setSceneImage(levels[index].scene, true);
  window.setTimeout(() => {
    startPuzzle({
      answer: levels[index].answer,
      onCorrect: async () => {
        await wait(2100);
        await runTransition(index);
        showExplanation(index);
      }
    });
  }, 580);
}

function startVillageGame() {
  els.titleScreen.hidden = true;
  villageCompleted = new Set();
  endingMode = "enterVillage";
  resetInteractiveLayers();
  setSceneImage("village_full.png", true);
  window.setTimeout(renderVillageHotspots, 520);
}

function renderVillageHotspots() {
  locked = false;
  els.villageLayer.innerHTML = "";
  els.villageLayer.hidden = false;

  villageInteractions.forEach((interaction) => {
    const completed = villageCompleted.has(interaction.id);
    const hotspot = createHotspot(interaction.name, interaction.hotspot.x, interaction.hotspot.y, completed);
    hotspot.addEventListener("click", () => {
      if (completed) {
        showToast("這段見聞已完成。");
        return;
      }
      openInteractionDialogue(interaction, () => startVillagePuzzle(interaction));
    });
    els.villageLayer.appendChild(hotspot);
  });

  if (villageCompleted.size >= villageInteractions.length) {
    const farmhouse = createHotspot("農戶家門", 84, 50, false);
    farmhouse.classList.add("farmhouse-hotspot");
    farmhouse.addEventListener("click", startFarmhouseScene);
    els.villageLayer.appendChild(farmhouse);
    showToast("農戶家門亮起了。");
  }
}

function createHotspot(label, x, y, completed) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "hotspot";
  if (completed) button.classList.add("completed");
  button.setAttribute("aria-label", label);
  button.style.left = `${x}%`;
  button.style.top = `${y}%`;
  return button;
}

function openInteractionDialogue(interaction, onContinue) {
  if (locked) return;
  locked = true;
  els.villageLayer.hidden = true;
  els.dialogueLayer.hidden = false;
  els.dialogueLayer.classList.add("visible");
  els.dialogueImage.src = assetUrl(interaction.image);
  els.dialogueImage.alt = interaction.name;
  els.dialogueName.textContent = interaction.name;
  els.dialogueText.textContent = "";
  els.dialogueOptions.innerHTML = "";
  typeText(interaction.line, els.dialogueText, () => renderDialogueOptions(interaction, onContinue));
}

function renderDialogueOptions(interaction, onContinue) {
  els.dialogueOptions.innerHTML = "";
  interaction.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dialogue-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      els.dialogueOptions.innerHTML = "";
      els.dialogueText.textContent = "";
      typeText(interaction.response, els.dialogueText, () => {
        const continueButton = document.createElement("button");
        continueButton.type = "button";
        continueButton.className = "dialogue-option continue-option";
        continueButton.textContent = "繼續";
        continueButton.addEventListener("click", () => {
          closeDialogue();
          onContinue();
        });
        els.dialogueOptions.appendChild(continueButton);
      });
    });
    els.dialogueOptions.appendChild(button);
  });
}

function closeDialogue() {
  els.dialogueLayer.classList.remove("visible");
  els.dialogueLayer.hidden = true;
  els.dialogueOptions.innerHTML = "";
  els.dialogueText.textContent = "";
}

function startVillagePuzzle(interaction) {
  startPuzzle({
    answer: interaction.answer,
    onCorrect: async () => {
      villageCompleted.add(interaction.id);
      await showVillageProse(interaction.prose);
      setSceneImage("village_full.png", true);
      window.setTimeout(renderVillageHotspots, 520);
    }
  });
}

function startFarmhouseScene() {
  if (locked) return;
  locked = true;
  els.villageLayer.hidden = true;
  setSceneImage("farmhouse_interior.png", true);
  window.setTimeout(() => {
    locked = false;
    openInteractionDialogue(farmhouseInteraction, () => {
      startPuzzle({
        answer: farmhouseInteraction.answer,
        onCorrect: async () => {
          await showVillageProse(farmhouseInteraction.prose);
          startFinalPuzzle();
        }
      });
    });
  }, 760);
}

function startFinalPuzzle() {
  showVillageExitScreen();
}

function showVillageExitScreen() {
  resetInteractiveLayers();
  els.titleScreen.hidden = true;
  endingMode = "exitVillage";
  setSceneImage("village_exit.png", true);
  createPetals(72);
  els.endingScreen.hidden = false;
  window.requestAnimationFrame(() => els.endingScreen.classList.add("visible"));
}

function startRouteMarkingPuzzle() {
  resetInteractiveLayers();
  setSceneImage("village_trace.png", true);
  window.setTimeout(() => {
    startPuzzle({
      answer: finalPuzzle.answer,
      onCorrect: async () => {
        await showVillageProse(finalPuzzle.prose);
        showFinalEnding();
      }
    });
  }, 700);
}

function startPuzzle(config) {
  currentPuzzle = config;
  locked = false;
  selectedChipIds = [];
  chips = createChips({ answer: config.answer });
  hideToast();
  closePuzzlePanel(true);
  els.playLayer.innerHTML = "";
  window.setTimeout(() => {
    renderPuzzlePanel();
    renderScatteredWords();
  }, 100);
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

function createChips(puzzle) {
  const source = puzzle.answer.map((item, index) => ({
    id: `${Date.now()}-${index}`,
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

  if (selectedChipIds.length === currentPuzzle.answer.length) {
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
  const correct = currentPuzzle.answer.every((item, index) => selectedText[index] === item.text);

  if (!correct) {
    els.puzzlePanel.classList.remove("wrong");
    void els.puzzlePanel.offsetWidth;
    els.puzzlePanel.classList.add("wrong");
    showToast("順序不太對，再想想原文句序");
    return;
  }

  passPuzzle();
}

async function passPuzzle() {
  locked = true;
  hideToast();
  playPetalScatterSound();
  els.puzzlePanel.classList.add("leaving");
  [...els.playLayer.children].forEach((card) => card.classList.add("leaving"));
  createPetals(chips.length >= 5 ? 72 : 48);
  await wait(540);
  closePuzzlePanel(true);
  els.playLayer.innerHTML = "";
  await currentPuzzle.onCorrect();
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
        showPathEnding();
      }
    }, 620);
  }
}

function showPathEnding() {
  resetInteractiveLayers();
  endingMode = "enterVillage";
  setSceneImage("village.png", true);
  createPetals(72);
  els.endingScreen.hidden = false;
  window.requestAnimationFrame(() => els.endingScreen.classList.add("visible"));
}

async function showVillageProse(text) {
  els.explainImage.removeAttribute("src");
  els.explainText.textContent = "";
  els.explainLayer.hidden = false;
  window.requestAnimationFrame(() => els.explainLayer.classList.add("visible", "prose-only"));
  await new Promise((resolve) => {
    typeText(text, els.explainText, () => {
      explanationTimer = window.setTimeout(resolve, 1800);
    });
  });
  clearTimers();
  els.explainLayer.classList.remove("visible", "prose-only");
  await wait(520);
  els.explainLayer.hidden = true;
}

function showFinalEnding() {
  resetInteractiveLayers();
  endingMode = "restart";
  setSceneImage("final_ending.png", true);
  createPetals(90);
  els.endingScreen.hidden = false;
  window.requestAnimationFrame(() => els.endingScreen.classList.add("visible"));
}

function handleEndingClick() {
  if (endingMode === "restart") {
    restartGame();
  } else if (endingMode === "exitVillage") {
    startRouteMarkingPuzzle();
  } else {
    enterVillage();
  }
}

function enterVillage() {
  startVillageGame();
}

function restartGame() {
  resetInteractiveLayers();
  villageCompleted = new Set();
  endingMode = "enterVillage";
  setSceneImage("cover.png", false);
  els.titleScreen.hidden = false;
}

window.enterVillage = enterVillage;
window.restartGame = restartGame;

function resetInteractiveLayers() {
  locked = false;
  selectedChipIds = [];
  chips = [];
  currentPuzzle = null;
  clearTimers();
  hideToast();
  closePuzzlePanel(true);
  closeDialogue();
  els.villageLayer.hidden = true;
  els.villageLayer.innerHTML = "";
  els.explainLayer.hidden = true;
  els.explainLayer.classList.remove("visible", "prose-only");
  els.endingScreen.hidden = true;
  els.endingScreen.classList.remove("visible");
  els.playLayer.innerHTML = "";
  els.game.classList.remove("vignette", "flash");
}

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
    const y = 12 + Math.random() * 50;
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
  window.clearTimeout(typeTimer);
  let index = 0;
  const tick = () => {
    target.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      typeTimer = window.setTimeout(tick, 28);
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
