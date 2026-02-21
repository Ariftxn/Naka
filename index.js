// index.js
require("dotenv").config();
const fs = require("fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// ===== LOAD COMMANDS =====
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.name) client.commands.set(command.name, command);
}

// ===== LOAD PREFIXES =====
const prefixPath = "./data/prefixes.json";
if (!fs.existsSync(prefixPath)) fs.writeFileSync(prefixPath, JSON.stringify({}));
let prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));

// ===== PREFIX COMMAND HANDLER =====
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const guildId = message.guild.id;
  const prefix = prefixes[guildId] || process.env.PREFIX || ".";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const command = client.commands.get(cmdName);

  if (!command || !command.executePrefix) return;

  try {
    await command.executePrefix(message, args);
  } catch (err) {
    console.error(err);
    message.reply("❌ Something went wrong executing that command.");
  }
});

// ===== SLASH COMMAND HANDLER =====
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    interaction.reply({ content: "❌ Something went wrong executing that command.", ephemeral: true });
  }
});

// ===== BOT READY =====
client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
  client.user.setActivity(".help | Naka Bot", { type: "WATCHING" });
});

// ===== SAVE PREFIXES ON JOIN =====
client.on("guildCreate", (guild) => {
  if (!prefixes[guild.id]) {
    prefixes[guild.id] = process.env.PREFIX || ".";
    fs.writeFileSync(prefixPath, JSON.stringify(prefixes, null, 2));
  }
});

// ===== LOGIN =====
client.login(process.env.BOT_TOKEN);