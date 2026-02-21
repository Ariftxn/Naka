import fs from "fs-extra";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "voucher",
  description: "Voucher system (create/redeem/list)",
  async execute({ message, args }) {
    const sub = args[0];
    if(!message.member.permissions.has("Administrator")) return message.reply("No perms.");

    const file = "./data/vouchers.json";
    const vouchers = await fs.readJson(file).catch(()=>[]);

    if(sub === "create"){
      const roleName = args[1];
      const maxRedeem = parseInt(args[2]) || 1;
      const code = uuidv4().slice(0,12).toUpperCase();
      vouchers.push({ code, role: roleName, maxRedeem, redeemed: [] });
      await fs.writeJson(file, vouchers, { spaces: 2 });
      message.channel.send({ embeds: [{ title: "Voucher Created", description: `Code: ${code}\nRole: ${roleName}\nMax Redeem: ${maxRedeem}`, color: 0x2ECC71 }] });
    } else if(sub === "list"){
      if(vouchers.length===0) return message.reply("No vouchers.");
      const embed = { title:"Vouchers List", color:0x3498DB, fields:[] };
      vouchers.forEach(v=>embed.fields.push({ name:v.code, value:`Role: ${v.role} | Redeemed: ${v.redeemed.length}/${v.maxRedeem}`, inline:false }));
      message.channel.send({ embeds:[embed] });
    } else if(sub==="redeem"){
      const code = args[1];
      const member = message.member;
      const voucher = vouchers.find(v=>v.code===code);
      if(!voucher) return message.reply("Invalid code.");
      if(voucher.redeemed.includes(member.id)) return message.reply("You already redeemed this.");
      if(voucher.redeemed.length >= voucher.maxRedeem) return message.reply("Max redeems reached.");
      const role = message.guild.roles.cache.find(r=>r.name===voucher.role);
      if(!role) return message.reply("Role not found.");
      await member.roles.add(role);
      voucher.redeemed.push(member.id);
      await fs.writeJson(file, vouchers, { spaces: 2 });
      message.channel.send({ embeds:[{ title:"Voucher Redeemed", description:`Role ${role.name} added!`, color:0x2ECC71 }] });
    } else {
      message.reply("Usage: create/list/redeem");
    }
  }
};