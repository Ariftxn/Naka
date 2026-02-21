// commands/redeem.js
const fs = require("fs");
const { EmbedBuilder } = require("discord.js");
const path = "./data/vouchers.json";
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));

module.exports = {
  name: "redeem",
  description: "Redeem a voucher code",
  category: "🎟 Vouchers",

  // Slash command
  async execute(interaction) {
    const code = interaction.options.getString("code").toUpperCase();
    let vouchers = JSON.parse(fs.readFileSync(path));
    const voucher = vouchers.find(v => v.code === code);
    if (!voucher) return interaction.reply({ content: "❌ Voucher not found.", ephemeral: true });
    if (voucher.redeemedBy.includes(interaction.user.id))
      return interaction.reply({ content: "❌ You already redeemed this voucher.", ephemeral: true });
    if (voucher.redeemedBy.length >= voucher.maxRedeem)
      return interaction.reply({ content: "❌ Voucher max redeem reached.", ephemeral: true });

    const member = interaction.guild.members.cache.get(interaction.user.id);
    await member.roles.add(voucher.roleId);
    voucher.redeemedBy.push(interaction.user.id);
    fs.writeFileSync(path, JSON.stringify(vouchers, null, 2));

    const embed = new EmbedBuilder()
      .setTitle("🎉 Voucher Redeemed")
      .setColor("Blue")
      .setDescription(`You received <@&${voucher.roleId}>`)
      .addFields({ name: "Code", value: voucher.code });
    return interaction.reply({ embeds: [embed] });
  },

  // Prefix command
  async executePrefix(message, args) {
    const code = args[0]?.toUpperCase();
    if (!code) return message.reply("❌ Please provide a voucher code.");

    let vouchers = JSON.parse(fs.readFileSync(path));
    const voucher = vouchers.find(v => v.code === code);
    if (!voucher) return message.reply("❌ Voucher not found.");
    if (voucher.redeemedBy.includes(message.author.id)) return message.reply("❌ Already redeemed.");
    if (voucher.redeemedBy.length >= voucher.maxRedeem) return message.reply("❌ Voucher max redeem reached.");

    const member = message.guild.members.cache.get(message.author.id);
    await member.roles.add(voucher.roleId);
    voucher.redeemedBy.push(message.author.id);
    fs.writeFileSync(path, JSON.stringify(vouchers, null, 2));

    message.reply(`🎉 Voucher redeemed! You got <@&${voucher.roleId}>`);
  }
};