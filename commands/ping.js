export default {
  name: "ping",
  description: "Check bot latency",
  async execute({ message }) {
    const msg = await message.channel.send("Pinging...");
    msg.edit(`Pong! Latency: ${msg.createdTimestamp - message.createdTimestamp}ms`);
  }
};