import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Homepage
app.get("/", (req, res) => {
  res.send(`
    <body style="background:#0d1117; color:white; font-family:sans-serif; text-align:center; margin-top:100px;">
      <h1>✅ Discord Reviews API is Live</h1>
      <p>View <a href="/api/reviews" style="color:#58a6ff;">Discord Reviews</a></p>
    </body>
  `);
});

// Reviews route
app.get("/api/reviews", async (req, res) => {
  try {
    // Fetch the latest messages from your reviews channel
    const response = await fetch(
      `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=25`, // Get up to 25 newest
      { headers: { Authorization: `Bot ${TOKEN}` } }
    );

    const messages = await response.json();

    if (!Array.isArray(messages)) {
      return res.status(500).send("Error fetching messages from Discord.");
    }

    // Sort newest → oldest (Discord API returns newest first)
    const sortedMessages = messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    const html = sortedMessages
      .map(
        (m) => `
        <div style="
          background:#2b2d31;
          color:#fff;
          padding:14px;
          border-radius:12px;
          margin:14px auto;
          max-width:600px;
          display:flex;
          align-items:flex-start;
          gap:12px;
          box-shadow:0 0 10px rgba(0,0,0,0.3);
          font-family: 'Segoe UI', sans-serif;
        ">
          <img src="https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.png" 
               alt="pfp" 
               style="width:48px;height:48px;border-radius:50%;">
          <div>
            <div style="font-weight:600;font-size:15px;color:#e0e0e0;">
              ${m.author.global_name || m.author.username}
              <span style="color:#888;font-size:12px;">• ${new Date(m.timestamp).toLocaleString()}</span>
            </div>
            <div style="margin-top:6px;font-size:14px;line-height:1.5;color:#ddd;">
              ${m.content || ""}
            </div>
          </div>
        </div>`
      )
      .join("");

    res.setHeader("Content-Type", "text/html");
    res.send(`
      <body style="background:#0d1117;margin:0;padding:20px;">
        ${html}
        <script>
          // 🔁 Auto-refresh every 60 seconds for newest reviews
          setTimeout(() => location.reload(), 60000);
        </script>
      </body>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching reviews.");
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
