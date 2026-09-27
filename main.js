// 優しい挨拶
window.onload = () => {
    const greeting = new SpeechSynthesisUtterance("いらっしゃいませ。ゆっくりお選びくださいね。");
    greeting.lang = "ja-JP";
    greeting.pitch = 1.2;
    greeting.rate = 0.9;
    speechSynthesis.speak(greeting);

    recognition.stop(); // マイク競合防止
};

// 正式フレーバー
const flavors = [
  "イチゴ", "バニラ", "マスカルポーネ", "チョコレート", "チョコミント",
  "コーヒー", "さくらんぼ", "レモン", "ラフランス", "オレンジシャーベット",
  "べにさやかシャーベット", "ラムネ", "黒ゴマ", "パイナップルシャーベット"
];

// aliasMap（強化版：チョコ100%拾える）
const aliasMap = {
  "いちご": "イチゴ", "すとろべりー": "イチゴ",
  "ばにら": "バニラ",
  "ますかるぽーね": "マスカルポーネ",

  // チョコ系（強化）
  "ちょこ": "チョコレート",
  "ちょこれーと": "チョコレート",
  "ちょこあいす": "チョコレート",
  "ちょこみるく": "チョコレート",
  "ここあ": "チョコレート",
  "チョコ": "チョコレート",
  "チョコレート": "チョコレート",

  "ちょこみんと": "チョコミント",
  "みんと": "チョコミント",

  "こーひー": "コーヒー",

  "さくらんぼ": "さくらんぼ", "ちぇりー": "さくらんぼ",

  "れもん": "レモン",

  "らふらんす": "ラフランス",

  "おれんじ": "オレンジシャーベット",

  "べにさやか": "べにさやかシャーベット",

  "らむね": "ラムネ",

  "ごま": "黒ゴマ", "くろごま": "黒ゴマ",

  "ぱいん": "パイナップルシャーベット",
  "ぱいなっぷる": "パイナップルシャーベット"
};

let maxSelect = 1;
let selectedFlavors = [];

// サイズ選択ボタン
document.getElementById("singleBtn").onclick = () => {
  maxSelect = 1;
  selectedFlavors = [];
  showFlavorSelect();
};

document.getElementById("doubleBtn").onclick = () => {
  maxSelect = 2;
  selectedFlavors = [];
  showFlavorSelect();
};

// フレーバー選択画面を表示
function showFlavorSelect() {
    document.querySelector(".size-select").style.display = "none";
    document.querySelector(".flavor-select").style.display = "block";

    setTimeout(() => {
        recognition.start();
    }, 800);
}

// ★ 完全安定版 selectFlavor（v2）
function selectFlavor(flavor, btn = null) {

    const normalized = flavor.replace("味", "");

    if (!flavors.includes(normalized)) {
        speakMessage("別の味を選んでください。");
        return;
    }

    selectedFlavors.push(normalized);

    if (btn) btn.style.backgroundColor = "#ffddee";

    // シングルは1回で終了
    if (maxSelect === 1 && selectedFlavors.length === 1) {
        recognition.stop();
        document.getElementById("confirmBtn").style.display = "block";

        setTimeout(() => {
            document.getElementById("confirmBtn").click();
        }, 1000);

        return;
    }

    // ダブル1つ目（音声終了後に確実に再開）
    if (maxSelect === 2 && selectedFlavors.length === 1) {
        speakMessage("もう一種類選んでください。");

        setTimeout(() => {
            recognition.start();
        }, 1200); // ← 音声終了後に確実に再開
        return;
    }

    // ダブル2つ目
    if (maxSelect === 2 && selectedFlavors.length === 2) {
        recognition.stop();
        document.getElementById("confirmBtn").style.display = "block";
        return;
    }
}

// 決定ボタン
document.getElementById("confirmBtn").onclick = () => {
    document.querySelector(".flavor-select").style.display = "none";
    document.querySelector(".result").style.display = "block";

    document.getElementById("orderResult").textContent =
        selectedFlavors.join(" ＋ ");

    recognition.stop();

    setTimeout(() => {
        const clap = new Audio("clap.mp3.mp3");
        clap.play();
        speakMessage("注文成功！！");
    }, 800);
};

// 優しい声で案内する関数
function speakMessage(msg) {
  const u = new SpeechSynthesisUtterance(msg);
  u.lang = "ja-JP";
  u.pitch = 1.2;
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

// 音声認識
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "ja-JP";
recognition.continuous = false;

recognition.onend = () => {
    console.log("音声認識が終了しました");
};

// ★ 改善版 onresult（複合語も確実に拾う）
recognition.onresult = (event) => {
    let speech = event.results[0][0].transcript.toLowerCase().trim();

    // 語尾ゆれ除去
    ["味","ください","お願いします","おねがいします","ちょうだい","ちょーだい","です"]
        .forEach(end => speech = speech.replace(end, ""));
    speech = speech.trim();

    // aliasMap の部分一致で変換（強化版）
    for (const key in aliasMap) {
        if (speech.includes(key)) {
            speech = aliasMap[key];
            break;
        }
    }

    // ★ ダブルのときは「2つ言ったかどうか」だけ判定
    if (maxSelect === 2) {
        const hits = flavors.filter(f => speech.includes(f));

        if (hits.length >= 2) {
            hits.slice(0, 2).forEach(f => selectFlavor(f));
            return;
        }

        if (hits.length === 1) {
            selectFlavor(hits[0]);
            return;
        }
    }

    // シングル or ダブル1つずつ
    if (flavors.includes(speech)) {
        selectFlavor(speech);
    } else {
        speakMessage("別の味を選んでください。");
    }
};

