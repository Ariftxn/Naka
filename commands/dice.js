export default {
  name: "dice",
  description: "Roll dice",
  async execute({ message, args }) {
    const sides = parseInt(args[0]) || 6;
    const roll = Math.floor(Math.random()*sides)+1;
    message.channel.send({ embeds:[{ title:"Dice Roll", description:`You rolled a ${roll} (1-${sides})`, color:0x9B59B6 }] });
  }
};