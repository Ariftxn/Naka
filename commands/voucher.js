// commands/voucher.js
const fs = require("fs");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const path = "./data/vouchers.json";
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));

module.exports = {
  name: "voucher",
  description: "Create or list vouchers (admin only)",
  category: "🎟 Vouchers",

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let vouchers = JSON.parse(fs.readFileSync(path));

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return interaction.reply({ content: "❌ Only admins can manage vouchers.", ephemeral: true });

    if (subcommand === "create") {
      const code = interaction.options.getString("code") || Math.random().toString(36).slice(2,14).toUpperCase();
      const role = interaction.options.getRole("role");
      const maxRedeem = interaction.options.getInteger("maxredeem") || 1;

      vouchers.push({ code, roleId: role.id, maxRedeem, redeemedBy: [] });
      fs.writeFileSync(path, JSON.stringify(vouchers, null, 2));

      const embed = new EmbedBuilder()
        .setTitle("✅ Voucher Created")
        .setColor("Green")
        .addFields(
          { name: "Code", value: code },
          { name: "Role", value: `<@&${role.id}>` },
          { name: "Max Redeem", value: maxRedeem.toString() }
        );
      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === "list") {
      const embed = new EmbedBuilder()
        .setTitle("📜 Voucher List")
        .setColor("Yellow")
        .setDescription(vouchers.length ? vouchers.map(v => `**${v.code}** → <@&${v.roleId}> (${v.redeemedBy.length}/${v.maxRedeem})`).join("\n") : "No vouchers yet.");
      return interaction.reply({ embeds: [embed] });
    }
  },

  async executePrefix(message, args) {
    const subcommand = args[0]?.toLowerCase();
    let vouchers = JSON.parse(fs.readFileSync(path));

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator))
      return message.reply("❌ Only admins can manage vouchers.");

    if (subcommand === "create") {
      const code = args[1] || Math.random().toString(36).slice(2,14).toUpperCase();
      const roleId = args[2]?.replace(/[<@&>]/g, "");
      const maxRedeem = parseInt(args[3]) || 1;

      if (!roleId) return message.reply("❌ Please provide a role.");

      vouchers.push({ code, roleId, maxRedeem, redeemedBy: [] });
      fs.writeFileSync(path, JSON.stringify(vouchers, null, 2));

      message.reply(`✅ Voucher created: **${code}** for role <@&${roleId}>`);
    }

    if (subcommand === "list") {
      const list = vouchers.length ? vouchers.map(v => `**${v.code}** → <@&${v.roleId}> (${v.redeemedBy.length}/${v.maxRedeem})`).join("\n") : "No vouchers yet.";
      message.reply(list);
    }
  }
};