// commands/kick.js
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a member from the server",
  category: "⚔ Moderation",
  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    // Cek permission member
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: "❌ You don't have permission to kick members.", ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ content: "❌ User not found in this server.", ephemeral: true });

    try {
      await member.kick(reason);
      const embed = new EmbedBuilder()
        .setTitle("👢 Member Kicked")
        .setColor("Orange")
        .addFields(
          { name: "Kicked Member", value: `<@${member.id}>`, inline: true },
          { name: "Kicked By", value: `<@${interaction.user.id}>`, inline: true },
          { name: "Reason", value: reason, inline: false }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "❌ Unable to kick the member. Make sure my role is higher than the target.", ephemeral: true });
    }
  },
};