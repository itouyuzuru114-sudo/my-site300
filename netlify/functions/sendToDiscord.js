export const handler = async (event) => {
  try {
    const webhook = process.env.DISCORD_WEBHOOK;
    if (!webhook) {
      return { statusCode: 200, body: "no webhook" };
    }

    const { score, rank } = JSON.parse(event.body || "{}");

    const ip =
      event.headers["x-forwarded-for"]?.split(",")[0] || "unknown";
    const ua = event.headers["user-agent"] || "unknown";

    const time = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo"
    });

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{
          title: "📸 顔診断結果",
          color: 0x6366f1,
          fields: [
            { name: "診断", value: `黄金比 ${score}%\nランク ${rank}` },
            { name: "IP", value: ip },
            { name: "UA", value: ua }
          ],
          footer: { text: time }
        }]
      })
    });

    return { statusCode: 200, body: "sent" };
  } catch (e) {
    return { statusCode: 200, body: "error but ok" };
  }
};
