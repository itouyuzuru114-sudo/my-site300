exports.handler = async () => {
  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: "テスト成功" })
  });

  return {
    statusCode: 200,
    body: "sent"
  };
};
