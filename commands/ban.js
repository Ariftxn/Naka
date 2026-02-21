// commands/ban.js
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Ban a member from the server",
  category: "⚔ Moderation",
  async execute(interaction) {
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    // Cek jika bot punya permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: "❌ You don't have permission to ban members.", ephemeral: true });
    }

    const member = interaction.guild.members.cache.get(target.id);
    if (!member) return interaction.reply({ content: "❌ User not found in this server.", ephemeral: true });

    try {
      await member.ban({ reason });
      const embed = new EmbedBuilder()
        .setTitle("🔨 Member Banned")
        .setColor("Red")
        .addFields(
          { name: "Banned Member", value: `<@${member.id}>`, inline: true },
          { name: "Banned By", value: `<@${interaction.user.id}>`, inline: true },
          { name: "Reason", value: reason, inline: false }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: "❌ Unable to ban the member. Make sure my role is higher than the target.", ephemeral: true });
    }
  },
};