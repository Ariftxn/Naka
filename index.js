import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Map();

// Load commands
const commandsPath = path.join('./commands');
fs.readdirSync(commandsPath).forEach(file => {
  if(file.endsWith('.js')){
    const command = await import(`./commands/${file}`);
    client.commands.set(command.default.name, command.default);
  }
});

// Ready
client.once("ready", () => {
  console.log(`🚀 Naka Bot is online as ${client.user.tag}`);
});

// Prefix commands
client.on("messageCreate", async message => {
  if(message.author.bot) return;
  if(!message.content.startsWith(process.env.PREFIX)) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if(!client.commands.has(commandName)) return;

  try {
    const command = client.commands.get(commandName);
    await command.execute({ client, message, args });
  } catch(err){
    console.error(err);
    message.reply("Error executing this command.");
  }
});

client.login(process.env.BOT_TOKEN);