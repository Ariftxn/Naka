// commands/coinflip.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "coinflip",
  description: "Flip a coin (heads or tails)",
  category: "🎮 Mini-Games",
  async execute(interaction) {
    // Pilihan head atau tail secara random
    const choices = ["Heads 🪙", "Tails 🪙"];
    const result = choices[Math.floor(Math.random() * choices.length)];

    const embed = new EmbedBuilder()
      .setTitle("🎲 Coin Flip")
      .setDescription(`The coin landed on: **${result}**`)
      .setColor("Yellow")
      .setFooter({ text: "Naka Bot – Mini-Game" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};