// 優しい挨拶
window.onload = () => {
    const greeting = new SpeechSynthesisUtterance("いらっしゃいませ。ゆっくりお選びくださいね。");
    greeting.lang = "ja-JP";
    greeting.pitch = 1.2;
    greeting.rate = 0.9;
    speechSynthesis.speak(greeting);

    // ★ 音声認識を初期化（マイクの競合防止）
    recognition.stop();
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
    document.querySelector(".size-select").style.display = "none";
    document.querySelector(".flavor-select").style.display = "block";

    // ★ 挨拶が終わるまで少し待ってから開始（安定）
    setTimeout(() => {
        recognition.start();
    }, 1500); // ← 1.5秒待つと確実に動く
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
    
    // ★ stop() は不要。onend で自動再開するように統一
    // recognition.stop(); ←削除

    // ★ 再開は少し遅らせてテンポを保つ
    setTimeout(() => {
        if (!recognition.continuous) { // 二重起動防止
          
        }
    }, 1000); // ← 1秒待って再開（安定）
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

recognition.onend = () => {
    console.log("音声認識が終了しました");
    // ★ここは削除
    // if (maxSelect === 2 && selectedFlavors.length === 1) {
    //     setTimeout(() => {
    //         recognition.start();
    //     }, 1800);
    // }
};


// 音声結果
recognition.onresult = (event) => {
    let speech = event.results[0][0].transcript.toLowerCase();
    speech = speech.replace("味", "").trim();

    // ★ 柔軟な判定：文章の中に味名が含まれていればOK
    const foundFlavor = flavors.find(f => speech.includes(f));
    if (foundFlavor) {
        speech = foundFlavor;
    }

// ★ ダブルの時だけ複数の味を一気に拾う
if (maxSelect === 2) {
    const foundFlavors = flavors.filter(f => speech.includes(f));

    if (foundFlavors.length > 1) {
        // 2種類まとめて言った場合
        foundFlavors.forEach(f => {
            selectFlavor(f);
            speakMessage(`${f}ですね。ありがとうございます。`);
        });

        // ★ ここで終了（単体処理に進ませない）
        return;
    }
    
else if (foundFlavors.length === 1) {
    selectFlavor(foundFlavors[0]);
    speakMessage(`${foundFlavors[0]}ですね。ありがとうございます。`);

    // ★ 一旦停止してから再開（競合防止）
    recognition.stop();

    // ★ 少し待ってから再開（テンポ調整）
    setTimeout(() => {
       　recognition.stop(); 　　
        recognition.start();
    }, 800); // ← 0.8秒が自然
}
  // 語尾のゆれを削除
speech = speech.replace("ください", "");
speech = speech.replace("お願いします", "");
speech = speech.replace("おねがいします", "");
speech = speech.replace("ちょうだい", "");
speech = speech.replace("ちょーだい", "");
speech = speech.replace("です", "");
speech = speech.trim();


  // ゆれを吸収して正式名に変換
const mapped = aliasMap[speech] || speech;
if (flavors.includes(mapped)) {
    selectFlavor(mapped);
    speakMessage(`${mapped}ですね。ありがとうございます。`);

    // ★ 正しく認識できたときはテンポを速く（0.3秒）
    setTimeout(() => {
        recognition.start();
    }, 300); // ← ここを 600 → 300 に変更
} else {
    speakMessage("別の味を選んでください。");

    // ★ 間違えたときは少し遅く（1秒）
    setTimeout(() => {
        recognition.start();
    }, 1000); // ← ここを 600 → 1000 に変更
}
} // ← ★ここで閉じる（onresult の中の if/else の終わり）

}; // ← ★これが recognition.onresult の閉じカッコ＋セミコロン
