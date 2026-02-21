export default {
  name: "userinfo",
  description: "Show info about a member",
  async execute({ message, args }) {
    const member = message.mentions.members.first() || message.member;
    const embed = {
      title: `User Info: ${member.user.tag}`,
      thumbnail: { url: member.user.displayAvatarURL({ dynamic: true }) },
      color: 0x3498DB,
      fields: [
        { name: "ID", value: member.id, inline: true },
        { name: "Bot?", value: member.user.bot ? "Yes" : "No", inline: true },
        { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp/1000)}:f>`, inline: false },
        { name: "Roles", value: member.roles.cache.map(r => r.toString()).join(", ") || "None", inline: false }
      ]
    };
    message.channel.send({ embeds: [embed] });
  }
};