// 優しい挨拶
window.onload = () => {
  const greeting = new SpeechSynthesisUtterance("いらっしゃいませ。ゆっくりお選びくださいね。");
  greeting.lang = "ja-JP";
  greeting.pitch = 1.2;
  greeting.rate = 0.9;
  speechSynthesis.speak(greeting);
};

// 味リスト
const flavors = [
  "イチゴ", "イチゴミルク", "バニラ", "イタリアンバニラ", "マスカルポーネ",
  "チョコレート", "チョコミント",
  "コーヒー", "自家焙煎コーヒー",
  "さくらんぼ", "れもん", "ラフランス", "オレンジシャーベット",
  "べにさやかシャーベット", "サクランボシャーベット", "ラムネ",
  "黒ゴマ", "ゴマ",
  "パイン", "パイナップル", "パインシャーベット", "パイナップルシャーベット"
];

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

// フレーバー選択画面表示
function showFlavorSelect() {
  document.querySelector(".size-select").style.display = "none";
  const list = document.getElementById("flavorList");
  list.innerHTML = "";

  flavors.forEach(f => {
    const btn = document.createElement("button");
    btn.textContent = f;
    btn.onclick = () => selectFlavor(f, btn);
    list.appendChild(btn);
  });

  document.querySelector(".flavor-select").style.display = "block";

  // 味の音声認識を開始
  recognition.start();
}

// 味選択処理（音声＋ボタン両対応）
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
recognition.continuous = true;

// 音声結果
recognition.onresult = (event) => {
  const speech = event.results[event.results.length - 1][0].transcript;
  const normalized = speech.replace("味", "");

  if (flavors.includes(normalized)) {
    selectFlavor(normalized);
    speakMessage(`${normalized}ですね。ありがとうございます。`);
  } else {
    speakMessage("別の味を選んでください。");
  }
};

