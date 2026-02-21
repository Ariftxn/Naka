// commands/warn.js
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = "./data/warns.json";

// Load warn data
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

module.exports = {
  name: "warn",
  description: "Warn a member",
  category: "⚔ Moderation",
  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    // Permission check
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: "❌ You don't have permission to warn members.", ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ content: "❌ User not found in server.", ephemeral: true });

    // Load existing warns
    let warns = JSON.parse(fs.readFileSync(path));
    if (!warns[interaction.guild.id]) warns[interaction.guild.id] = {};
    if (!warns[interaction.guild.id][member.id]) warns[interaction.guild.id][member.id] = [];

    // Add new warn
    warns[interaction.guild.id][member.id].push({
      moderator: interaction.user.id,
      reason: reason,
      timestamp: Date.now()
    });

    fs.writeFileSync(path, JSON.stringify(warns, null, 2));

    const embed = new EmbedBuilder()
      .setTitle("⚠️ Member Warned")
      .setColor("Orange")
      .addFields(
        { name: "Warned Member", value: `<@${member.id}>`, inline: true },
        { name: "Moderator", value: `<@${interaction.user.id}>`, inline: true },
        { name: "Reason", value: reason, inline: false },
        { name: "Total Warns", value: warns[interaction.guild.id][member.id].length.toString(), inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};