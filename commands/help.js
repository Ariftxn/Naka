import { EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";

export default {
  name: "help",
  description: "Show all commands grouped by category",
  async execute(interaction) {
    // Path ke folder commands
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    // Siapkan kategori
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

    // Loop tiap file command
    for (const file of commandFiles) {
      if(file === "help.js") continue; // skip help sendiri
      const command = require(`./${file}`).default || require(`./${file}`);
      // Cek kategori command, default ke Other
      const category = command.category || "🔧 Other";
      if (!categories[category]) categories[category] = [];
      categories[category].push({
        name: `.${command.name}`,
        value: command.description || "No description",
      });
    }

    // Buat embed
    const embed = new EmbedBuilder()
      .setTitle("📜 Naka Bot Commands")
      .setColor("Blue")
      .setDescription("Here is the list of all available commands. Prefix: `.`")
      .setFooter({ text: "Naka Bot – All commands embed-based" });

    // Tambahkan field per kategori
    for (const [catName, cmds] of Object.entries(categories)) {
      if (cmds.length === 0) continue; // skip kategori kosong
      embed.addFields({
        name: catName,
        value: cmds.map(c => `**${c.name}** → ${c.value}`).join("\n"),
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};