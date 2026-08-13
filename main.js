// 優しい挨拶
window.onload = () => {
  const greeting = new SpeechSynthesisUtterance("いらっしゃいませ。ゆっくりお選びくださいね。");
  greeting.lang = "ja-JP";
  greeting.pitch = 1.2;
  greeting.rate = 0.9;
  speechSynthesis.speak(greeting);
};

// 味リスト（あなたの指定）
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

// サイズ選択
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
}

// 味選択処理
function selectFlavor(flavor, btn) {

  // 「味」がついていても許容する（例：イチゴ味 → イチゴ）
  const normalizedFlavor = flavor.replace("味", "");

  // 存在しない味を選んだ場合（念のため）
  if (!flavors.includes(normalizedFlavor)) {
    speakMessage("別の味を選んでください。");
    return;
  }

  // 選択追加（同じ味はOK）
  selectedFlavors.push(normalizedFlavor);
  btn.style.backgroundColor = "#ffddee";

  // シングル → 1種類選んだら決定ボタン表示
  if (maxSelect === 1 && selectedFlavors.length === 1) {
    document.getElementById("confirmBtn").style.display = "block";
  }

  // ダブル → 1種類だけなら促す
  if (maxSelect === 2 && selectedFlavors.length === 1) {
    speakMessage("もう一種類選んでください。");
  }

  // ダブル → 2種類選んだら決定ボタン表示
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
