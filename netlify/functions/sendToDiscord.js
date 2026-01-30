function sendToDiscord(base64Image, score, rank) {
  const formData = new FormData();

  // 画像をファイルとして追加
  formData.append(
    "file",
    dataURLtoBlob(base64Image),
    "face.png"
  );

  // Discordに送るメッセージ本文
  formData.append(
    "payload_json",
    JSON.stringify({
      content: `📸 顔診断結果\n黄金比：${score}%\nランク：${rank}`
    })
  );

  fetch(WEBHOOK_URL, {
    method: "POST",
    body: formData
  });
}
