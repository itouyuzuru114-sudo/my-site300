export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const image = body.image;
    if (!image) {
      return { statusCode: 400, body: "no image" };
    }

    // base64 → バイナリ
    const base64 = image.split(",")[1];
    const buffer = Buffer.from(base64, "base64");
    const blob = new Blob([buffer], { type: "image/png" });

    const form = new FormData();
    form.append("file", blob, "face.png");
    form.append("content", "📸 新しい画像が送信されました");

    const res = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      body: form
    });

    if (!res.ok) {
      throw new Error("Discord webhook error");
    }

    return {
      statusCode: 200,
      body: "ok"
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.message
    };
  }
};
