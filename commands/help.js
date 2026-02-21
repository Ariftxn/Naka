// commands/help.js
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "help",
  description: "Show all commands grouped by category",
  category: "🛠 Utility",
  executePrefix: async (message, args) => {
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    const categories = {
      "🎮 Mini-Games": [],
      "🛠 Utility": [],
      "⚔ Moderation": [],
      "🎟 Vouchers": [],
      "🎫 Tickets": [],
      "💡 Fun": [],
      "ℹ️ Info": [],
      "🔧 Other": [],
    };

    for (const file of commandFiles) {
      if (file === "help.js") continue;
      const command = require(path.join(__dirname, file));
      const category = command.category || "🔧 Other";
      if (!categories[category]) categories[category] = [];
      categories[category].push({
        name: `.${command.name}`,
        value: command.description || "No description",
      });
    }

    const embed = new MessageEmbed()
      .setTitle("📜 Naka Bot Commands")
      .setColor("BLUE")
      .setDescription("Here is the list of all available commands. Prefix: `.`")
      .setFooter({ text: "Naka Bot – All commands embed-based" });

    for (const [catName, cmds] of Object.entries(categories)) {
      if (cmds.length === 0) continue;
      embed.addFields({
        name: catName,
        value: cmds.map(c => `**${c.name}** → ${c.value}`).join("\n"),
      });
    }

    message.channel.send({ embeds: [embed] });
  },
};