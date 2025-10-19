app.get("/api/reviews", async (req, res) => {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=10`,
      { headers: { Authorization: `Bot ${TOKEN}` } }
    );

    const messages = await response.json();

    if (!Array.isArray(messages)) {
      return res.status(500).send("Error fetching messages from Discord.");
    }

    const html = messages
      .map((m) => {
        const avatar = m.author.avatar
          ? `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.png?size=64`
          : "https://cdn.discordapp.com/embed/avatars/0.png"; // default avatar

        return `
        <div style="
          display:flex;
          align-items:flex-start;
          background:#2f3136;
          color:#dcddde;
          padding:12px;
          border-radius:8px;
          margin:10px 0;
          font-family:'Whitney','Helvetica Neue',Helvetica,Arial,sans-serif;
          box-shadow:0 2px 4px rgba(0,0,0,0.3);
        ">
          <img src="${avatar}"
               alt="${m.author.username}"
               style="width:48px;height:48px;border-radius:50%;margin-right:12px;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:8px;">
              <strong style="color:#fff;font-size:15px;">${m.author.username}</strong>
              <span style="color:#b9bbbe;font-size:12px;">${new Date(
                m.timestamp
              ).toLocaleString()}</span>
            </div>
            <div style="margin-top:4px;color:#dcddde;font-size:15px;line-height:1.4;">
              ${m.content || "<i>(no text message)</i>"}
            </div>
          </div>
        </div>`;
      })
      .join("");

    res.setHeader("Content-Type", "text/html");
    res.send(`
      <body style="background:#36393f;margin:0;padding:20px;">
        <h2 style="color:#fff;font-family:Whitney,Helvetica,Arial,sans-serif;margin-bottom:20px;">
          ⭐ Latest Discord Reviews
        </h2>
        ${html}
      </body>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching reviews.");
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
