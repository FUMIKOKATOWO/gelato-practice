// 優しい挨拶
window.onload = () => {
  const greeting = new SpeechSynthesisUtterance("いらっしゃいませ。ゆっくりお選びくださいね。");
  greeting.lang = "ja-JP";
  greeting.pitch = 1.2;
  greeting.rate = 0.9;
  speechSynthesis.speak(greeting);
};

// 正式フレーバー
const flavors = [
  "イチゴ",
  "バニラ",
  "マスカルポーネ",
  "チョコレート",
  "チョコミント",
  "コーヒー",
  "さくらんぼ",
  "レモン",
  "ラフランス",
  "オレンジシャーベット",
  "べにさやかシャーベット",
  "ラムネ",
  "黒ゴマ",
  "パイナップルシャーベット"
];

// 子どもが言いそうな別名 → 正式名に変換する辞書
const aliasMap = {
  "いちご": "イチゴ",
  "ストロベリー": "イチゴ",

  "ばにら": "バニラ",

  "ますかるぽーね": "マスカルポーネ",

  "ちょこれーと": "チョコレート",
  "ちょこ": "チョコレート",

  "ちょこみんと": "チョコミント",
  "みんと": "チョコミント",

  "こーひー": "コーヒー",

  "さくらんぼ": "さくらんぼ",
  "チェリー": "さくらんぼ",

  "れもん": "レモン",
  "レモン": "レモン",

  "らふらんす": "ラフランス",

  "オレンジ": "オレンジシャーベット",
  "おれんじ": "オレンジシャーベット",

  "べにさやか": "べにさやかシャーベット",

  "らむね": "ラムネ",

  "ごま": "黒ゴマ",
  "くろごま": "黒ゴマ",

  "パイン": "パイナップルシャーベット",
  "ぱいん": "パイナップルシャーベット",
  "パイナップル": "パイナップルシャーベット"
};

let maxSelect = 1;
let selectedFlavors = [];

// サイズ選択（ボタン）
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
// フレーバー選択画面を表示する関数
function showFlavorSelect() {
  document.querySelector(".size-select").style.display = "none";  // サイズ選択を非表示
  document.querySelector(".flavor-select").style.display = "block"; // フレーバー選択を表示
  recognition.start(); // 音声認識を開始
}



// フレーバー選択画面表示
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
    recognition.stop();   // ★ここが重要！
    document.getElementById("confirmBtn").style.display = "block";
  }

  // ダブルはもう1回聞く
  if (maxSelect === 2 && selectedFlavors.length === 1) {
    speakMessage("もう一種類選んでください。");
    recognition.start();
  }

  if (maxSelect === 2 && selectedFlavors.length === 2) {
    recognition.stop();   // ダブルも2つ選んだら止める
    document.getElementById("confirmBtn").style.display = "block";
  }
}


// フレーバー選択処理
function selectFlavor(flavor, btn = null) {

  const normalized = flavor.replace("味", "");

  if (!flavors.includes(normalized)) {
    speakMessage("別の味を選んでください。");
    return;
  }

  selectedFlavors.push(normalized);

  if (btn) btn.style.backgroundColor = "#ffddee";

  if (maxSelect === 1 && selectedFlavors.length === 1) {
    document.getElementById("confirmBtn").style.display = "block";
  }

 if (maxSelect === 2 && selectedFlavors.length === 1) {
  speakMessage("もう一種類選んでください。");
  recognition.stop(); // ★ここを追加！
  setTimeout(() => {
    recognition.start(); // 少し待ってから再スタート
  }, 500);
}


  if (maxSelect === 2 && selectedFlavors.length === 2) {
    document.getElementById("confirmBtn").style.display = "block";
  }
}

// 決定ボタン
document.getElementById("confirmBtn").onclick = () => {
  document.querySelector(".flavor-select").style.display = "none";
  document.querySelector(".result").style.display = "block";

  document.getElementById("orderResult").textContent =
    selectedFlavors.join(" ＋ ");

  speakMessage("注文成功！！");

  const clap = new Audio("clap.mp3.mp3");
  clap.play();
};

// 優しい声で案内する関数
function speakMessage(msg) {
  const u = new SpeechSynthesisUtterance(msg);
  u.lang = "ja-JP";
  u.pitch = 1.2;
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

// 音声認識（味だけ）
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "ja-JP";
recognition.continuous = false;

};

recognition.onend = () => {
  console.log("音声認識が終了しました");

  // ダブルで1種類目を選んだ後なら再開する
  if (maxSelect === 2 && selectedFlavors.length === 1) {
    console.log("2種類目のために音声認識を再開します");
    setTimeout(() => {
      recognition.start();
    }, 1800); // 少し待ってから再スタート
  }
};

// 音声結果
recognition.onresult = (event) => {
  let speech = event.results[0][0].transcript.toLowerCase();
  speech = speech.replace("味", "").trim();

  // ゆれを吸収して正式名に変換
  const mapped = aliasMap[speech] || speech;

  if (flavors.includes(mapped)) {
    selectFlavor(mapped);
    speakMessage(`${mapped}ですね。ありがとうございます。`);
  } else {
    speakMessage("別の味を選んでください。");
  }
};
