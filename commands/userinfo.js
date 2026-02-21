// commands/userinfo.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Get information about a user",
  category: "ℹ️ Info",
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 User Info: ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "Username", value: user.username, inline: true },
        { name: "Tag", value: `#${user.discriminator}`, inline: true },
        { name: "ID", value: user.id, inline: true },
        { name: "Joined Server", value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Unknown", inline: true },
        { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Bot?", value: user.bot ? "Yes 🤖" : "No 👤", inline: true }
      )
      .setColor("Blue")
      .setFooter({ text: "Naka Bot – User Info" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};