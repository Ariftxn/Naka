export default {
  name: "ban",
  description: "Ban a member",
  async execute({ message, args }) {
    if(!message.member.permissions.has("BanMembers")) return message.reply("No perms.");
    const member = message.mentions.members.first();
    if(!member) return message.reply("Mention a member.");
    const reason = args.slice(1).join(" ") || "No reason.";
    try {
      await member.ban({ reason });
      message.channel.send({ embeds: [{ title: `Banned ${member.user.tag}`, description: `Reason: ${reason}`, color: 0xE74C3C }] });
    } catch(err) { message.reply("Error banning member."); }
  }
};