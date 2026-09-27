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

// 子どもが言いそうな別名 → 正式名に変換する辞書
const aliasMap = {
  "いちご": "イチゴ", "ストロベリー": "イチゴ",
  "ばにら": "バニラ",
  "ますかるぽーね": "マスカルポーネ",
  "ちょこれーと": "チョコレート", "ちょこ": "チョコレート",
  "チョコ": "チョコレート", "ここあ": "チョコレート",
  "ちょこみんと": "チョコミント", "みんと": "チョコミント",
  "こーひー": "コーヒー",
  "さくらんぼ": "さくらんぼ", "チェリー": "さくらんぼ",
  "れもん": "レモン",
  "らふらんす": "ラフランス",
  "オレンジ": "オレンジシャーベット", "おれんじ": "オレンジシャーベット",
  "べにさやか": "べにさやかシャーベット",
  "らむね": "ラムネ",
  "ごま": "黒ゴマ", "くろごま": "黒ゴマ",
  "パイン": "パイナップルシャーベット", "ぱいん": "パイナップルシャーベット",
  "パイナップル": "パイナップルシャーベット"
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

// ★ 完全版 selectFlavor（壊れた部分をすべて除去）
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

    // ダブル1つ目
    if (maxSelect === 2 && selectedFlavors.length === 1) {
        speakMessage("もう一種類選んでください。");
        recognition.start();
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

// 音声結果
recognition.onresult = (event) => {
    let speech = event.results[0][0].transcript.toLowerCase();
    speech = speech.replace("味", "").trim();

    const foundFlavor = flavors.find(f => speech.includes(f));
    if (foundFlavor) speech = foundFlavor;

    // ダブルのとき複数拾う
    if (maxSelect === 2) {
        const foundFlavors = flavors.filter(f => speech.includes(f));

        if (foundFlavors.length > 1) {
            foundFlavors.forEach(f => selectFlavor(f));
            return;
        } else if (foundFlavors.length === 1) {
            selectFlavor(foundFlavors[0]);
            recognition.stop();
            setTimeout(() => {
                recognition.start();
            }, 800);
            return;
        }
    }

    // 語尾ゆれ除去
    speech = speech.replace("ください", "")
                   .replace("お願いします", "")
                   .replace("おねがいします", "")
                   .replace("ちょうだい", "")
                   .replace("ちょーだい", "")
                   .replace("です", "")
                   .trim();

    const mapped = aliasMap[speech] || speech;

    if (flavors.includes(mapped)) {
        selectFlavor(mapped);
        setTimeout(() => recognition.start(), 300);
    } else {
        speakMessage("別の味を選んでください。");
        setTimeout(() => recognition.start(), 1000);
    }
};

