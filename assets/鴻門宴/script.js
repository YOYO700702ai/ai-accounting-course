const ASSET_PATH = "assets/";
const ASSET_VERSION = "20260611-hongmen-v2";
const START_SCORE = 100;
const OPTION_PENALTY = 30;
const SEAT_PENALTY = 20;

const characters = {
  narrator: { name: "旁白" },
  xiangyu: { name: "項羽", image: "char-xiangyu.png" },
  liubang: { name: "劉邦", image: "char-liubang.png" },
  fanzeng: { name: "范增", image: "char-fanzeng.png" },
  zhangliang: { name: "張良", image: "char-zhangliang.png" },
  fankuai: { name: "樊噲", image: "char-fankuai.png" },
  xiangbo: { name: "項伯", image: "char-xiangbo.png" },
  xiangzhuang: { name: "項莊", image: "char-xiangzhuang.png" }
};

const seatData = {
  zones: [
    { id: "east", label: "東向坐・最尊・2席", short: "東向2席", x: "34%", y: "8%", w: "30%", h: "20%", max: 2 },
    { id: "south", label: "南向坐・次尊・1席", short: "南向", x: "64%", y: "35%", w: "23%", h: "24%", max: 1 },
    { id: "north", label: "北向坐・較卑・1席", short: "北向", x: "15%", y: "35%", w: "23%", h: "24%", max: 1 },
    { id: "west", label: "西向侍・陪侍・1席", short: "西侍", x: "35%", y: "66%", w: "29%", h: "20%", max: 1 }
  ],
  people: [
    {
      id: "xiangyu",
      zone: "east",
      bio: "西楚霸王，兵力四十萬，宴席的主人。坐最尊的東向位，盡顯其主導地位與驕傲自負。"
    },
    {
      id: "xiangbo",
      zone: "east",
      bio: "項羽的叔父，卻因私交暗中保護劉邦。與項羽同坐尊位，身分使然。"
    },
    {
      id: "fanzeng",
      zone: "south",
      bio: "項羽的謀士，被尊稱「亞父」。坐次尊位，是宴上最想殺劉邦的人。"
    },
    {
      id: "liubang",
      zone: "north",
      bio: "此時兵力僅十萬，以謝罪者身分赴宴，只能坐較卑的北向位，反映其弱勢與隱忍。"
    },
    {
      id: "zhangliang",
      zone: "west",
      bio: "劉邦的謀士，以隨從身分「侍坐」，坐最卑的西向位，全程冷靜應變、護主脫險。"
    }
  ],
  summary: "古人宴席「東向為尊」。項羽讓自己與叔父坐最尊位、范增次之，卻把客人劉邦安排在較卑的北向，張良更只能陪侍。這個座次把雙方的高下、項羽的傲慢與輕敵，全寫在空間裡。司馬遷特意記下座位，正是要讀者從座次讀出人物關係與權力態勢。"
};

const acts = [
  {
    title: "第一場・中軍震怒",
    scene: "scene1.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "楚漢相爭前夕。劉邦先入關中，項羽的四十萬大軍正開向鴻門。一封密信，正從劉邦軍中送到項羽帳前。"
      },
      {
        type: "line",
        character: "narrator",
        text: "傳令兵急步入帳：「大王！沛公那邊有密使到。左司馬曹無傷遣他來的！他說，沛公已經派兵守住函谷關，珍寶美人都收進宮裡，還想在關中自立為王！」"
      },
      {
        type: "line",
        character: "xiangyu",
        quote: "旦日饗士卒，為擊破沛公軍！",
        text: "（拍案而起）劉季那個亭長！幾年前還跟我一起在會稽起兵，如今他想騎到我頭上？傳令，明日犒賞三軍，給我把沛公那十萬人馬，殺個雞犬不留！"
      },
      {
        type: "line",
        character: "fanzeng",
        quote: "此其志不在小。",
        text: "大王請看。沛公從前在沛縣，貪財好色，什麼小便宜都要佔。可這次進了關，珍寶不取一件，美人不近一個。如此反常，分明是在收人心。這個人的野心可不小，趁他羽翼未豐，明天就動手！"
      },
      {
        type: "question",
        label: "台詞潛台詞",
        character: "fanzeng",
        quote: "此其志不在小。",
        prompt: "范增「此其志不在小」真正的意思是什麼？",
        options: [
          "劉邦的志向不小，恐怕想爭天下",
          "劉邦個子不小",
          "劉邦的軍隊規模不小"
        ],
        correct: 0,
        explanation: "「志」指志向、野心。范增看穿劉邦入關後反常的克制，判斷他在收買人心、所圖極大，因此力勸項羽動手。這句是全篇殺機的源頭。"
      },
      {
        type: "question",
        label: "劇情選擇",
        character: "xiangyu",
        prompt: "面對范增的進言，項羽會怎麼做？",
        options: [
          "立刻下令攻打劉邦",
          "先按兵不動，看劉邦怎麼說",
          "不以為意"
        ],
        correct: 0,
        explanation: "歷史上項羽最初動怒要打，但因項伯通風報信、劉邦親自謝罪而動搖。項羽性格剛烈卻不夠果決，這正是他與劉邦的關鍵差異，也埋下日後敗亡的伏筆。"
      }
    ]
  },
  {
    title: "第二場・項伯夜奔",
    scene: "scene2.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "是夜。項羽帳中的密令還沒傳開，有一個人卻已經連夜出發了。項羽的叔父項伯，年輕時和張良有過救命之恩，這一晚坐不住了。"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "（月下獨自策馬，低聲）子房啊子房，你跟著沛公，明天就要被一起殺了。不行，不能不告訴你。"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "（衝進張良帳）子房！沒時間多說。明天清早，項王要發兵打沛公。你趕緊跟我走，他們殺紅了眼，不分敵我的！"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "項大哥。當年下邳的官司，我替您頂過命；後來您也替我擋過刀。今天您冒這個險來告訴我，我這條命算是您救的。可是，我是受沛公託付來的。一個人偷溜，以後沒臉做人。您等等，我去通報沛公，讓他自己拿主意。"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "（皺眉）你這個人哪，認死理。快去快回！"
      },
      {
        type: "line",
        character: "narrator",
        text: "張良快步退出，衝進劉邦主帳。"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "沛公！大事！項伯剛從項王軍中跑來告訴我。明天清早，項王要殺過來！"
      },
      {
        type: "line",
        character: "liubang",
        text: "（瞬間清醒）什麼？多少人？四十萬啊！我這邊才十萬，還是雜牌！子房，這該怎麼辦？是哪個王八蛋出的主意叫我守函谷關的？我捏死他！"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "沛公，先別罵人。我問您一句，您打得贏項王嗎？"
      },
      {
        type: "line",
        character: "liubang",
        text: "（長嘆）打不贏。"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "既然打不贏，就只有一條路：服軟。項伯這個人重情義，他連夜冒險來告訴我，就還有救。沛公，您願不願意對他放低姿態？"
      },
      {
        type: "question",
        label: "劇情選擇",
        character: "liubang",
        prompt: "得知項羽明日要來攻打，劉邦該怎麼辦？",
        options: [
          "連夜逃跑",
          "拉攏項伯、明日親自去鴻門謝罪",
          "整軍與項羽決戰"
        ],
        correct: 1,
        explanation: "劉邦兵力遠不如項羽，硬拚必敗、逃跑示弱。他選擇放低姿態、拉攏項伯、親赴鴻門謝罪，用「服軟」化解危機。這體現劉邦能屈能伸、善用人的政治手腕。"
      }
    ]
  },
  {
    title: "第三場・結親家",
    scene: "scene2b.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "項伯仍在張良帳中等。一掀帳簾，進來的不只是張良。劉邦親自跟著進來，臉上換上滿滿的笑。"
      },
      {
        type: "line",
        character: "liubang",
        text: "（深深一揖）項大哥！久仰大名，今日得見，真是劉季三生有幸！來人，快上酒！"
      },
      {
        type: "line",
        character: "liubang",
        quote: "吾入關，秋毫不敢有所近……日夜望將軍至。",
        text: "（親自斟酒）項大哥，您聽我說。我劉季當初奉懷王之命進關，什麼都沒動。府庫鎖了，百姓沒擾，只等項王來主持大事。我哪敢稱王？函谷關派兵把守，是怕別的諸侯亂闖，我天天等的就是項王到！"
      },
      {
        type: "line",
        character: "liubang",
        text: "對了，項大哥，您家裡幾位公子幾位千金？"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "（一愣）啊？一兒一女。"
      },
      {
        type: "line",
        character: "liubang",
        text: "巧了。我有個閨女，年紀正合適。要是項大哥不嫌棄，咱們兩家結個親家，如何？以後一家人，有什麼話不能說？"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "（微醺）沛公這……這真是抬舉項某。好，項某回去一定如實稟報。只要您明天親自來，事情就好說！"
      },
      {
        type: "line",
        character: "narrator",
        text: "項伯離去。劉邦保持著拱手的姿勢，直到帳簾落下。一鬆手，人差點軟在地上。"
      },
      {
        type: "line",
        character: "liubang",
        text: "（倒抽冷氣）子房，這一關，過了一半。"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "（淡淡）還有一半在明天。"
      },
      {
        type: "question",
        label: "台詞潛台詞",
        character: "liubang",
        quote: "吾入關，秋毫不敢有所近……日夜望將軍至。",
        prompt: "劉邦對項伯說「吾入關，秋毫不敢有所近……日夜望將軍至」用意是什麼？",
        options: [
          "表白自己毫無野心、恭候項羽，藉此消除戒心",
          "抱怨項羽來得太慢",
          "炫耀自己的功勞"
        ],
        correct: 0,
        explanation: "劉邦刻意強調自己入關後什麼都不敢動、天天盼項羽到來，把自己擺在恭順臣服的位置，化解「想稱王」的指控。這是高明的外交辭令。"
      }
    ]
  },
  {
    title: "第四場・項羽動搖",
    scene: "scene2c.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "後半夜。項伯回到項羽帳中。項羽正在地圖前盤算明日的進兵路線。"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "大王！姪兒啊，我跟你說件事。沛公這個人，沒你想的那麼壞。"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（蹙眉）您怎麼提起他？"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "我剛從他軍中回來。他親口跟我說：他先入關，是替您探路，財物一樣沒動，百姓一根毫毛沒擾。函谷關派兵把守，是怕別的諸侯來搶，他天天盼您到。一個替您出力的人，您怎麼能不見一面就殺了？"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（冷笑）叔父，您這套說辭跟誰學的？是不是被那個張子房給灌了？"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "哎呀我跟你說。人家明天親自要來謝罪。人家都把脖子伸過來了，您一刀砍下去，天下英雄會怎麼說您？說您項王不能容人！說您殺謝罪之人！您的名聲、您的義氣，還要不要？"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（沉默良久，把案上揉爛的戰報慢慢攤開）那就……讓他來。我倒要當面聽聽他怎麼說。"
      },
      {
        type: "line",
        character: "fanzeng",
        text: "（從帳側陰影走出，他什麼都聽見了）大王。"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "亞父也沒睡？"
      },
      {
        type: "line",
        character: "fanzeng",
        text: "您剛才答應的話，可記住了？"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（擺手）亞父，您別急。一頓飯的功夫，我自有分寸。"
      },
      {
        type: "line",
        character: "fanzeng",
        text: "（深深一拜，聲音壓低）但願大王今日的「分寸」，將來不會變成項家的「絕路」。"
      },
      {
        type: "question",
        label: "人物性格",
        character: "xiangyu",
        prompt: "項羽聽完項伯一番話便動搖，反映他什麼性格特質？",
        options: [
          "重視名聲、講義氣，但耳根子軟、缺乏政治決斷",
          "心狠手辣",
          "完全聽從項伯"
        ],
        correct: 0,
        explanation: "項羽要的是「英雄之名」，聽不得「不能容人」「殺謝罪之人」的話。他並非沒有判斷，而是判斷被名聲綁架。這正是他與劉邦「能屈能伸」的關鍵分野。"
      }
    ]
  },
  {
    title: "第五場・鴻門入帳",
    scene: "scene3.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "正午。劉邦只帶張良、樊噲等百餘騎，親自到鴻門謝罪。"
      },
      {
        type: "line",
        character: "narrator",
        text: "通報官：「沛公到！」"
      },
      {
        type: "line",
        character: "liubang",
        text: "（伏地大拜）罪臣劉季，拜見項王！"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（端坐不動）起來說話。"
      },
      {
        type: "line",
        character: "liubang",
        text: "項王，劉季有負您的信任。當初與您各自將兵，沒想到我先入了關。本想替您守住、等您來主持，卻沒想到有小人從中挑撥，讓您誤會了。劉季絕無稱王之心。"
      },
      {
        type: "line",
        character: "xiangyu",
        quote: "此沛公左司馬曹無傷言之；不然，籍何以至此？",
        text: "（沉吟片刻）唉，沛公啊，這事兒原也不是我要為難你。是你部下左司馬曹無傷遣人來信，說你想稱王關中。不然，我項籍犯得著動四十萬大軍？"
      },
      {
        type: "line",
        character: "liubang",
        inner: true,
        text: "曹無傷，你死定了。"
      },
      {
        type: "line",
        character: "liubang",
        text: "（口中）哎呀！原來是這樣！項王您有所不知，劉季手下良莠不齊。今日一見，誤會冰釋，我心裡這塊大石頭也落了地！"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "既然來了，就一起飲一杯。來人，給沛公排座！"
      },
      { type: "seat" },
      {
        type: "question",
        label: "台詞潛台詞",
        character: "xiangyu",
        quote: "此沛公左司馬曹無傷言之；不然，籍何以至此？",
        prompt: "項羽脫口供出曹無傷，透露什麼？",
        options: [
          "項羽心直口快，把告密者曹無傷供了出來",
          "項羽在稱讚曹無傷",
          "項羽不知道誰告密"
        ],
        correct: 0,
        explanation: "項羽為了表示自己並非無故發兵，竟脫口說出告密者是曹無傷。這顯示項羽坦率或粗疏、缺乏心機，與劉邦的深沉形成對比。劉邦記下此事，回營後立刻誅殺曹無傷。"
      }
    ]
  },
  {
    title: "第六場・三舉玉玦",
    scene: "scene3b.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "酒過三巡。氣氛表面熱鬧，暗流洶湧。"
      },
      {
        type: "line",
        character: "fanzeng",
        text: "（把玉玦解下，望向項羽）大王！此酒甘美，當與沛公共賞。您看這塊玉，如何？"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（瞥一眼）不錯。"
      },
      {
        type: "line",
        character: "narrator",
        text: "范增等了一會兒。項羽轉頭跟項伯說笑，沒有回頭。"
      },
      {
        type: "line",
        character: "fanzeng",
        text: "（第二次舉玦，更高更明顯）大王！"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "嗯？（看了一眼，看見玦，看見范增的眼神，卻只是搖了搖頭。他放下酒爵，望向劉邦，眼神裡甚至帶著一點欣賞。）"
      },
      {
        type: "line",
        character: "fanzeng",
        inner: true,
        text: "玦者，決也！三次了！三次了你聽不懂嗎？！"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（轉頭對項伯說笑）沛公這人，倒是個明白人。"
      },
      {
        type: "line",
        character: "narrator",
        text: "范增頹然把玉玦放下。他長嘆一聲，起身藉口出帳。"
      },
      {
        type: "question",
        label: "文化常識",
        character: "fanzeng",
        prompt: "「玦」與「決」同音。范增三次舉玦的含意是什麼？",
        options: [
          "暗示項羽下「決」心，動手殺劉邦",
          "想送玉玦給劉邦當禮物",
          "顯示自己的玉很珍貴"
        ],
        correct: 0,
        explanation: "玉玦是缺一口的圓玉，古人以諧音雙關用作「決斷」的暗號。范增無法當場明說，只能舉玉示意，而項羽三次裝沒看見。這一刻，謀士與主公已經分道揚鑣。"
      }
    ]
  },
  {
    title: "第七場・項莊舞劍",
    scene: "scene4.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "范增疾步走到帳側，招手叫來年輕將領項莊。"
      },
      {
        type: "line",
        character: "fanzeng",
        quote: "君王為人不忍。若入前為壽，請以劍舞，因擊沛公於坐！",
        text: "（壓低聲音）項莊，聽好。大王心軟，下不了手。你進去敬酒，敬完了，就請以舞劍助興。等舞到沛公面前，一劍，結果了他。"
      },
      {
        type: "line",
        character: "xiangzhuang",
        text: "（一愣）亞父，這……"
      },
      {
        type: "line",
        character: "fanzeng",
        text: "（緊抓他手腕）不動手，你我、項家、整個楚軍，將來都要做他劉季的階下囚！聽見了沒？"
      },
      {
        type: "line",
        character: "xiangzhuang",
        text: "（咬牙）是。"
      },
      {
        type: "line",
        character: "xiangzhuang",
        text: "（進帳向項羽拜）大王與沛公飲宴，軍中沒什麼可以助興的。項莊願舞一段劍，為大王添酒。"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（擺手）准。"
      },
      {
        type: "line",
        character: "narrator",
        text: "項莊抽劍。劍光在帳內遊走，起初還算規矩，漸漸越來越近劉邦的座位。劉邦端著酒爵的手，一點一點僵住。"
      },
      {
        type: "line",
        character: "xiangbo",
        text: "（突然起身）哎呀！項莊將軍一人舞劍未免單薄，某不才，願與將軍對舞！"
      },
      {
        type: "line",
        character: "narrator",
        text: "項伯抽劍對舞，不停用身體擋在劉邦面前。項莊幾次想繞過去，都被項伯用劍勢逼開。項羽看著兩人對舞，還饒有興致地點頭。范增的臉，像鐵一樣。"
      },
      {
        type: "question",
        label: "台詞潛台詞",
        character: "zhangliang",
        quote: "今者項莊拔劍舞，其意常在沛公也。",
        prompt: "張良「今者項莊拔劍舞，其意常在沛公也」指出什麼？",
        options: [
          "項莊表面舞劍助興，真正目的是要殺劉邦",
          "項莊劍術高超值得欣賞",
          "項莊想邀劉邦一起跳舞"
        ],
        correct: 0,
        explanation: "「意在沛公」即用意在劉邦身上。舞劍是幌子，行刺才是真意。後世成語「項莊舞劍，意在沛公」即出於此，比喻表面有名目、實則別有所圖。"
      },
      {
        type: "question",
        label: "劇情選擇",
        character: "zhangliang",
        prompt: "眼看劉邦危在旦夕，張良該怎麼做？",
        options: [
          "親自上前阻止項莊",
          "出帳去叫樊噲進來護主",
          "勸劉邦趕快認輸"
        ],
        correct: 1,
        explanation: "張良冷靜判斷自己文弱擋不住，於是出帳找來猛將樊噲。善於識人、調度得宜，是張良過人之處。"
      }
    ]
  },
  {
    title: "第八場・樊噲闖帳",
    scene: "scene5.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "張良悄悄起身，退出帳外。樊噲帶著百餘騎兵列在外面候命。"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "（壓低聲音）樊將軍！帳內項莊舞劍，劍光不離沛公。事情很急，你進去！"
      },
      {
        type: "line",
        character: "fankuai",
        text: "（眼睛瞪圓）好。"
      },
      {
        type: "line",
        character: "narrator",
        text: "樊噲不脫甲、不放盾，提劍就往帳裡闖。守帳的衛兵伸戟攔阻，他側盾一撞，兩個衛兵應聲倒地。帳簾被一掌拍開。所有人轉頭。樊噲披甲執盾，頭髮根根直立，眼角都瞪裂了。"
      },
      {
        type: "line",
        character: "fankuai",
        text: "沛公何在！"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（按劍而起，厲聲）此何人也？！"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "大王息怒。這是沛公的參乘樊噲。"
      },
      {
        type: "line",
        character: "xiangyu",
        quote: "壯士！賜之卮酒。",
        text: "（看著樊噲，從怒氣轉為驚奇，放開劍柄，大笑）好個壯士！來人，賜他一大杯酒！再賜他一條生豬腿！"
      },
      {
        type: "line",
        character: "narrator",
        text: "樊噲接過一斗酒，站著仰頭一氣灌完；又把盾牌反扣地上當砧板，拔劍切肉大口吃下。"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（越看越喜歡）壯士！還能再喝嗎？"
      },
      {
        type: "line",
        character: "fankuai",
        quote: "臣死且不避，卮酒安足辭！",
        text: "（放下劍，擦了擦嘴）大王。我連死都不怕，一杯酒哪裡值得推辭？"
      },
      {
        type: "line",
        character: "fankuai",
        text: "大王容某說兩句。當年秦王暴虐，殺人如麻，天下人都反他。懷王跟各路將軍有約：先入關者王之。我家沛公先進了關，卻一寸土地、一個女人都沒佔，封了秦宮、退到霸上，等的就是大王您來。這樣有功勞的人，大王您不但不賞，反倒聽小人的話要殺他。這跟秦王有什麼兩樣？"
      },
      {
        type: "line",
        character: "narrator",
        text: "項羽張了張嘴，一句話都答不上來。"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "壯士，坐下說話。"
      },
      {
        type: "question",
        label: "台詞潛台詞",
        character: "fankuai",
        quote: "臣死且不避，卮酒安足辭！",
        prompt: "「臣死且不避，卮酒安足辭」是什麼意思？",
        options: [
          "我連死都不怕，一杯酒哪裡值得推辭",
          "我不敢喝酒",
          "這酒不好喝"
        ],
        correct: 0,
        explanation: "樊噲以「連死都不怕」襯托「一杯酒算什麼」，展現勇猛無畏的氣概，也藉機表明劉邦一方光明磊落。這種剛烈直率的言辭，鎮住了場面。"
      },
      {
        type: "question",
        label: "人物性格",
        character: "xiangyu",
        prompt: "項羽不殺反賞樊噲，反映他什麼性格？",
        options: [
          "欣賞勇士、重義氣，但也因此優柔",
          "膽小怕事",
          "想毒死樊噲"
        ],
        correct: 0,
        explanation: "項羽欣賞樊噲這樣的勇士，展現他重情重義、講究英雄氣概的一面；但也正因為這份「婦人之仁」與好面子，他一再錯失殺劉邦的時機。性格決定命運。"
      }
    ]
  },
  {
    title: "第九場・廁所脫身",
    scene: "scene6.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "又過了一會兒。劉邦故意捂著肚子起身。"
      },
      {
        type: "line",
        character: "liubang",
        text: "項王，劉季腹中不適，請准如廁。"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（笑）去吧去吧，沛公海量。"
      },
      {
        type: "line",
        character: "narrator",
        text: "劉邦對張良使了個眼色。張良跟著起身，樊噲也起身。三人出帳。"
      },
      {
        type: "line",
        character: "liubang",
        text: "（一出來臉色全變）子房，怎麼辦？剛才那一劍要不是項伯擋住。"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "別說了。現在就走。"
      },
      {
        type: "line",
        character: "liubang",
        text: "可是還沒辭行。"
      },
      {
        type: "line",
        character: "fankuai",
        quote: "大行不顧細謹，大禮不辭小讓。",
        text: "沛公！做大事的人，不講究這些小規矩；行大禮的人，不在乎這些小客套！人家擺明了要砍我們的肉，我們還在那兒糾結禮數？現在，人家是刀和砧板，我們是上頭的魚和肉，還說什麼辭行！"
      },
      {
        type: "line",
        character: "liubang",
        text: "（深吸一口氣）好。子房，你留下，替我向項王賠個不是。我帶著樊噲他們，從小路走。"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "您身上帶的禮物呢？"
      },
      {
        type: "line",
        character: "liubang",
        text: "白璧一雙，玉斗一雙，本來要敬獻的。你替我送進去。"
      },
      {
        type: "line",
        character: "zhangliang",
        text: "好。沛公，小路二十里，您要快。"
      },
      {
        type: "line",
        character: "liubang",
        text: "（對樊噲）走！"
      },
      {
        type: "question",
        label: "台詞潛台詞",
        character: "fankuai",
        quote: "人為刀俎，我為魚肉。",
        prompt: "「人為刀俎，我為魚肉」比喻什麼？",
        options: [
          "處境危險、任人宰割，必須立即離開",
          "想吃魚肉",
          "想學切肉"
        ],
        correct: 0,
        explanation: "刀俎是切肉用的刀與砧板，魚肉是被切的東西。比喻自己處於完全被動、可能被宰割的危險處境。樊噲用這個比喻，逼劉邦放下「禮數」立刻逃命。"
      }
    ]
  },
  {
    title: "第十場・豎子不足與謀",
    scene: "scene6b.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "張良獨自回到帳中。項羽看見只有他一個人，愣了一下。"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "沛公呢？"
      },
      {
        type: "line",
        character: "zhangliang",
        quote: "沛公不勝桮杓，謹使臣良奉白璧一雙，奉大王足下。",
        text: "（拱手）大王恕罪。沛公酒量小，怕在大王面前失儀，所以提早辭去了。臨走時命我捧白璧一雙獻給大王，玉斗一雙敬奉亞父，略表心意。"
      },
      {
        type: "line",
        character: "xiangyu",
        text: "（隨手接過白璧）唉，這個沛公，何必這樣客氣。"
      },
      {
        type: "line",
        character: "narrator",
        text: "范增從南向位站起，大步走到帳中央。他從張良手中接過玉斗，看了看，然後。"
      },
      {
        type: "line",
        character: "fanzeng",
        text: "（一聲冷笑）好。"
      },
      {
        type: "line",
        character: "narrator",
        text: "他把玉斗高高舉起，猛地摔在地上！玉斗應聲碎裂，他又拔劍，把碎片砍得粉碎。"
      },
      {
        type: "line",
        character: "fanzeng",
        quote: "豎子不足與謀！",
        text: "豎子。這小子根本不配跟我共謀大事！將來奪取項王天下的，一定是這個劉邦！我們將來，都要被他俘虜了！"
      },
      {
        type: "line",
        character: "narrator",
        text: "全場死寂。項羽臉色僵硬，張良垂目而立，什麼話都沒說。"
      },
      {
        type: "question",
        label: "台詞潛台詞",
        character: "fanzeng",
        quote: "豎子不足與謀！",
        prompt: "范增罵的「豎子」是誰？「不足與謀」又是什麼意思？",
        options: [
          "這小子指項羽，不值得共謀大事，范增極度失望",
          "范增在稱讚項羽",
          "范增在罵劉邦"
        ],
        correct: 0,
        explanation: "「豎子」是罵人的話，此處指項羽。范增看穿放走劉邦的後患，痛斥項羽不聽勸、成不了大事。一句話道盡謀士的憤懣與項羽集團的裂痕。"
      }
    ]
  },
  {
    title: "第十一場・軍中誅曹",
    scene: "scene7.png",
    events: [
      {
        type: "line",
        character: "narrator",
        text: "同日傍晚。劉邦快馬奔回大營，連甲都還沒解。"
      },
      {
        type: "line",
        character: "liubang",
        text: "來人！"
      },
      {
        type: "line",
        character: "narrator",
        text: "侍衛：「在！」"
      },
      {
        type: "line",
        character: "liubang",
        text: "（聲音冰冷）把左司馬曹無傷，綁了。立刻，綁來軍前，當場斬了。"
      },
      {
        type: "line",
        character: "narrator",
        text: "片刻，曹無傷被推上前。"
      },
      {
        type: "line",
        character: "narrator",
        text: "曹無傷顫聲：「沛、沛公？臣何罪之有？臣……」"
      },
      {
        type: "line",
        character: "liubang",
        text: "（湊近耳邊，聲音很輕）曹司馬。你昨夜的那封信寫得真好。項王今天親口跟我說的。"
      },
      {
        type: "line",
        character: "narrator",
        text: "劉邦轉身，手一揮。"
      },
      {
        type: "line",
        character: "liubang",
        text: "斬。"
      },
      {
        type: "question",
        label: "人物性格",
        character: "liubang",
        prompt: "劉邦回營第一件事就是誅殺曹無傷，反映他什麼？",
        options: [
          "處事果決、不留後患；與項羽脫口透露告密者的粗疏形成鮮明對比",
          "報復心強而已",
          "想要殺一儆百"
        ],
        correct: 0,
        explanation: "同一場宴席上，項羽脫口暴露了告密者，劉邦記在心裡；一回營立刻動手，連夜不留情。這份「記仇」與「果決」，正是劉邦能在亂世中存活到最後的關鍵。司馬遷把這件小事放在尾聲，是為了讓讀者把兩人並列比較。"
      }
    ]
  },
  {
    title: "尾聲・歷史鏡頭",
    scene: "scene6.png",
    events: [
      {
        type: "line",
        character: "narrator",
        scene: "scene6.png",
        text: "那年秋天，劉邦從鴻門逃出。"
      },
      {
        type: "line",
        character: "narrator",
        scene: "scene_wujiang.png",
        text: "四年後，他在垓下圍住了項羽。烏江邊，項羽自刎。"
      },
      {
        type: "line",
        character: "narrator",
        scene: "scene_wujiang.png",
        text: "項羽始終想不通。明明那天他擁有四十萬大軍，劉邦只有十萬。他可以一刀殺了他，就在那場酒席上。可是項羽放下了那把劍，因為他相信英雄就該堂堂正正打贏，不該在酒席上動手。"
      },
      {
        type: "line",
        character: "narrator",
        scene: "scene_emptytent.png",
        text: "范增說對了。那一頓飯的「分寸」，確實成了項家的絕路。"
      },
      {
        type: "line",
        character: "narrator",
        scene: "scene_hanchao.png",
        text: "項羽是英雄，但成不了帝王。劉邦不是英雄，但他活到了最後。"
      },
      {
        type: "line",
        character: "narrator",
        scene: "ending.png",
        text: "鴻門宴看似一場酒席，實則是楚漢相爭的轉捩點。"
      }
    ]
  }
];

const els = {
  game: document.getElementById("game"),
  sceneImage: document.getElementById("sceneImage"),
  titleScreen: document.getElementById("titleScreen"),
  bgMusic: document.getElementById("bgMusic"),
  musicToggle: document.getElementById("musicToggle"),
  scorePanel: document.getElementById("scorePanel"),
  endingScreen: document.getElementById("endingScreen"),
  gameOverScreen: document.getElementById("gameOverScreen"),
  actHint: document.getElementById("actHint"),
  toast: document.getElementById("toast"),
  dialogueLayer: document.getElementById("dialogueLayer"),
  dialogueBox: document.querySelector(".dialogue-box"),
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
  seatLayer: document.getElementById("seatLayer"),
  seatZones: document.getElementById("seatZones"),
  seatCards: document.getElementById("seatCards"),
  seatStatus: document.getElementById("seatStatus"),
  seatReset: document.getElementById("seatReset"),
  seatContinue: document.getElementById("seatContinue"),
  modalLayer: document.getElementById("modalLayer"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalButton: document.getElementById("modalButton")
};

let actIndex = 0;
let eventIndex = 0;
let typeTimer = 0;
let hintTimer = 0;
let toastTimer = 0;
let modalCallback = null;
let selectedSeatCard = null;
let seatAssignments = new Map();
let viewedSeatCards = new Set();
let seatSolved = false;
let musicMuted = false;
let score = START_SCORE;
let gameOver = false;

function assetUrl(file) {
  return `${ASSET_PATH}${file}?v=${ASSET_VERSION}`;
}

function startGame() {
  els.titleScreen.hidden = true;
  els.endingScreen.hidden = true;
  els.endingScreen.classList.remove("visible");
  els.gameOverScreen.hidden = true;
  els.gameOverScreen.classList.remove("visible");
  score = START_SCORE;
  gameOver = false;
  updateScorePanel();
  startBackgroundMusic();
  actIndex = 0;
  eventIndex = 0;
  startAct();
}

function resetGame() {
  hideAllOverlays();
  score = START_SCORE;
  gameOver = false;
  updateScorePanel();
  els.titleScreen.hidden = false;
  els.endingScreen.hidden = true;
  els.endingScreen.classList.remove("visible");
  els.gameOverScreen.hidden = true;
  els.gameOverScreen.classList.remove("visible");
  setScene("cover.png");
}

function startAct() {
  const act = acts[actIndex];
  if (!act) {
    showEnding();
    return;
  }
  eventIndex = 0;
  setScene(act.scene);
  showActHint(act.title);
  window.setTimeout(runEvent, 560);
}

function startBackgroundMusic() {
  if (!els.bgMusic || musicMuted) return;
  els.bgMusic.volume = 0.42;
  const promise = els.bgMusic.play();
  if (promise && promise.catch) promise.catch(() => {});
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
    startBackgroundMusic();
    els.musicToggle.textContent = "♪ 音樂";
    els.musicToggle.setAttribute("aria-pressed", "true");
    els.musicToggle.setAttribute("aria-label", "關閉背景音樂");
    els.musicToggle.classList.remove("muted");
  }
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
  if (event.type === "question") showQuestion(event);
  if (event.type === "seat") showSeatGame();
}

function nextEvent() {
  eventIndex += 1;
  runEvent();
}

function setScene(file) {
  els.sceneImage.classList.remove("visible");
  window.setTimeout(() => {
    els.sceneImage.src = assetUrl(file);
    els.sceneImage.onload = () => els.sceneImage.classList.add("visible");
  }, 80);
}

function showActHint(text) {
  window.clearTimeout(hintTimer);
  els.actHint.textContent = text;
  els.actHint.classList.add("visible");
  hintTimer = window.setTimeout(() => {
    els.actHint.classList.remove("visible");
  }, 1850);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  toastTimer = window.setTimeout(() => {
    els.toast.classList.remove("visible");
  }, 1700);
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
  showToast(`${reason} -${amount}，剩 ${score}`);
  if (score <= 0) {
    showGameOver();
    return true;
  }
  return false;
}

function hideAllOverlays() {
  window.clearTimeout(typeTimer);
  els.game.classList.remove("question-mode", "question-answered");
  els.dialogueLayer.hidden = true;
  els.choiceLayer.hidden = true;
  els.seatLayer.hidden = true;
  els.modalLayer.hidden = true;
  els.choiceOptions.innerHTML = "";
  els.choiceExplain.textContent = "";
  els.choiceExplain.hidden = true;
  els.choiceContinue.hidden = true;
}

function showLine(event) {
  els.game.classList.remove("question-mode", "question-answered");
  if (event.scene) setScene(event.scene);
  els.choiceLayer.hidden = true;
  els.choiceOptions.innerHTML = "";
  els.choiceExplain.textContent = "";
  els.choiceExplain.hidden = true;
  els.choiceContinue.hidden = true;
  els.seatLayer.hidden = true;
  els.dialogueLayer.hidden = false;
  els.continueButton.hidden = true;
  setSpeaker(event.character);
  els.quoteText.textContent = event.quote || "";
  els.dialogueText.textContent = "";
  els.dialogueText.classList.toggle("inner-thought", Boolean(event.inner));
  typeText(event.text, () => {
    els.continueButton.hidden = false;
    els.continueButton.onclick = () => {
      els.continueButton.hidden = true;
      nextEvent();
    };
  });
}

function showQuestion(event) {
  els.game.classList.add("question-mode");
  els.game.classList.remove("question-answered");
  els.seatLayer.hidden = true;
  els.dialogueLayer.hidden = false;
  els.choiceLayer.hidden = false;
  els.continueButton.hidden = true;
  setSpeaker(event.character);
  const speaker = characters[event.character] || characters.narrator;
  els.speakerName.textContent = `${event.label}｜${speaker.name}`;
  els.quoteText.textContent = event.quote || "";
  els.dialogueText.textContent = event.prompt;
  els.dialogueText.classList.remove("inner-thought");
  els.choicePrompt.textContent = "";
  els.choiceOptions.innerHTML = "";
  els.choiceExplain.hidden = true;
  els.choiceExplain.textContent = "";
  els.choiceContinue.hidden = true;

  event.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option-button";
    button.type = "button";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.addEventListener("click", () => resolveQuestion(event, index));
    els.choiceOptions.appendChild(button);
  });
}

function resolveQuestion(event, selectedIndex) {
  els.game.classList.add("question-answered");
  const buttons = [...els.choiceOptions.querySelectorAll(".option-button")];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === event.correct) button.classList.add("correct");
    if (index !== event.correct) button.classList.add("wrong");
  });
  if (selectedIndex !== event.correct) {
    buttons[selectedIndex].classList.remove("wrong");
    if (deductScore(OPTION_PENALTY, "選項錯誤")) return;
  }
  els.choiceExplain.textContent = event.explanation;
  els.choiceExplain.hidden = false;
  els.choiceContinue.hidden = false;
  els.choiceContinue.onclick = () => {
    els.choiceContinue.hidden = true;
    nextEvent();
  };
}

function setSpeaker(characterId) {
  const character = characters[characterId] || characters.narrator;
  els.speakerName.textContent = character.name;
  els.dialogueBox.classList.toggle("narrator", !character.image);
  if (character.image) {
    els.speakerPortrait.src = assetUrl(character.image);
    els.speakerPortrait.alt = character.name;
  } else {
    els.speakerPortrait.removeAttribute("src");
    els.speakerPortrait.alt = "";
  }
}

function typeText(text, done) {
  window.clearTimeout(typeTimer);
  if (window.__HONGMEN_QA_FAST__) {
    els.dialogueText.textContent = text;
    done();
    return;
  }
  let index = 0;
  const tick = () => {
    els.dialogueText.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      typeTimer = window.setTimeout(tick, 18);
    } else {
      done();
    }
  };
  tick();
}

function showSeatGame() {
  els.dialogueLayer.hidden = true;
  els.choiceLayer.hidden = true;
  els.choiceOptions.innerHTML = "";
  els.choiceExplain.textContent = "";
  els.choiceExplain.hidden = true;
  els.choiceContinue.hidden = true;
  els.seatLayer.hidden = false;
  selectedSeatCard = null;
  seatAssignments = new Map();
  viewedSeatCards = new Set();
  seatSolved = false;
  els.seatStatus.textContent = "請把五個人物排入四個方位。注意：有一個方位可以坐 2 人。";
  els.seatContinue.textContent = "繼續";
  els.seatContinue.disabled = true;
  els.seatContinue.onclick = handleSeatContinue;
  renderSeatZones();
  renderSeatCards();
}

function renderSeatZones() {
  els.seatZones.innerHTML = "";
  seatData.zones.forEach((zone) => {
    const zoneEl = document.createElement("section");
    zoneEl.className = "seat-zone";
    zoneEl.dataset.zone = zone.id;
    zoneEl.dataset.short = zone.short;
    zoneEl.style.setProperty("--x", zone.x);
    zoneEl.style.setProperty("--y", zone.y);
    zoneEl.style.setProperty("--w", zone.w);
    zoneEl.style.setProperty("--h", zone.h);

    const label = document.createElement("div");
    label.className = "zone-label";
    label.textContent = zone.label;
    const capacity = document.createElement("span");
    capacity.className = "zone-capacity";
    capacity.textContent = `0/${zone.max}`;
    const slots = document.createElement("div");
    slots.className = "zone-slots";
    zoneEl.append(label, capacity, slots);

    zoneEl.addEventListener("click", () => {
      if (selectedSeatCard && !seatSolved) tryPlaceSeatCard(selectedSeatCard, zone.id);
    });
    zoneEl.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (!seatSolved) zoneEl.classList.add("drag-over");
    });
    zoneEl.addEventListener("dragleave", () => zoneEl.classList.remove("drag-over"));
    zoneEl.addEventListener("drop", (event) => {
      event.preventDefault();
      zoneEl.classList.remove("drag-over");
      const cardId = event.dataTransfer.getData("text/plain");
      if (cardId && !seatSolved) tryPlaceSeatCard(cardId, zone.id);
    });
    els.seatZones.appendChild(zoneEl);
  });
}

function renderSeatCards() {
  els.seatCards.innerHTML = "";
  seatData.zones.forEach((zone) => {
    const zoneEl = els.seatZones.querySelector(`[data-zone="${zone.id}"] .zone-slots`);
    if (zoneEl) zoneEl.innerHTML = "";
  });

  seatData.people.forEach((person) => {
    const card = createSeatCard(person.id);
    const assignedZone = seatAssignments.get(person.id);
    if (assignedZone) {
      card.classList.add("locked");
      const zoneEl = els.seatZones.querySelector(`[data-zone="${assignedZone}"] .zone-slots`);
      zoneEl.appendChild(card);
    } else {
      els.seatCards.appendChild(card);
    }
  });
  updateSeatCapacityLabels();
}

function createSeatCard(id) {
  const character = characters[id];
  const card = document.createElement("button");
  card.className = "seat-card";
  card.type = "button";
  card.dataset.card = id;
  card.draggable = !seatSolved && !seatAssignments.has(id);
  if (selectedSeatCard === id) card.classList.add("selected");
  if (viewedSeatCards.has(id)) card.classList.add("viewed");

  const img = document.createElement("img");
  img.src = assetUrl(character.image);
  img.alt = character.name;
  const name = document.createElement("span");
  name.textContent = character.name;
  card.append(img, name);

  card.addEventListener("click", () => {
    if (seatSolved) {
      openSeatBio(id);
      return;
    }
    if (seatAssignments.has(id)) return;
    selectedSeatCard = selectedSeatCard === id ? null : id;
    highlightSelectedSeatCard();
    if (selectedSeatCard) {
      els.seatStatus.textContent = `已選 ${character.name}。請點選你判斷的座位。`;
    } else {
      updateSeatProgress("已取消選取。");
    }
  });
  card.addEventListener("dragstart", (event) => {
    if (seatSolved || seatAssignments.has(id)) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData("text/plain", id);
  });
  return card;
}

function highlightSelectedSeatCard() {
  document.querySelectorAll(".seat-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.card === selectedSeatCard);
  });
}

function tryPlaceSeatCard(cardId, zoneId) {
  const person = seatData.people.find((item) => item.id === cardId);
  const zone = seatData.zones.find((item) => item.id === zoneId);
  const occupied = [...seatAssignments.values()].filter((value) => value === zoneId).length;
  const character = characters[cardId];

  if (!person || !zone) return;
  if (occupied >= zone.max) {
    const message = `${zone.label} 已滿，請改放其他座位。`;
    els.seatStatus.textContent = message;
    selectedSeatCard = null;
    highlightSelectedSeatCard();
    if (deductScore(SEAT_PENALTY, "座位已滿")) return;
    return;
  }
  if (person.zone !== zoneId) {
    const message = `${character.name} 不能放在${zone.label.replace(/・\d席$/, "")}。請重新判斷座次。`;
    els.seatStatus.textContent = message;
    selectedSeatCard = null;
    highlightSelectedSeatCard();
    if (deductScore(SEAT_PENALTY, "人物位置錯誤")) return;
    return;
  }

  seatAssignments.set(cardId, zoneId);
  selectedSeatCard = null;
  renderSeatCards();
  updateSeatProgress(`${character.name} 已入座。`);
  if (seatAssignments.size === seatData.people.length) solveSeatGame();
}

function solveSeatGame() {
  seatSolved = true;
  els.seatStatus.textContent = "座次正確。可點人物查看介紹，也可以直接繼續。";
  els.seatContinue.disabled = false;
  els.seatContinue.textContent = "繼續";
  renderSeatCards();
  showToast("座次排定。");
}

function updateSeatCapacityLabels() {
  seatData.zones.forEach((zone) => {
    const count = [...seatAssignments.values()].filter((value) => value === zone.id).length;
    const label = els.seatZones.querySelector(`[data-zone="${zone.id}"] .zone-capacity`);
    if (label) label.textContent = `${count}/${zone.max}`;
  });
}

function updateSeatProgress(prefix = "") {
  if (seatSolved) return;
  const remaining = seatData.people
    .filter((person) => !seatAssignments.has(person.id))
    .map((person) => characters[person.id].name);
  const tail = remaining.length
    ? `尚未入座：${remaining.join("、")}。東向坐有 2 席。`
    : "全部入座。";
  els.seatStatus.textContent = prefix ? `${prefix}${tail}` : tail;
}

function openSeatBio(id) {
  const person = seatData.people.find((item) => item.id === id);
  const character = characters[id];
  if (!person || !character) return;
  showModal(character.name, person.bio, () => {
    viewedSeatCards.add(id);
    renderSeatCards();
    if (viewedSeatCards.size === seatData.people.length) {
      els.seatStatus.textContent = "座次關係已讀完，可以繼續。";
    }
  });
}

function handleSeatContinue() {
  showModal("座次總結", seatData.summary, () => {
    els.seatLayer.hidden = true;
    nextEvent();
  }, "繼續");
}

function showModal(title, body, onClose, buttonText = "知道了") {
  modalCallback = onClose || null;
  els.modalTitle.textContent = title;
  els.modalBody.textContent = body;
  els.modalButton.textContent = buttonText;
  els.modalLayer.hidden = false;
}

function closeModal() {
  els.modalLayer.hidden = true;
  const callback = modalCallback;
  modalCallback = null;
  if (callback) callback();
}

function showEnding() {
  hideAllOverlays();
  setScene("ending.png");
  els.endingScreen.hidden = false;
  window.requestAnimationFrame(() => els.endingScreen.classList.add("visible"));
}

function showGameOver() {
  gameOver = true;
  hideAllOverlays();
  setScene("gameover.png");
  els.titleScreen.hidden = true;
  els.endingScreen.hidden = true;
  els.endingScreen.classList.remove("visible");
  els.gameOverScreen.hidden = false;
  window.requestAnimationFrame(() => els.gameOverScreen.classList.add("visible"));
}

els.titleScreen.addEventListener("click", startGame);
els.titleScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") startGame();
});
els.musicToggle.addEventListener("click", toggleMusic);
els.endingScreen.addEventListener("click", resetGame);
els.endingScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") resetGame();
});
els.gameOverScreen.addEventListener("click", resetGame);
els.gameOverScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") resetGame();
});
els.modalButton.addEventListener("click", closeModal);
els.seatReset.addEventListener("click", showSeatGame);

document.addEventListener("keydown", (event) => {
  startBackgroundMusic();
  if (event.key !== "Enter") return;
  if (!els.modalLayer.hidden) {
    closeModal();
    return;
  }
  if (!els.continueButton.hidden && !els.dialogueLayer.hidden) nextEvent();
  if (!els.choiceContinue.hidden && !els.choiceLayer.hidden) nextEvent();
});

setScene("cover.png");
updateScorePanel();
startBackgroundMusic();
document.addEventListener("pointerdown", startBackgroundMusic, { once: true });
document.addEventListener("keydown", startBackgroundMusic, { once: true });
