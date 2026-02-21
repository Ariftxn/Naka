import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

export default {
  name: "russianroulette",
  description: "Play Russian Roulette mini-game",
  async execute(interaction) {
    let chambers = [0,0,0,0,0,0];
    const bulletIndex = Math.floor(Math.random() * 6);
    chambers[bulletIndex] = 1;

    let counter = 0;

    // initial embed
    const embed = new EmbedBuilder()
      .setTitle("Russian Roulette")
      .setDescription(`React with 🔫 to shoot! You have 6 chambers.\nShot: 0/6`)
      .setColor("Yellow");

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    // add reaction pistol
    await msg.react("🔫");

    const filter = (reaction, user) => reaction.emoji.name === "🔫" && !user.bot;
    const collector = msg.createReactionCollector({ filter, time: 60000 });

    collector.on("collect", async (reaction, user) => {
      if (chambers[counter] === 1) {
        // kena peluru
        embed
          .setColor("Red")
          .setDescription(`💥 BOOM! <@${user.id}> got shot!\nShot: ${counter + 1}/6`);
        await msg.edit({ embeds: [embed] });
        collector.stop();
      } else {
        // masih hidup
        counter++;
        if (counter === 6) {
          embed
            .setColor("Green")
            .setDescription(`🎉 Congratulations! <@${user.id}> survived all 6 shots!`);
          await msg.edit({ embeds: [embed] });
          collector.stop();
        } else {
          embed
            .setColor("Yellow")
            .setDescription(`💦 Safe! <@${user.id}> survived.\nShot: ${counter}/6`);
          await msg.edit({ embeds: [embed] });
        }
      }

      // remove user's reaction biar bisa react lagi
      const userReac = reaction.users.cache.get(user.id);
      if (userReac) await reaction.users.remove(user.id);
    });

    collector.on("end", async () => {
      embed.setFooter({ text: "Russian Roulette session ended." });
      await msg.edit({ embeds: [embed] });
    });
  },
};