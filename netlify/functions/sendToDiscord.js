export const handler = async (event) => {
  const webhook = process.env.DISCORD_WEBHOOK;
  if (!webhook) {
    return { statusCode: 500, body: "Webhook not set" };
  }

  const { score, rank } = JSON.parse(event.body || "{}");

  // ===== IP & UA 取得 =====
  const ip =
    event.headers["x-forwarded-for"]?.split(",")[0] ||
    event.headers["client-ip"] ||
    "unknown";

  const ua = event.headers["user-agent"] || "unknown";

  const time = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo"
  });

  // ===== Discordに送る内容 =====
  const message =
`📸 顔診断結果
黄金比：${score}%
ランク：${rank}

🌐 IP：${ip}
🖥 UA：${ua}
⏰ 時刻：${time}`;

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message })
  });

  return {
    statusCode: 200,
    body: "sent"
  };
};
