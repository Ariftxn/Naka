// index.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

// ======== Discord Client Setup ========
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// ======== Load all commands from root commands folder ========
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(path.join(__dirname, "commands", file));
  if (command.name) client.commands.set(command.name, command);
}

// ======== Load prefixes ========
const prefixPath = path.join(__dirname, "data", "prefixes.json");
if (!fs.existsSync(prefixPath)) fs.writeFileSync(prefixPath, JSON.stringify({}));
let prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));

// ======== PREFIX COMMAND HANDLER ========
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

// ======== SLASH COMMAND HANDLER ========
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

// ======== DASHBOARD SETUP ========
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  res.render("home/index", { user: client.user ? client.user.tag : "Loading..." });
});

// Commands route
app.get("/commands", (req, res) => {
  const commands = Array.from(client.commands.values());
  res.render("commands/index", { commands });
});

// Vouchers route
app.get("/vouchers", (req, res) => {
  const voucherPath = path.join(__dirname, "data", "vouchers.json");
  if (!fs.existsSync(voucherPath)) fs.writeFileSync(voucherPath, JSON.stringify([]));
  const vouchers = JSON.parse(fs.readFileSync(voucherPath, "utf-8"));
  res.render("vouchers/list", { vouchers });
});

// Roles route
app.get("/roles", (req, res) => {
  res.render("roles/index", { guilds: client.guilds.cache });
});

// Mini-games route
app.get("/minigames", (req, res) => {
  res.render("mini-games/index");
});

// Dashboard server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dashboard running at http://localhost:${PORT}`));

// ======== BOT READY ========
client.once("ready", () => {
  console.log(`${client.user.tag} is online!`);
  client.user.setActivity(".help | Naka Bot", { type: "WATCHING" });
});

// ======== SAVE PREFIXES ON GUILD JOIN ========
client.on("guildCreate", (guild) => {
  if (!prefixes[guild.id]) {
    prefixes[guild.id] = process.env.PREFIX || ".";
    fs.writeFileSync(prefixPath, JSON.stringify(prefixes, null, 2));
  }
});

// ======== LOGIN ========
client.login(process.env.BOT_TOKEN);