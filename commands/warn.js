export default {
  name: "warn",
  description: "Warn a member",
  async execute({ client, message, args }) {
    if(!message.member.permissions.has("Administrator")) return message.reply("You don't have permission.");
    const member = message.mentions.members.first();
    if(!member) return message.reply("Mention a member.");
    const reason = args.slice(1).join(" ") || "No reason provided.";
    
    const embed = {
      title: "Member Warned",
      color: 0xE74C3C,
      fields: [
        { name: "User", value: member.toString(), inline: true },
        { name: "By", value: message.author.toString(), inline: true },
        { name: "Reason", value: reason }
      ],
      timestamp: new Date()
    };
    
    message.channel.send({ embeds: [embed] });
  }
};