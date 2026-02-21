export default {
  name: "help",
  description: "List all commands",
  async execute({ client, message }) {
    const embed = {
      title: "Naka Bot Commands",
      color: 0x00FF00,
      description: `Prefix: ${process.env.PREFIX}`,
      fields: []
    };

    client.commands.forEach(cmd => {
      embed.fields.push({
        name: `${process.env.PREFIX}${cmd.name}`,
        value: cmd.description || "No description",
        inline: false
      });
    });

    await message.channel.send({ embeds: [embed] });
  }
};