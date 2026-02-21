// commands/ping.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Check bot latency",
  category: "🛠 Utility",
  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription(`Bot latency is **${latency}ms**`)
      .setColor("Green")
      .setFooter({ text: "Naka Bot – Utility Command" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};