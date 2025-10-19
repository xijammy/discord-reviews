export default async function handler(req, res) {
  const TOKEN = process.env.BOT_TOKEN;
  const CHANNEL_ID = process.env.CHANNEL_ID;

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=10`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
        },
      }
    );

    const messages = await response.json();

    if (!Array.isArray(messages)) {
      return res.status(500).send("Error fetching messages");
    }

    const html = messages
      .map(
        (m) => `
        <div style="background:#23272A;color:#fff;padding:10px;border-radius:10px;margin:10px;font-family:sans-serif;">
          <strong>${m.author.username}</strong><br>
          ${m.content}<br>
          <small>${new Date(m.timestamp).toLocaleString()}</small>
        </div>`
      )
      .join("");

    res.setHeader("Content-Type", "text/html");
    res.send(`<body style="background:#0d1117">${html}</body>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching reviews");
  }
}
