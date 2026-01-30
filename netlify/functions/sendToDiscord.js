export const handler = async (event) => {
  const webhook = process.env.DISCORD_WEBHOOK;

  if (!webhook) {
    return { statusCode: 500, body: "Webhook not set" };
  }

  const body = JSON.parse(event.body || "{}");

  const message = `
📸 顔診断結果
黄金比：${body.score ?? "?"}%
ランク：${body.rank ?? "?"}
`;

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
