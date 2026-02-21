// commands/dice.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "dice",
  description: "Roll a dice (1-6)",
  category: "🎮 Mini-Games",
  async execute(interaction) {
    const roll = Math.floor(Math.random() * 6) + 1;

    const embed = new EmbedBuilder()
      .setTitle("🎲 Dice Roll")
      .setDescription(`You rolled a **${roll}**!`)
      .setColor("Orange")
      .setFooter({ text: "Naka Bot – Mini-Game" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};