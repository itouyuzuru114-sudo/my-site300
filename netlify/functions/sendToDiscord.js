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

  // ===== Discord Embed（おしゃれ）=====
  const payload = {
    username: "AI 顔診断ログ",
    embeds: [
      {
        title: "📸 顔診断結果",
        color: 0x6366f1, // 紫
        fields: [
          {
            name: "🧠 診断",
            value: `黄金比：**${score}%**\nランク：**${rank}**`,
            inline: false
          },
          {
            name: "🌐 アクセス情報",
            value: `IP：\`${ip}\`\nUA：\`${ua}\``,
            inline: false
          }
        ],
        footer: {
          text: `診断時刻：${time}`
        }
      }
    ]
  };

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return {
    statusCode: 200,
    body: "sent"
  };
};
