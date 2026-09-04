const ASSET_PATH = "assets/";
const ASSET_VERSION = "20260812-zhu-live-v1";
const QA_FAST_MODE = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  && new URLSearchParams(location.search).get("qa") === "1";

(function setupResponsiveScale() {
  const BASE_W = 1100;
  const BASE_H = 618.75;
  const root = document.documentElement;
  const orientationHint = document.getElementById("orientationHint");
  let wantsLandscape = false;
  let fallbackReady = false;
  let settleTimer = 0;

  function viewportSize() {
    const viewport = window.visualViewport;
    return {
      width: Math.round(viewport?.width || window.innerWidth),
      height: Math.round(viewport?.height || window.innerHeight)
    };
  }

  function apply() {
    const { width, height } = viewportSize();
    const portrait = height > width;
    const shouldForceLandscape = wantsLandscape && fallbackReady && portrait;
    root.classList.toggle("forced-landscape", shouldForceLandscape);
    root.style.setProperty("--viewport-width", `${width}px`);
    root.style.setProperty("--viewport-height", `${height}px`);

    const logicalWidth = shouldForceLandscape ? height : width;
    const logicalHeight = shouldForceLandscape ? width : height;
    const scale = Math.min(logicalWidth / BASE_W, logicalHeight / BASE_H);
    root.style.setProperty("--game-scale", scale);

    const narrowPhonePortrait = Math.min(width, height) <= 700 && portrait;
    document.body.classList.toggle("device-portrait", narrowPhonePortrait);
  }

  async function enterLandscape() {
    wantsLandscape = true;
    fallbackReady = false;
    window.clearTimeout(settleTimer);

    const requestFullscreen = document.documentElement.requestFullscreen
      || document.documentElement.webkitRequestFullscreen;
    if (typeof requestFullscreen === "function") {
      try {
        await requestFullscreen.call(document.documentElement);
      } catch (_) {
        // iPhone and some in-app browsers reject fullscreen; CSS fallback handles them.
      }
    }

    if (typeof window.screen.orientation?.lock === "function") {
      try {
        await window.screen.orientation.lock("landscape");
      } catch (_) {
        // Orientation lock may be unavailable or blocked; CSS fallback handles it.
      }
    }

    settleTimer = window.setTimeout(() => {
      fallbackReady = true;
      apply();
    }, 800);
  }

  function handleViewportChange() {
    apply();
  }

  orientationHint?.addEventListener("click", enterLandscape);
  apply();
  window.addEventListener("resize", handleViewportChange);
  window.addEventListener("orientationchange", handleViewportChange);
  window.addEventListener("pageshow", handleViewportChange);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", handleViewportChange);
})();

const START_SCORE = 100;
const OPTION_PENALTY = 25;
const SNEAK_PENALTY = 15;
const PERSUADE_PENALTY = 15;

const characters = {
  narrator: { name: "旁白" },
  "鄭文公": { name: "鄭文公", image: "char-zhengbogong.webp" },
  "燭之武": { name: "燭之武", image: "char-zhuzhiwu.webp" },
  "燭之武(回到現在)": { name: "燭之武", image: "char-zhuzhiwu.webp" },
  "年輕燭之武": { name: "年輕燭之武", image: "char-zhuzhiwu-young.webp" },
  "佚之狐": { name: "佚之狐", image: "char-yizhihu.webp" },
  "秦穆公": { name: "秦穆公", image: "char-qinmugong.webp" },
  "晉文公": { name: "晉文公", image: "char-jinwengong.webp" },
  "子犯": { name: "子犯", image: "char-zifan.webp" },
  "鄭兵": { name: "鄭兵", image: "char-zhengbing.webp" },
  "秦軍哨": { name: "秦軍哨" },
  "三將同聲": { name: "三將同聲", image: "char-qisanjiang.webp" },
  "杞子": { name: "杞子", image: "char-qisanjiang.webp" },
  "大臣甲": { name: "大臣甲" },
  "大臣乙": { name: "大臣乙" }
};

const codexEntries = [
  {
    id: "accept",
    title: "接任務",
    quote: "臣之壯也,猶不如人;今老矣,無能為也已",
    plain: "懷才不遇者的自嘲與不甘"
  },
  {
    id: "dongdao",
    title: "東道主",
    quote: "若舍鄭以為東道主,行李之往來,共其乏困",
    plain: "「東道主」成語的出處"
  },
  {
    id: "feng",
    title: "闕秦以利晉",
    quote: "闕秦以利晉,唯君圖之",
    plain: "削弱自己去成就對手,值得嗎?"
  },
  {
    id: "jin",
    title: "不仁不知不武",
    quote: "因人之力而敝之,不仁;失其所與,不知;以亂易整,不武",
    plain: "政治家的三重格局"
  },
  {
    id: "ending",
    title: "微夫人之力",
    quote: "微夫人之力不及此",
    plain: "不忘本、念舊恩"
  }
];

// ── 論點卡牌:5 段論述,每段 3 張卡選 1,五段全填滿才驗證 ──
// 設計原則:每段的 3 張卡都是「春秋外交常見的合理建議」,只有一張是燭之武
// 真正的戰略邏輯。讓玩家必須思考,而不是一眼看穿。
const persuadeTurns = [
  {
    id: "yuesheng",
    mapImage: "map_turn1_geography.webp",
    intro: "你深深一拜，緩緩開口——這是第一段論述，秦公的耳朵在這一刻決定要不要聽下去。",
    choices: [
      {
        text: "「秦公，鄭國若亡，對您其實沒有好處——秦鄭中間還隔著整個晉國，您鞭長莫及。」",
        correct: true,
        original: "越國以鄙遠，君知其難也",
        originalNote: "（越過別國去治理遠地，您知道有多難）"
      },
      {
        text: "「秦公，鄭國願獻上五座城邑與宗廟珍寶，只求保全社稷。」",
        correct: false
      },
      {
        text: "「秦公以霸主之尊，何必親領大軍圍一小國？諸侯怕是會看輕的。」",
        correct: false
      }
    ]
  },
  {
    id: "linbao",
    mapImage: "map_turn2_balance.webp",
    intro: "秦公的神情鬆動了一些。第二段論述，你想怎麼推進這個局面？",
    choices: [
      {
        text: "「再說，亡了鄭國，得益的不是您——是晉國。晉強一分，秦弱一分。」",
        correct: true,
        original: "焉用亡鄭以陪鄰？鄰之厚，君之薄也",
        originalNote: "（何苦滅鄭去增厚晉國？鄰國強了，您就弱了）"
      },
      {
        text: "「秦晉雖為盟友，但鄭地一旦攻下，要如何劃分？請秦公早做籌議。」",
        correct: false
      },
      {
        text: "「鄭國願以王室宗廟祭祀奉秦祖，世代為盟。」",
        correct: false
      }
    ]
  },
  {
    id: "dongdao",
    mapImage: "map_turn3_eastroute.webp",
    intro: "秦公點了點頭。趁這時候，第三段你該丟出一個正面理由——",
    choices: [
      {
        text: "「相反，留鄭一條命——以後您東邊派使者來，鄭國願做您的東道主，接待補給。」",
        correct: true,
        original: "若舍鄭以為東道主，行李之往來，共其乏困",
        originalNote: "（若放過鄭國，當您東路上的主人，使者往來時可以為您補給）"
      },
      {
        text: "「秦公留鄭，可顯仁德於天下，諸侯必歸心。」",
        correct: false
      },
      {
        text: "「鄭國位於楚地之北，可作秦國防楚的緩衝。」",
        correct: false
      }
    ]
  },
  {
    id: "jiuqi",
    mapImage: "map_turn4_betrayal.webp",
    intro: "秦公開始撫鬚沉吟。第四段，你決定話鋒一轉——",
    choices: [
      {
        text: "「秦公，還記得當年您扶晉君回國，他答應給您焦、瑕兩塊地嗎？他渡了河，當天晚上就在城牆上修起工事。」",
        correct: true,
        original: "君嘗為晉君賜矣，許君焦、瑕，朝濟而夕設版焉",
        originalNote: "（您曾恩於晉君，他答應給您焦、瑕，早上渡河、晚上就築防禦工事）"
      },
      {
        text: "「臣聞晉軍糧草不足，久攻必潰，秦公何必為晉勞師？」",
        correct: false
      },
      {
        text: "「諸侯間早對晉君有微詞，秦若率先退兵，反得美名。」",
        correct: false
      }
    ]
  },
  {
    id: "feng",
    mapImage: "map_turn5_warning.webp",
    intro: "壓軸時刻。第五段論述要把這場戰局，推到最遠的那一步——",
    choices: [
      {
        text: "「今天他往東吞了鄭，明天就會往西伸手——伸到誰那兒？秦公，下一個就是您。」",
        correct: true,
        original: "夫晉，何厭之有？既東封鄭，又欲肆其西封，若不闕秦，將焉取之？",
        originalNote: "（晉的貪心沒有盡頭，既然東邊取了鄭，又會往西擴張；不削弱秦，他從哪裡取土地？）"
      },
      {
        text: "「晉君生性多疑，事後必懷恨秦私謀，不如秦公先發制人。」",
        correct: false
      },
      {
        text: "「秦公威震西方，不該與晉合污，免損霸主清名。」",
        correct: false
      }
    ]
  }
];

const acts = [
  {
    title: "第一場・大軍壓境",
    scene: "scene1_siege.webp",
    events: [
      { type: "line", character: "narrator", text: "春秋僖公三十年。秦、晉兩大強國聯軍圍住了小國鄭國,理由是鄭文公當年對流亡的晉公子重耳無禮,而且暗中親近楚國。" },
      { type: "line", character: "narrator", flashback: true, scene: "scene1b_alliance.webp", text: "十多年前,晉公子重耳流亡到鄭國,鄭文公連門都沒開。當年的羞辱,如今變成兵臨城下。" },
      { type: "line", character: "narrator", scene: "scene1_siege.webp", text: "鄭國城頭。守軍望著城外無邊無際的秦晉聯軍營火,個個臉色慘白。" },
      {
        type: "question",
        label: "背景理解",
        character: "narrator",
        prompt: "秦晉為什麼聯軍包圍鄭國?",
        options: ["鄭文公曾對流亡的晉文公無禮,而且暗通楚國", "鄭國攻打秦國", "晉國想擴張領土"],
        correct: 0,
        explanation: "鄭文公曾對流亡的晉文公無禮,而且暗通楚國。這是秦晉聯軍圍鄭的劇情背景。"
      }
    ]
  },
  {
    title: "第二場・朝堂議事",
    scene: "scene2_court.webp",
    events: [
      { type: "line", character: "narrator", text: "鄭國宮殿。鄭文公面色憂愁地望著地圖,大臣們你看我我看你,沒有一個人提得出主意。" },
      { type: "line", character: "鄭文公", text: "秦晉聯軍,合計四十萬。我們鄭國滿打滿算只有三萬。誰來告訴寡人——還有什麼路可以走?" },
      { type: "line", character: "大臣甲", text: "主公……不如奉降。" },
      { type: "line", character: "大臣乙", text: "不可!奉降也是死。重耳這個人,小時候連口熱飯都不肯給,如今得勢,豈會放過我們?" },
      { type: "line", character: "佚之狐", scene: "scene2b_yizhihu_close.webp", text: "(出列)主公!臣有一人可舉。此人若往,秦軍必退。" },
      { type: "line", character: "鄭文公", scene: "scene2_court.webp", text: "誰?!" },
      { type: "line", character: "佚之狐", text: "燭之武。" },
      { type: "line", character: "鄭文公", text: "……他?那個白鬍子老頭?他能說退秦軍?" },
      { type: "line", character: "佚之狐", scene: "scene2b_yizhihu_close.webp", text: "主公有所不知。燭之武年輕時就有奇才,只是沒人用他。如今滿頭白髮,話卻仍是當年的話。今日國危,非他不可。" },
      {
        type: "question",
        label: "人物理解",
        character: "佚之狐",
        prompt: "佚之狐為何推薦燭之武?",
        options: ["燭之武口才出眾、識見深遠,只是不得志", "燭之武武功高強", "燭之武跟秦穆公是朋友"],
        correct: 0,
        explanation: "佚之狐推薦燭之武,是因為他口才出眾、識見深遠,只是長年不得志。"
      }
    ]
  },
  {
    title: "第三場・茅屋求賢",
    scene: "scene3_hut.webp",
    events: [
      { type: "line", character: "narrator", text: "入夜。鄭文公親自坐車到燭之武家門前。茅屋簡陋,卻書卷滿案,一個白鬚老者在油燈下讀書。" },
      { type: "line", character: "鄭文公", text: "燭先生。寡人——夜叩寒門。" },
      { type: "line", character: "燭之武", quote: "臣之壯也,猶不如人;今老矣,無能為也已。", text: "(緩緩抬頭,苦笑)主公啊。臣年輕的時候,還不如別人;如今老了,實在做不了什麼事了。" },
      { type: "line", character: "鄭文公", quote: "吾不能早用子,今急而求子,是寡人之過也。", scene: "scene3b_apology.webp", text: "(深深一拜)是寡人,不能早早用先生。今天國危才來求您,是寡人的錯。可是——" },
      { type: "line", character: "鄭文公", quote: "然鄭亡,子亦有不利焉。", text: "鄭國要是亡了,先生您……也沒有好處啊。" },
      { type: "line", character: "燭之武", text: "(沉默良久,看著燈火,看著鄭文公,看著手中的書)" },
      {
        type: "branch",
        label: "劇情選擇",
        character: "燭之武",
        prompt: "燭之武會接這個任務嗎?",
        choices: [
          { text: "接:「為了鄭國子民,臣去」", action: "continue", toast: "燭之武接下出使。" },
          { text: "接:「臣想證明自己一次」", action: "continue", toast: "他把四十年的沉默,壓進這一夜。" },
          { text: "不接:「臣老矣,真的無能為力了」", action: "badEnding" }
        ],
        unlock: "accept"
      }
    ]
  },
  {
    title: "第四場・往昔閃回",
    scene: "scene4_memory.webp",
    events: [
      { type: "line", character: "narrator", flashback: true, text: "燭之武閉上眼。茅屋的火光,變成幾十年前的朝堂。" },
      { type: "line", character: "年輕燭之武", flashback: true, text: "(穿著樸素的朝服,手捧奏簡,在朝堂角落舉手)主公!臣請出使秦國,可以為鄭國謀一線安寧!" },
      { type: "line", character: "narrator", flashback: true, text: "朝堂上沒有人回頭。當時的鄭伯只是揮揮手:「下去吧。」" },
      { type: "line", character: "年輕燭之武", flashback: true, text: "(退到階下,捏緊奏簡,眼神倔強)" },
      { type: "line", character: "narrator", flashback: true, text: "那一年,他三十歲。那是他第一次主動請命,也是最後一次。從此他在朝中沉默了四十年。" },
      { type: "line", character: "燭之武(回到現在)", scene: "scene3_hut.webp", text: "(睜開眼,望著鄭文公)……主公。我去。" },
      {
        type: "question",
        label: "人物性格",
        character: "燭之武",
        quote: "臣之壯也,猶不如人;今老矣,無能為也已。",
        prompt: "這句反映燭之武什麼?",
        options: ["對自己年邁的感傷,也是對未獲重用的怨懟", "真的不會說話", "不愛國"],
        correct: 0,
        explanation: "這句話反映燭之武對自己年邁的感傷,也是對未獲重用的怨懟。"
      }
    ]
  },
  {
    title: "第五場・夜縋而出",
    scene: "scene5_wall.webp",
    events: [
      { type: "line", character: "narrator", quote: "夜縋而出。", text: "夜半。月光皎潔。鄭國北城牆上,鄭兵正把一條長索的一端綁在燭之武腰間,另一端死死扣在城堞。" },
      { type: "line", character: "鄭兵", text: "先生……城外三十里就是晉軍。他們夜哨密。先生要小心。" },
      { type: "line", character: "燭之武", text: "(拍拍鄭兵的肩)孩子,放心。我這個年紀,連命都不算我的了。" },
      { type: "line", character: "鄭兵", text: "(鼻酸)先生!城裡的妻兒老小,都在看您!" },
      { type: "line", character: "燭之武", text: "(微笑)那就慢點放繩——別把老頭子顛斷了腰。" },
      { type: "line", character: "narrator", text: "繩索徐徐放下,白鬚老者的身影在月光中緩緩降到城外的草地上。他拍拍身上的塵土,望向遠方秦營的火光,邁開了步。" }
    ]
  },
  {
    title: "第六場・月下潛行",
    scene: "scene6_sneak.webp",
    events: [
      { type: "sneak" }
    ]
  },
  {
    title: "第七場・秦營外",
    scene: "scene7_qincamp.webp",
    events: [
      { type: "line", character: "秦軍哨", text: "(拔劍)什麼人?!" },
      { type: "line", character: "燭之武", text: "(深深一揖)鄭國老臣燭之武,求見秦公。" },
      { type: "line", character: "秦軍哨", text: "鄭國使臣?半夜?" },
      { type: "line", character: "燭之武", text: "軍情如火,不敢等天明。煩請通報。" },
      { type: "line", character: "narrator", text: "秦軍哨上下打量這個白鬚老者,半晌,終於把他帶進了中軍帳。" },
      { type: "line", character: "秦穆公", text: "(帳內,聞報抬頭)鄭國使臣?讓他進來。我倒要聽聽,他在這個時辰來說什麼。" }
    ]
  },
  {
    title: "第八場・論點卡對峙",
    scene: "scene8_qintent.webp",
    events: [
      { type: "line", character: "narrator", text: "秦穆公的中軍大帳。燈火通明,案上酒爵肉脯。秦軍諸將分列兩側。" },
      { type: "line", character: "燭之武", text: "(緩步進帳,長拜)鄭國老臣燭之武,拜見秦公。" },
      { type: "line", character: "秦穆公", text: "起來。鄭國使臣,有何見教?" },
      { type: "line", character: "燭之武", quote: "秦、晉圍鄭,鄭既知亡矣。", text: "(起身,平靜地)秦、晉聯軍圍住鄭國,鄭國知道自己要亡了。" },
      { type: "line", character: "秦穆公", text: "(微微一愣)哦?那你還來幹嘛?" },
      { type: "line", character: "燭之武", quote: "若亡鄭而有益於君,敢以煩執事。", text: "如果亡了鄭國,對秦公您真的有好處,那我也不敢來打擾您。可是——" },
      { type: "line", character: "燭之武", text: "(上前一步,目光直視秦穆公)秦公,請聽臣為您拆解這場戰局。" },
      { type: "persuade" }
    ]
  },
  {
    title: "第九場・秦伯退兵",
    scene: "scene9_retreat.webp",
    events: [
      { type: "line", character: "秦穆公", text: "(長嘆,神色已變)使臣……你說得有道理。" },
      { type: "line", character: "秦穆公", quote: "闕秦以利晉,唯君圖之。", text: "寡人本以為亡鄭可得利。沒想到——亡了鄭,讓晉強我弱。" },
      { type: "line", character: "秦穆公", text: "更何況,晉君當年的事,寡人記得。" },
      { type: "line", character: "秦穆公", text: "(轉頭對部下)杞子!逢孫!楊孫!" },
      { type: "line", character: "三將同聲", scene: "scene9b_threegenerals.webp", text: "末將在!" },
      { type: "line", character: "秦穆公", quote: "使杞子、逢孫、楊孫戍之,乃還。", scene: "scene9_retreat.webp", text: "你們三人,帶兩千兵留下,助鄭防守。其餘人馬,即刻拔營,回秦。" },
      { type: "line", character: "燭之武", text: "(深深一拜,白鬚一抖)秦公明察。鄭國百姓,世世感念。" },
      { type: "line", character: "秦穆公", text: "(看著這個白鬚老者,半晌)使臣。" },
      { type: "line", character: "秦穆公", text: "鄭國能有你,是鄭國的福氣。" },
      {
        type: "question",
        label: "台詞潛台詞",
        character: "秦穆公",
        quote: "闕秦以利晉,唯君圖之。",
        prompt: "闕秦以利晉的意思?",
        options: ["削弱秦國去成就晉國", "闕門開給秦國利益", "讓秦國去打晉國"],
        correct: 0,
        explanation: "「闕秦以利晉」就是削弱秦國去成就晉國。燭之武把秦穆公從盟友情面拉回利害判斷。"
      }
    ]
  },
  {
    title: "第十場・子犯請擊",
    scene: "scene10_jintent.webp",
    view: "視角:晉文公",
    events: [
      { type: "line", character: "narrator", text: "同一時刻。晉軍中軍帳。子犯(晉文公的舅父、首席戰將)氣得拍案而起。" },
      { type: "line", character: "子犯", quote: "請擊之。", text: "主公!秦軍居然撤了?!還留三個將軍助鄭防守?!這是背盟!請主公下令——讓末將追上去,把秦軍打回原形!" },
      { type: "line", character: "子犯", text: "(按劍)這個機會,千載難逢!" },
      { type: "line", character: "晉文公", text: "(沉吟,沒有立刻回應)子犯……" },
      {
        type: "question",
        label: "劇情選擇",
        character: "晉文公",
        prompt: "晉文公會怎麼做?",
        options: ["同意子犯,追擊秦軍", "退兵", "派使者去秦營交涉"],
        correct: 1,
        retryUntilCorrect: true,
        wrongExplanations: [
          "歷史另一條路:追擊秦軍會立刻破壞秦晉恩義。兩年後的殽之戰確實爆發,但不是這一夜晉文公的選擇。扣分後請重新選。",
          "",
          "派使者也是合理選項,但晉文公的選擇更乾脆:退兵。扣分後請重新選。"
        ],
        explanation: "晉文公選擇退兵,反映他政治家的格局。"
      }
    ]
  },
  {
    title: "第十一場・晉文公的選擇",
    scene: "scene11_jindecision.webp",
    events: [
      { type: "line", character: "晉文公", quote: "不可。", text: "(緩緩開口)不行。" },
      { type: "line", character: "narrator", flashback: true, scene: "scene1b_alliance.webp", text: "十九年流亡。重耳走投無路時,是秦穆公收留了他,還把女兒嫁給他,送他兵馬回國即位。" },
      { type: "line", character: "晉文公", flashback: true, text: "(對秦穆公深拜)穆公之恩,重耳此生不忘。" },
      { type: "line", character: "narrator", scene: "scene11_jindecision.webp", text: "畫面拉回中軍帳。老去的晉文公望著帳外星空——那個曾經一無所有的流亡公子,如今要不要對恩人下手?" },
      { type: "line", character: "晉文公", quote: "微夫人之力不及此。", text: "當年若不是秦伯收留我重耳,我哪有今天?(視線飄向遠方,像看見年輕時的自己)" },
      { type: "line", character: "晉文公", quote: "因人之力而敝之,不仁。", text: "因為別人的恩情而傷害他——這叫不仁。" },
      { type: "line", character: "晉文公", quote: "失其所與,不知。", text: "失去結盟之國——這叫不智。" },
      { type: "line", character: "晉文公", quote: "以亂易整,不武。", text: "以混亂取代整齊——這叫不武。" },
      { type: "line", character: "晉文公", quote: "吾其還也。", text: "三條我都犯不得。退兵吧。" },
      { type: "line", character: "子犯", text: "(按劍的手慢慢鬆開,沉默片刻)……諾。" },
      { type: "line", character: "narrator", text: "子犯出帳。星空下,晉軍開始拔營。" },
      {
        type: "question",
        label: "人物性格",
        character: "晉文公",
        quote: "因人之力而敝之,不仁;失其所與,不知;以亂易整,不武。",
        prompt: "「不仁不知不武」三段論反映晉文公什麼?",
        options: ["政治家的氣度與遠見:私交、國交、軍事三面俱到", "怕事", "偏袒秦穆公"],
        correct: 0,
        explanation: "「不仁不知不武」三段論反映晉文公政治家的氣度與遠見:私交、國交、軍事三面俱到。",
        unlock: "jin"
      }
    ]
  },
  {
    title: "第十二場・三軍齊退",
    scene: "scene12_finalretreat.webp",
    events: [
      { type: "line", character: "narrator", text: "城頭。那名替燭之武放繩的年輕鄭兵,一夜沒睡,盯著城外。" },
      { type: "line", character: "鄭兵", text: "(喃喃)先生那麼老了……繩子會不會勒疼他?晉軍的火把,離他那麼近……" },
      { type: "line", character: "鄭兵", text: "(對著城外低聲)先生,您一定要回來。城裡還有我娘、我妹……都在等。" },
      { type: "line", character: "narrator", text: "天快亮時,城外的營火開始退。鄭兵揉了揉紅腫的眼,以為自己看花了。" },
      { type: "line", character: "narrator", text: "天亮。鄭國城頭的守軍揉著紅眼,望向城外。" },
      { type: "line", character: "narrator", text: "秦軍的營火,在退。晉軍的旌旗,也在退。" },
      { type: "line", character: "鄭兵", text: "(顫聲)他、他們真的退了……" },
      { type: "line", character: "鄭兵", text: "(突然爆出歡呼)燭先生!燭先生回來了!" },
      { type: "line", character: "narrator", text: "鄭國城門打開。一個白鬚老者,在朝陽中,徐徐走進城來。他身上的塵土,蓋過了他的衣袖。" },
      { type: "line", character: "narrator", text: "城頭的鄭兵全部脫帽,深深一拜。" },
      { type: "line", character: "narrator", text: "鄭文公親自在城門口等他。國君跪拜了下去。" }
    ]
  },
  {
    title: "尾聲一・東道主成語誕生",
    scene: "scene13_eastdaozhu.webp",
    events: [
      { type: "line", character: "narrator", text: "幾日後。鄭國城門。杞子、逢孫、楊孫帶著秦軍小隊,東向歸國途中經過鄭國。" },
      { type: "line", character: "narrator", text: "鄭國百姓設酒款待,城中老人捧上美酒,孩子捧上瓜果。" },
      { type: "line", character: "杞子", text: "(舉杯)鄭國有義啊。" },
      { type: "line", character: "燭之武", text: "(含笑)秦公說的,「若舍鄭以為東道主」。從今以後,東邊有秦使來,鄭國盡地主之誼。" },
      { type: "line", character: "narrator", stamp: "egg_eastdaozhu_stamp.webp", text: "「東道主」這個成語,從這裡誕生。今日請客接待遠來客人,就叫作「做東道主」——典故源自《左傳・僖公三十年》燭之武說秦伯之辭。", unlock: "dongdao" },
      { type: "line", character: "narrator", text: "兩千多年了,還這麼用。" }
    ]
  },
  {
    title: "尾聲二・燭之武歸隱",
    scene: "scene14_returnhut.webp",
    events: [
      { type: "line", character: "narrator", text: "一個月後。" },
      { type: "line", character: "narrator", text: "鄭國朝堂提議封燭之武為上卿。" },
      { type: "line", character: "燭之武", text: "(搖頭,推辭)主公。臣這把年紀,還是回茅屋讀書去吧。" },
      { type: "line", character: "narrator", text: "沒人勸得住。他收拾了幾本書、一壺酒,在夕陽中,走回他那間破茅屋。" },
      { type: "line", character: "narrator", text: "屋裡,還是那盞燈、那張案、那堆書。" },
      { type: "line", character: "narrator", text: "他坐下來,翻開書,像什麼都沒發生過。" },
      { type: "line", character: "narrator", text: "他知道,鄭國終究還是會亡。但至少——不是今天。" },
      { type: "line", character: "narrator", text: "燭之武,一夜退兵,從此名留青史。他沒有得到任何官職、任何賞賜。他只是回到他的書桌前,繼續做一個讀書人。" },
      { type: "line", character: "narrator", text: "後世史官在《左傳》上記下這一夜的故事。這是中國外交史上最經典的說服案例之一。", unlock: "ending" }
    ]
  }
];

const els = {
  game: document.getElementById("game"),
  sceneImage: document.getElementById("sceneImage"),
  titleScreen: document.getElementById("titleScreen"),
  bgMusic: document.getElementById("bgMusic"),
  musicToggle: document.getElementById("musicToggle"),
  codexToggle: document.getElementById("codexToggle"),
  scorePanel: document.getElementById("scorePanel"),
  actHint: document.getElementById("actHint"),
  viewStamp: document.getElementById("viewStamp"),
  eventStamp: document.getElementById("eventStamp"),
  toast: document.getElementById("toast"),
  dialogueLayer: document.getElementById("dialogueLayer"),
  dialogueBox: document.getElementById("dialogueBox"),
  speakerPortrait: document.getElementById("speakerPortrait"),
  speakerName: document.getElementById("speakerName"),
  quoteText: document.getElementById("quoteText"),
  dialogueText: document.getElementById("dialogueText"),
  continueButton: document.getElementById("continueButton"),
  choiceLayer: document.getElementById("choiceLayer"),
  choicePrompt: document.getElementById("choicePrompt"),
  choiceOptions: document.getElementById("choiceOptions"),
  choiceExplain: document.getElementById("choiceExplain"),
  choiceContinue: document.getElementById("choiceContinue"),
  sneakLayer: document.getElementById("sneakLayer"),
  sneakPrompt: document.getElementById("sneakPrompt"),
  sneakSteps: document.getElementById("sneakSteps"),
  sneakStatus: document.getElementById("sneakStatus"),
  torchLight: document.getElementById("torchLight"),
  persuadeLayer: document.getElementById("persuadeLayer"),
  persuadeStatus: document.getElementById("persuadeStatus"),
  trustLabel: document.getElementById("trustLabel"),
  trustFill: document.getElementById("trustFill"),
  trustNeedle: document.getElementById("trustNeedle"),
  qinPortrait: document.getElementById("qinPortrait"),
  strategicMap: document.getElementById("strategicMap"),
  argumentTrack: document.getElementById("argumentTrack"),
  handCards: document.getElementById("handCards"),
  showRulesBtn: document.getElementById("showRulesBtn"),
  submitPersuadeBtn: document.getElementById("submitPersuadeBtn"),
  codexLayer: document.getElementById("codexLayer"),
  codexClose: document.getElementById("codexClose"),
  codexCards: document.getElementById("codexCards"),
  modalLayer: document.getElementById("modalLayer"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalChoices: document.getElementById("modalChoices"),
  modalButton: document.getElementById("modalButton"),
  endingScreen: document.getElementById("endingScreen"),
  restartFromEnding: document.getElementById("restartFromEnding"),
  historySeal: document.getElementById("historySeal"),
  rankCard: document.getElementById("rankCard"),
  gameOverScreen: document.getElementById("gameOverScreen"),
  gameOverPanel: document.getElementById("gameOverPanel"),
  gameOverText: document.getElementById("gameOverText"),
  badRetry: document.getElementById("badRetry"),
  badHome: document.getElementById("badHome")
};

let actIndex = 0;
let eventIndex = 0;
let typeTimer = 0;
let hintTimer = 0;
let toastTimer = 0;
let stampTimer = 0;
let eventStampTimer = 0;
let modalCallback = null;
let score = START_SCORE;
let musicMuted = false;
let gameOver = false;
let sneakState = null;
let sneakBusy = false;
let persuadeState = null;
let specialEvents = null;
let specialIndex = 0;
let sceneRequestId = 0;

const unlockedCodex = new Set();
const performanceStats = {
  badCards: 0,
  persuadeRetries: 0,
  sneakMistakes: 0
};

function assetUrl(file) {
  return `${ASSET_PATH}${file}?v=${ASSET_VERSION}`;
}

const preloadedScenes = new Set();

function preloadScene(file) {
  if (!file || preloadedScenes.has(file)) return;
  preloadedScenes.add(file);
  const image = new Image();
  image.decoding = "async";
  image.src = assetUrl(file);
}

function preloadActScenes(act) {
  if (!act) return;
  [act.scene, ...act.events.map((event) => event.scene).filter(Boolean)].forEach(preloadScene);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function richText(value) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "$1");
}

function plainText(value) {
  return String(value || "").replace(/\*\*/g, "").replace(/`/g, "");
}

function getSpeaker(characterId) {
  if (!characterId || characterId === "—") return characters.narrator;
  if (characters[characterId]) return characters[characterId];
  if (String(characterId).startsWith("narrator")) return characters.narrator;
  if (String(characterId).includes("年輕燭之武")) return characters["年輕燭之武"];
  if (String(characterId).includes("燭之武")) return characters["燭之武"];
  if (String(characterId).includes("三將")) return characters["三將同聲"];
  return { name: characterId };
}

function startGame() {
  els.titleScreen.hidden = true;
  els.endingScreen.hidden = true;
  els.endingScreen.classList.remove("visible");
  els.gameOverScreen.hidden = true;
  els.gameOverScreen.classList.remove("visible", "persuade");
  score = START_SCORE;
  gameOver = false;
  actIndex = 0;
  eventIndex = 0;
  unlockedCodex.clear();
  performanceStats.badCards = 0;
  performanceStats.persuadeRetries = 0;
  performanceStats.sneakMistakes = 0;
  sneakBusy = false;
  updateScorePanel();
  startBackgroundMusic();
  startAct();
}

function resetGame() {
  hideAllOverlays();
  score = START_SCORE;
  gameOver = false;
  actIndex = 0;
  eventIndex = 0;
  specialEvents = null;
  updateScorePanel();
  els.titleScreen.hidden = false;
  els.endingScreen.hidden = true;
  els.endingScreen.classList.remove("visible");
  els.gameOverScreen.hidden = true;
  els.gameOverScreen.classList.remove("visible", "persuade");
  setScene("cover.webp");
}

function startAct() {
  const act = acts[actIndex];
  if (!act) {
    showEnding();
    return;
  }
  eventIndex = 0;
  setScene(act.scene);
  preloadActScenes(act);
  preloadScene(acts[actIndex + 1]?.scene);
  showActHint(act.title);
  if (act.view) showViewStamp(act.view);
  window.setTimeout(runEvent, 560);
}

function runEvent() {
  const act = acts[actIndex];
  if (!act) {
    showEnding();
    return;
  }
  const event = act.events[eventIndex];
  if (!event) {
    actIndex += 1;
    startAct();
    return;
  }

  if (event.type === "line") showLine(event);
  else if (event.type === "question") showQuestion(event);
  else if (event.type === "branch") showBranch(event);
  else if (event.type === "sneak") showSneakGame();
  else if (event.type === "persuade") showPersuadeGame();
}

function nextEvent() {
  eventIndex += 1;
  runEvent();
}

function setScene(file, fallbackFile = null) {
  const requestId = ++sceneRequestId;
  els.sceneImage.classList.remove("visible");
  els.game.classList.add("scene-loading");
  window.setTimeout(() => {
    if (requestId !== sceneRequestId) return;
    const img = els.sceneImage;
    const reveal = () => {
      if (requestId !== sceneRequestId) return;
      img.classList.add("visible");
      els.game.classList.remove("scene-loading");
    };
    img.onload = reveal;
    img.onerror = () => {
      if (requestId !== sceneRequestId) return;
      if (fallbackFile && img.dataset.fallback !== fallbackFile) {
        img.dataset.fallback = fallbackFile;
        img.src = assetUrl(fallbackFile);
        return;
      }
      img.alt = "場景圖片暫時無法載入";
      reveal();
    };
    delete img.dataset.fallback;
    img.alt = "";
    img.src = assetUrl(file);
    // 圖片已在快取時 onload 可能不觸發，補一次同步檢查
    if (img.complete && img.naturalWidth > 0) reveal();
  }, 80);
}

function startBackgroundMusic() {
  if (!els.bgMusic || musicMuted) return;
  els.bgMusic.volume = 0.42;
  const promise = els.bgMusic.play();
  if (promise && promise.catch) promise.catch(() => {});
}

function toggleMusic() {
  musicMuted = !musicMuted;
  if (musicMuted) {
    els.bgMusic.pause();
    els.musicToggle.textContent = "♪ 靜音";
    els.musicToggle.setAttribute("aria-pressed", "false");
    els.musicToggle.setAttribute("aria-label", "開啟背景音樂");
    els.musicToggle.classList.add("muted");
  } else {
    startBackgroundMusic();
    els.musicToggle.textContent = "♪ 音樂";
    els.musicToggle.setAttribute("aria-pressed", "true");
    els.musicToggle.setAttribute("aria-label", "關閉背景音樂");
    els.musicToggle.classList.remove("muted");
  }
}

function showActHint(text) {
  window.clearTimeout(hintTimer);
  els.actHint.textContent = text;
  els.actHint.classList.add("visible");
  hintTimer = window.setTimeout(() => els.actHint.classList.remove("visible"), 1850);
}

function showViewStamp(text) {
  window.clearTimeout(stampTimer);
  els.viewStamp.textContent = text;
  els.viewStamp.classList.add("visible");
  stampTimer = window.setTimeout(() => els.viewStamp.classList.remove("visible"), 1800);
}

function hideEventStamp() {
  window.clearTimeout(eventStampTimer);
  els.eventStamp.classList.remove("visible");
  eventStampTimer = window.setTimeout(() => {
    els.eventStamp.hidden = true;
  }, 220);
}

function showEventStamp(file) {
  window.clearTimeout(eventStampTimer);
  els.eventStamp.hidden = false;
  els.eventStamp.classList.remove("visible");
  els.eventStamp.src = assetUrl(file);
  window.requestAnimationFrame(() => els.eventStamp.classList.add("visible"));
  eventStampTimer = window.setTimeout(hideEventStamp, 3600);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  toastTimer = window.setTimeout(() => els.toast.classList.remove("visible"), 1850);
}

function updateScorePanel() {
  els.scorePanel.textContent = `分數 ${Math.max(score, 0)}`;
}

function deductScore(amount, reason) {
  if (gameOver) return true;
  score = Math.max(0, score - amount);
  updateScorePanel();
  els.scorePanel.classList.remove("hit");
  window.requestAnimationFrame(() => els.scorePanel.classList.add("hit"));
  window.setTimeout(() => els.scorePanel.classList.remove("hit"), 360);
  showToast(`${reason} -${amount},剩 ${score}`);
  if (score <= 0) {
    showScoreGameOver();
    return true;
  }
  return false;
}

function hideAllOverlays() {
  window.clearTimeout(typeTimer);
  els.game.classList.remove("question-mode", "question-answered", "flashback-mode");
  els.dialogueLayer.hidden = true;
  els.choiceLayer.hidden = true;
  els.sneakLayer.hidden = true;
  els.persuadeLayer.hidden = true;
  els.codexLayer.hidden = true;
  els.modalLayer.hidden = true;
  els.choiceOptions.innerHTML = "";
  els.choiceExplain.textContent = "";
  els.choiceExplain.hidden = true;
  els.choiceContinue.hidden = true;
  els.dialogueBox.classList.remove("flashback");
  hideEventStamp();
}

function setSpeaker(characterId) {
  const speaker = getSpeaker(characterId);
  els.speakerName.textContent = speaker.name;
  els.dialogueBox.classList.toggle("narrator", !speaker.image);
  if (speaker.image) {
    els.speakerPortrait.src = assetUrl(speaker.image);
    els.speakerPortrait.alt = speaker.name;
  } else {
    els.speakerPortrait.removeAttribute("src");
    els.speakerPortrait.alt = "";
  }
}

function showLine(event, advance = nextEvent) {
  els.game.classList.remove("question-mode", "question-answered");
  els.game.classList.toggle("flashback-mode", Boolean(event.flashback));
  els.dialogueBox.classList.toggle("flashback", Boolean(event.flashback));
  if (event.scene) setScene(event.scene);
  if (event.stamp) showEventStamp(event.stamp);
  else hideEventStamp();
  els.choiceLayer.hidden = true;
  els.sneakLayer.hidden = true;
  els.persuadeLayer.hidden = true;
  els.dialogueLayer.hidden = false;
  els.continueButton.hidden = true;
  setSpeaker(event.character);
  els.quoteText.innerHTML = richText(event.quote || "");
  els.dialogueText.textContent = "";
  typeText(event.text, () => {
    els.dialogueText.innerHTML = richText(event.text || "");
    if (event.unlock) unlockCodex(event.unlock);
    els.continueButton.hidden = false;
    els.continueButton.onclick = () => {
      els.continueButton.hidden = true;
      advance();
    };
  });
}

function typeText(text, done) {
  window.clearTimeout(typeTimer);
  if (QA_FAST_MODE) {
    els.dialogueText.textContent = plainText(text);
    done();
    return;
  }
  let index = 0;
  const clean = plainText(text);
  const tick = () => {
    els.dialogueText.textContent = clean.slice(0, index);
    index += 1;
    if (index <= clean.length) typeTimer = window.setTimeout(tick, 16);
    else done();
  };
  tick();
}

function showQuestion(event) {
  els.game.classList.add("question-mode");
  els.game.classList.remove("question-answered", "flashback-mode");
  els.dialogueBox.classList.remove("flashback");
  els.dialogueLayer.hidden = false;
  els.choiceLayer.hidden = false;
  els.sneakLayer.hidden = true;
  els.persuadeLayer.hidden = true;
  els.continueButton.hidden = true;
  const speaker = getSpeaker(event.character);
  setSpeaker(event.character);
  els.speakerName.textContent = `${event.label}｜${speaker.name}`;
  els.quoteText.innerHTML = richText(event.quote || "");
  els.dialogueText.innerHTML = richText(event.prompt || "");
  els.choicePrompt.textContent = "";
  els.choiceOptions.innerHTML = "";
  els.choiceExplain.hidden = true;
  els.choiceExplain.textContent = "";
  els.choiceContinue.hidden = true;

  event.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.type = "button";
    button.innerHTML = `${String.fromCharCode(65 + index)}. ${richText(option)}`;
    button.addEventListener("click", () => resolveQuestion(event, index));
    els.choiceOptions.appendChild(button);
  });
}

function resolveQuestion(event, selectedIndex) {
  if (event.retryUntilCorrect && selectedIndex !== event.correct) {
    const message = event.wrongExplanations?.[selectedIndex] || "這不是晉文公最後的選擇。請重新判斷。";
    // 選錯扣分(retryUntilCorrect 題型仍要承擔扣分,但允許重選正解)
    if (!event.noPenalty && deductScore(OPTION_PENALTY, "選項錯誤")) return;
    showModal("讀懂為止", message, () => showQuestion(event), "重新選擇");
    return;
  }

  els.game.classList.add("question-answered");
  const buttons = [...els.choiceOptions.querySelectorAll(".option-button")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === event.correct) button.classList.add("correct");
  });
  // 只把玩家實際選錯的那一個標紅，正確選項標綠，其餘維持中性
  if (selectedIndex !== event.correct) {
    buttons[selectedIndex].classList.add("wrong");
    if (!event.noPenalty && deductScore(OPTION_PENALTY, "選項錯誤")) return;
  }

  if (event.unlock) unlockCodex(event.unlock);
  els.choiceExplain.innerHTML = richText(event.explanation || "");
  els.choiceExplain.hidden = false;
  els.choiceContinue.hidden = false;
  els.choiceContinue.onclick = () => {
    els.choiceContinue.hidden = true;
    nextEvent();
  };
}

function showBranch(event) {
  els.game.classList.add("question-mode");
  els.game.classList.remove("question-answered", "flashback-mode");
  els.dialogueLayer.hidden = false;
  els.choiceLayer.hidden = false;
  els.continueButton.hidden = true;
  const speaker = getSpeaker(event.character);
  setSpeaker(event.character);
  els.speakerName.textContent = `${event.label}｜${speaker.name}`;
  els.quoteText.textContent = "";
  els.dialogueText.textContent = event.prompt;
  els.choicePrompt.textContent = "";
  els.choiceOptions.innerHTML = "";
  els.choiceExplain.hidden = true;
  els.choiceContinue.hidden = true;

  event.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${choice.text}`;
    button.addEventListener("click", () => resolveBranch(event, choice));
    els.choiceOptions.appendChild(button);
  });
}

function resolveBranch(event, choice) {
  if (choice.action === "badEnding") {
    showBadEnding();
    return;
  }
  if (event.unlock) unlockCodex(event.unlock);
  if (choice.toast) showToast(choice.toast);
  nextEvent();
}

const sneakStages = [
  { prompt: "一支火把朝燭之武方向走來。", correct: "等", x: "48%", status: "蹲伏躲過。" },
  { prompt: "哨兵轉身遠離。", correct: "行", x: "18%", status: "快速穿過空隙。" },
  { prompt: "雲遮住月亮,場面一片黑。", correct: "繞", x: "78%", status: "走遠路繞過營地外圍。" }
];

function showSneakGame() {
  hideAllOverlays();
  els.sneakLayer.hidden = false;
  sneakState = { stage: 0, failuresThisStage: 0 };
  sneakBusy = false;
  renderSneak();
}

function setSneakControlsDisabled(disabled) {
  document.querySelectorAll(".sneak-button").forEach((button) => {
    button.disabled = disabled;
  });
}

function renderSneak() {
  // 防呆：潛行已結束或關卡索引越界時，殘留的 setTimeout 不應再渲染（否則讀到 undefined.prompt 會崩潰）
  if (!sneakState) return;
  const stage = sneakStages[sneakState.stage];
  if (!stage) return;
  sneakBusy = false;
  setSneakControlsDisabled(false);
  els.sneakPrompt.textContent = stage.prompt;
  els.sneakStatus.textContent = "選擇「等」「行」「繞」中的正確動作。";
  els.torchLight.style.setProperty("--torch-x", stage.x);
  els.torchLight.style.opacity = sneakState.stage === 2 ? "0.25" : "1";
  els.torchLight.style.width = sneakState.stage === 2 ? "90px" : "150px";
  els.sneakSteps.innerHTML = "";
  sneakStages.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "sneak-step";
    if (index < sneakState.stage) dot.classList.add("done");
    if (index === sneakState.stage) dot.classList.add("active");
    dot.textContent = String(index + 1);
    els.sneakSteps.appendChild(dot);
  });
}

function resolveSneak(action) {
  // 已通關或索引越界時忽略多餘點擊，避免快速連點造成重複結算或崩潰
  if (sneakBusy || !sneakState || sneakState.stage >= sneakStages.length) return;
  sneakBusy = true;
  setSneakControlsDisabled(true);
  const stage = sneakStages[sneakState.stage];
  if (action === stage.correct) {
    els.sneakStatus.textContent = stage.status;
    sneakState.stage += 1;
    sneakState.failuresThisStage = 0;
    if (sneakState.stage >= sneakStages.length) {
      sneakState = null; // 收尾：清掉狀態，讓任何殘留計時器/連點都安全略過
      showModal("潛行成功", "燭之武在月色中穿過晉軍防線,直到秦營的旌旗,出現在他眼前。", () => {
        els.sneakLayer.hidden = true;
        nextEvent();
      }, "繼續");
      return;
    }
    window.setTimeout(renderSneak, 520);
    return;
  }

  performanceStats.sneakMistakes += 1;
  sneakState.failuresThisStage += 1;
  if (deductScore(SNEAK_PENALTY, "潛行失誤")) return;
  if (sneakState.failuresThisStage >= 2) {
    sneakState.stage = Math.max(0, sneakState.stage - 1);
    sneakState.failuresThisStage = 0;
    els.sneakStatus.textContent = "先生!危險!這一段驚動了晉哨,退回上一段重來。";
  } else {
    els.sneakStatus.textContent = "先生!危險!請重試這一段。";
  }
  window.setTimeout(renderSneak, 900);
}

function showPersuadeTutorial(onStart) {
  showModal(
    "論點卡牌・說服戰",
    "你扮演燭之武，要對秦穆公發表五段論述說服他退兵。\n\n" +
    "【怎麼玩】\n" +
    "畫面上方有五個論述格，下方會出現該段的 3 張卡片，你選一張放進當前格子。\n" +
    "五段全填滿後，按「送出論述」一次驗證——\n\n" +
    "● 五段全對 → 秦穆公被說服，退兵。\n" +
    "● 有任一段錯 → 信任度扣分。秦穆公不會告訴你錯在哪，你必須回去重新思考整段論述順序與內容。\n" +
    "● 點上方論述格可以回去重選該段。\n\n" +
    "信任度從 50 開始；歸 0 → 你被趕出秦營，可以重來。",
    onStart,
    "開始說服"
  );
}

function showPersuadeGame() {
  hideAllOverlays();
  showPersuadeTutorial(() => {
    els.persuadeLayer.hidden = false;
    persuadeState = {
      trust: 50,
      turn: 0,
      choices: [null, null, null, null, null],
      // shuffles[t] = 該段的洗牌對照表:索引是「顯示位置」,值是「原始 idx」
      shuffles: persuadeTurns.map((t) => shuffleIndices(t.choices.length))
    };
    renderPersuadeTurn();
    updateTrust();
  });
}

function shuffleIndices(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderPersuadeTurn() {
  const turnData = persuadeTurns[persuadeState.turn];
  if (!turnData) return;

  // 上方 5 格論述軌道:可點切換 turn,已選會顯示精簡台詞
  els.argumentTrack.innerHTML = "";
  for (let i = 0; i < 5; i += 1) {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "turn-slot";
    if (i === persuadeState.turn) slot.classList.add("current");
    const chosenIdx = persuadeState.choices[i];
    if (chosenIdx !== null) {
      slot.classList.add("filled");
      const choice = persuadeTurns[i].choices[chosenIdx];
      const snippet = choice.text.length > 22 ? choice.text.substring(0, 22) + "…" : choice.text;
      slot.innerHTML = `<span class="slot-num">第 ${i + 1} 段</span><span class="slot-snippet">${escapeHtml(snippet)}</span>`;
    } else {
      slot.innerHTML = `<span class="slot-num">第 ${i + 1} 段</span><span class="slot-snippet">尚未選擇</span>`;
    }
    slot.addEventListener("click", () => {
      persuadeState.turn = i;
      renderPersuadeTurn();
    });
    els.argumentTrack.appendChild(slot);
  }

  // 切換戰略地圖(若新版地圖不存在,fallback 到既有的卡片戰略意象圖)
  if (els.strategicMap && turnData.mapImage) {
    const fallbackMap = { yuesheng: "card-yuesheng.webp", linbao: "card-linbao.webp", dongdao: "card-dongdao.webp", jiuqi: "card-jiuqi.webp", feng: "card-feng.webp" };
    els.strategicMap.alt = `第 ${persuadeState.turn + 1} 段戰略示意`;
    els.strategicMap.onerror = () => {
      els.strategicMap.onerror = null;
      els.strategicMap.src = assetUrl(fallbackMap[turnData.id]);
    };
    els.strategicMap.src = assetUrl(turnData.mapImage);
  }

  // 情境提示
  els.persuadeStatus.textContent = `【第 ${persuadeState.turn + 1} / 5 段】　${turnData.intro}`;

  // 下方 3 張卡片(依該段的洗牌順序顯示)
  els.handCards.innerHTML = "";
  const shuffle = persuadeState.shuffles[persuadeState.turn];
  shuffle.forEach((originalIdx, displayIdx) => {
    const choice = turnData.choices[originalIdx];
    const card = document.createElement("button");
    card.type = "button";
    card.className = "persuade-card-v2";
    if (persuadeState.choices[persuadeState.turn] === originalIdx) card.classList.add("selected");
    card.innerHTML = `
      <div class="card-mark">${String.fromCharCode(65 + displayIdx)}</div>
      <p class="card-text">${escapeHtml(choice.text)}</p>
      <div class="card-foot">放入第 ${persuadeState.turn + 1} 段</div>
    `;
    card.addEventListener("click", () => pickCardForTurn(originalIdx));
    els.handCards.appendChild(card);
  });

  // 「送出論述」按鈕:5 格都填才能按
  const allFilled = persuadeState.choices.every((c) => c !== null);
  if (els.submitPersuadeBtn) {
    els.submitPersuadeBtn.disabled = !allFilled;
    els.submitPersuadeBtn.textContent = allFilled ? "送出論述" : `送出論述（還差 ${persuadeState.choices.filter((c) => c === null).length} 段）`;
  }
}

function pickCardForTurn(idx) {
  persuadeState.choices[persuadeState.turn] = idx;
  // 若還有空格,自動跳到下一個空格
  const nextEmpty = persuadeState.choices.findIndex((c) => c === null);
  if (nextEmpty !== -1) {
    persuadeState.turn = nextEmpty;
  }
  renderPersuadeTurn();
}

function submitPersuade() {
  if (persuadeState.choices.some((c) => c === null)) return;

  const allCorrect = persuadeState.choices.every((idx, t) => persuadeTurns[t].choices[idx]?.correct === true);

  if (allCorrect) {
    // 全對 → 成功
    persuadeState.trust = 100;
    updateTrust();
    unlockCodex("dongdao");
    unlockCodex("feng");
    // 揭曉所有原文
    const revelations = persuadeState.choices.map((idx, t) => {
      const choice = persuadeTurns[t].choices[idx];
      return `【第 ${t + 1} 段】「${choice.original}」\n${choice.originalNote || ""}`;
    }).join("\n\n");
    showModal(
      "秦穆公長嘆——「使臣，你說得有道理。」",
      "你的五段論述，環環相扣，把整個戰局都拆解給秦穆公聽。\n\n──《左傳》原文揭曉──\n\n" + revelations,
      () => {
        showToast("秦公已信。");
        els.persuadeLayer.hidden = true;
        nextEvent();
      },
      "繼續"
    );
  } else {
    // 有錯 → 扣信任,不告訴哪一張錯
    persuadeState.trust = Math.max(0, persuadeState.trust - 15);
    performanceStats.badCards += 1;
    updateTrust();
    if (deductScore(PERSUADE_PENALTY, "論述失誤")) return;
    if (persuadeState.trust <= 0) {
      showPersuadeFailure();
      return;
    }
    showModal(
      "秦穆公搖頭",
      "「使臣……你說的這些話，寡人聽不進。」\n\n" +
      "（信任度 -15。你的某幾段論述沒打中關鍵——秦穆公不會告訴你錯在哪。\n" +
      "回去重新檢視五段論述的內容與順序，再試一次。）",
      () => {
        // 不清空 choices,讓玩家可以針對可疑的段落修改
        persuadeState.turn = 0;
        renderPersuadeTurn();
      },
      "重組論述"
    );
  }
}

function updateTrust() {
  const trust = persuadeState?.trust ?? 50;
  els.trustLabel.textContent = trust >= 100 ? "秦公已信" : trust <= 0 ? "秦公逐客" : `信任度 ${trust}`;
  els.trustFill.style.width = `${trust}%`;
  els.trustNeedle.style.left = `${trust}%`;
  const meter = els.trustFill.parentElement;
  meter.classList.remove("hit");
  window.requestAnimationFrame(() => meter.classList.add("hit"));
  window.setTimeout(() => meter.classList.remove("hit"), 420);
  let portrait = "char-qinmugong.webp";
  if (trust < 30) portrait = "char-qinmugong-angry.webp";
  else if (trust >= 100) portrait = "char-qinmugong-agree.webp";
  else if (trust >= 75) portrait = "char-qinmugong-think.webp";
  else if (trust >= 60) portrait = "char-qinmugong-listen.webp";
  els.qinPortrait.src = assetUrl(portrait);
}

function showPersuadeFailure() {
  performanceStats.persuadeRetries += 1;
  hideAllOverlays();
  setScene("gameover_persuade.webp");
  els.gameOverScreen.classList.add("persuade");
  els.gameOverScreen.hidden = false;
  els.gameOverPanel.hidden = false;
  els.gameOverText.textContent = "秦穆公揮揮手:「使臣,你說的話寡人聽不進。回去吧。」\n燭之武被請出了帳。月光下,他望著秦營,長長地嘆了一口氣。\n重新整理你的論述,再來一次。";
  els.badRetry.textContent = "重新挑戰";
  els.badHome.textContent = "回封面";
  els.badRetry.onclick = () => {
    els.gameOverScreen.hidden = true;
    els.gameOverScreen.classList.remove("visible", "persuade");
    showPersuadeGame();
  };
  els.badHome.onclick = resetGame;
  window.requestAnimationFrame(() => els.gameOverScreen.classList.add("visible"));
}

function showBadEnding() {
  gameOver = true;
  hideAllOverlays();
  setScene("gameover.webp");
  els.gameOverScreen.classList.remove("persuade");
  els.gameOverScreen.hidden = false;
  els.gameOverPanel.hidden = false;
  els.gameOverText.textContent = "燭之武謝絕了。鄭文公絕望地走出茅屋,夜風中老淚縱橫。\n三日後,鄭國城破,百姓流離。\n史官的竹簡上,本該寫下的那一夜,成了一片空白。\n燭之武,從此再沒有出現在史書上。\n一個老人的「無能為力」,讓一個本可以再撐兩百多年的國家,提前走入了黑暗。\n(※ 這是歷史的假設。真實的燭之武,選擇了走出那扇門。)";
  els.badRetry.textContent = "重新選擇";
  els.badHome.textContent = "回封面";
  els.badRetry.onclick = () => {
    gameOver = false;
    els.gameOverScreen.hidden = true;
    els.gameOverScreen.classList.remove("visible");
    actIndex = 2;
    eventIndex = 6;
    setScene("scene3_hut.webp");
    runEvent();
  };
  els.badHome.onclick = resetGame;
  window.requestAnimationFrame(() => els.gameOverScreen.classList.add("visible"));
}

function showScoreGameOver() {
  gameOver = true;
  hideAllOverlays();
  setScene("gameover.webp");
  els.gameOverScreen.classList.remove("persuade");
  els.gameOverScreen.hidden = false;
  els.gameOverPanel.hidden = false;
  els.gameOverText.textContent = "分數歸零。這條路走不通。\n請回到封面,重新判斷燭之武與晉文公的選擇。";
  els.badRetry.textContent = "回封面";
  els.badHome.textContent = "回封面";
  els.badRetry.onclick = resetGame;
  els.badHome.onclick = resetGame;
  window.requestAnimationFrame(() => els.gameOverScreen.classList.add("visible"));
}

function showEnding() {
  hideAllOverlays();
  const isPerfect = score >= 100
    && performanceStats.badCards === 0
    && performanceStats.persuadeRetries === 0
    && performanceStats.sneakMistakes === 0;
  // 100 分零失誤 → 完美結局圖；若圖檔異常，自動退回一般結局。
  setScene(isPerfect ? "ending_perfect.webp" : "ending.webp", "ending.webp");
  els.endingScreen.hidden = false;
  els.rankCard.hidden = false;
  els.historySeal.hidden = false;
  const rank = computeRank();
  els.rankCard.innerHTML = `<h2>${escapeHtml(rank.title)}</h2><p>${escapeHtml(rank.stamp)}</p><p>${escapeHtml(rank.note)}</p>`;
  window.requestAnimationFrame(() => els.endingScreen.classList.add("visible"));
}

function computeRank() {
  if (score >= START_SCORE && performanceStats.badCards === 0 && performanceStats.persuadeRetries === 0 && performanceStats.sneakMistakes === 0) {
    return { title: "外交大師", stamp: "辭令服人", note: "六題、潛行與五段論述全數一次完成。" };
  }
  if (score >= 60 && performanceStats.persuadeRetries === 0 && performanceStats.badCards <= 1) {
    return { title: "不辱使命", stamp: "幸不辱命", note: "雖有一次判斷失誤，仍順利完成說服任務。" };
  }
  return { title: "險中求勝", stamp: "死裡逃生", note: "曾經失誤或重試,但仍把鄭國帶過這一夜。" };
}

function unlockCodex(id) {
  if (!id || unlockedCodex.has(id)) return;
  unlockedCodex.add(id);
  showToast("圖鑑新增");
}

function showCodex() {
  renderCodex();
  els.codexLayer.hidden = false;
}

function renderCodex() {
  els.codexCards.innerHTML = "";
  codexEntries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "codex-card";
    const unlocked = unlockedCodex.has(entry.id);
    if (!unlocked) card.classList.add("locked");
    card.innerHTML = unlocked
      ? `<h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.quote)}</p><p>${escapeHtml(entry.plain)}</p>`
      : `<h3>${escapeHtml(entry.title)}</h3><p>尚未解鎖</p>`;
    els.codexCards.appendChild(card);
  });
}

function showModal(title, body, onClose, buttonText = "知道了", choices = []) {
  modalCallback = onClose || null;
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = richText(body || "");
  els.modalChoices.innerHTML = "";
  if (choices.length) {
    els.modalButton.hidden = true;
    choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "modal-choice";
      button.textContent = choice.text;
      button.addEventListener("click", () => {
        els.modalLayer.hidden = true;
        if (choice.onChoose) choice.onChoose();
      });
      els.modalChoices.appendChild(button);
    });
  } else {
    els.modalButton.hidden = false;
    els.modalButton.textContent = buttonText;
  }
  els.modalLayer.hidden = false;
}

function closeModal() {
  els.modalLayer.hidden = true;
  const callback = modalCallback;
  modalCallback = null;
  if (callback) callback();
}

function playHistoryEgg() {
  els.endingScreen.hidden = true;
  els.endingScreen.classList.remove("visible");
  setScene("scene_xiaozhibattle.webp");
  specialEvents = [
    { type: "line", character: "narrator", text: "兩年後。留在鄭國「助守」的杞子,派人密報秦穆公:「鄭國北門的鑰匙,在我手上。」" },
    { type: "line", character: "narrator", text: "秦穆公動心了。老臣蹇叔哭著勸:「千里襲遠,沒有不敗的。」秦穆公不聽。" },
    { type: "line", character: "narrator", text: "秦軍東出,在殽山的隘道,撞進晉軍的埋伏。" },
    { type: "line", character: "narrator", text: "全軍覆沒,三帥被俘。當年燭之武用一夜口舌換來的和平,兩年就碎了。" },
    { type: "line", character: "narrator", text: "「東道主」的情誼,擋不住利益的潮水。——這,才是春秋。" }
  ];
  specialIndex = 0;
  runSpecialEvent();
}

function runSpecialEvent() {
  const event = specialEvents[specialIndex];
  if (!event) {
    showModal("歷史回聲", "外交沒有永遠的朋友,只有永遠的利害。燭之武看懂了人心,卻擋不住時代。", showEnding, "回到結局");
    return;
  }
  showLine(event, () => {
    specialIndex += 1;
    runSpecialEvent();
  });
}

document.querySelectorAll(".sneak-button").forEach((button) => {
  button.addEventListener("click", () => resolveSneak(button.dataset.action));
});

els.titleScreen.addEventListener("click", startGame);
els.titleScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") startGame();
});
els.musicToggle.addEventListener("click", toggleMusic);
els.codexToggle.addEventListener("click", showCodex);
els.codexClose.addEventListener("click", () => {
  els.codexLayer.hidden = true;
});
if (els.showRulesBtn) els.showRulesBtn.addEventListener("click", () => showPersuadeTutorial(null));
if (els.submitPersuadeBtn) els.submitPersuadeBtn.addEventListener("click", submitPersuade);
els.modalButton.addEventListener("click", closeModal);
els.restartFromEnding.addEventListener("click", resetGame);
els.historySeal.addEventListener("click", (event) => {
  event.stopPropagation();
  playHistoryEgg();
});

document.addEventListener("keydown", (event) => {
  startBackgroundMusic();
  if (!els.codexLayer.hidden) {
    if (event.key === "Escape") els.codexLayer.hidden = true;
    return;
  }
  if (event.key !== "Enter") return;
  if (!els.modalLayer.hidden && !els.modalButton.hidden) {
    closeModal();
    return;
  }
  if (!els.continueButton.hidden && !els.dialogueLayer.hidden) els.continueButton.click();
  if (!els.choiceContinue.hidden && !els.choiceLayer.hidden) els.choiceContinue.click();
});

setScene("cover.webp");
updateScorePanel();
startBackgroundMusic();
document.addEventListener("pointerdown", startBackgroundMusic, { once: true });
document.addEventListener("keydown", startBackgroundMusic, { once: true });
