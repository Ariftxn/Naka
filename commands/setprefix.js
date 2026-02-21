const fs = require("fs");
const path = "./data/prefixes.json";

module.exports = {
  name: "setprefix",
  description: "Set custom prefix for this server",
  category: "⚙️ Utility",
  async executePrefix(message, args) {
    if (!message.member.permissions.has("Administrator")) return message.reply("❌ You need admin permission.");

    const newPrefix = args[0];
    if (!newPrefix) return message.reply("❌ Please provide a prefix.");

    const prefixes = JSON.parse(fs.readFileSync(path));
    prefixes[message.guild.id] = newPrefix;
    fs.writeFileSync(path, JSON.stringify(prefixes, null, 2));

    message.reply(`✅ Prefix has been updated to \`${newPrefix}\``);
  }
};