export default {
  name: "coinflip",
  description: "Flip a coin",
  async execute({ message, args }) {
    const choice = args[0]?.toLowerCase();
    if(!choice || !["heads","tails"].includes(choice)) return message.reply("Use: .coinflip heads/tails");
    const result = Math.random()<0.5?"heads":"tails";
    message.channel.send({ embeds:[{ title:"Coin Flip", description:`You chose: ${choice}\nResult: ${result}`, color:0xF1C40F }] });
  }
};