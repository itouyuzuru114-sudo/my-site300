import fetch from "node-fetch";
import FormData from "form-data";

export const handler = async (event) => {
  try {
    const { image } = JSON.parse(event.body);

    if (!image) {
      return { statusCode: 400, body: "no image" };
    }

    // base64 → buffer
    const buffer = Buffer.from(image.split(",")[1], "base64");

    const form = new FormData();
    form.append("file", buffer, {
      filename: "face.png",
      contentType: "image/png"
    });

    form.append(
      "content",
      "📸 診断用画像（身内テスト）"
    );

    const res = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    });

    if (!res.ok) {
      throw new Error("discord error");
    }

    return { statusCode: 200, body: "ok" };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
