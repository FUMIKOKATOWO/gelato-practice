const micButton = document.getElementById("micButton");
const speechDiv = document.querySelector(".speech");

micButton.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "ja-JP";
  recognition.start();

  recognition.onresult = (event) => {
    const userSpeech = event.results[0][0].transcript;
    if (userSpeech.includes("シングル")) {
      speechDiv.textContent = "シングルですね。ありがとうございます！";
    } else if (userSpeech.includes("ダブル")) {
      speechDiv.textContent = "ダブルですね。ありがとうございます！";
    } else {
      speechDiv.textContent = "もう一度お願いします。";
    }
  };
});
