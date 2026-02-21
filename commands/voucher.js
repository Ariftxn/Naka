// commands/voucher.js
const fs = require("fs");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const path = "./data/vouchers.json";

// Load vouchers.json, buat kalau belum ada
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));

module.exports = {
  name: "voucher",
  description: "Create or redeem a voucher",
  category: "🎟 Vouchers",
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    let vouchers = JSON.parse(fs.readFileSync(path));

    // ===== CREATE VOUCHER (ADMIN ONLY) =====
    if (subcommand === "create") {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: "❌ Only admins can create vouchers.", ephemeral: true });
      }

      const code = interaction.options.getString("code") || Math.random().toString(36).slice(2, 14).toUpperCase();
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

    // ===== REDEEM VOUCHER =====
    if (subcommand === "redeem") {
      const code = interaction.options.getString("code").toUpperCase();
      const voucher = vouchers.find(v => v.code === code);

      if (!voucher) return interaction.reply({ content: "❌ Voucher not found.", ephemeral: true });
      if (voucher.redeemedBy.includes(interaction.user.id)) return interaction.reply({ content: "❌ You have already redeemed this voucher.", ephemeral: true });
      if (voucher.redeemedBy.length >= voucher.maxRedeem) return interaction.reply({ content: "❌ This voucher has reached max redeem limit.", ephemeral: true });

      const member = interaction.guild.members.cache.get(interaction.user.id);
      if (!member) return interaction.reply({ content: "❌ User not found in server.", ephemeral: true });

      try {
        await member.roles.add(voucher.roleId);
        voucher.redeemedBy.push(interaction.user.id);
        fs.writeFileSync(path, JSON.stringify(vouchers, null, 2));

        const embed = new EmbedBuilder()
          .setTitle("🎉 Voucher Redeemed!")
          .setColor("Blue")
          .setDescription(`You received the role <@&${voucher.roleId}>`)
          .addFields({ name: "Voucher Code", value: voucher.code });
        return interaction.reply({ embeds: [embed] });
      } catch (err) {
        console.error(err);
        return interaction.reply({ content: "❌ Failed to give the role. Make sure bot has permission.", ephemeral: true });
      }
    }

    // ===== LIST VOUCHERS =====
    if (subcommand === "list") {
      const embed = new EmbedBuilder()
        .setTitle("📜 Voucher List")
        .setColor("Yellow")
        .setDescription(vouchers.length ? vouchers.map(v => {
          return `**${v.code}** → Role: <@&${v.roleId}> | Redeemed: ${v.redeemedBy.length}/${v.maxRedeem}`;
        }).join("\n") : "No vouchers yet.");

      return interaction.reply({ embeds: [embed] });
    }
  },
};