require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

/* ===================== DISCORD CLIENT ===================== */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

/* ===================== LOAD COMMANDS ===================== */

const commandsPath = path.join(__dirname, "commands");

if (!fs.existsSync(commandsPath)) {
  fs.mkdirSync(commandsPath);
}

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.name) {
    client.commands.set(command.name, command);
  }
}

/* ===================== PREFIX SYSTEM ===================== */

const dataPath = path.join(__dirname, "data");
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

const prefixPath = path.join(dataPath, "prefixes.json");
if (!fs.existsSync(prefixPath)) {
  fs.writeFileSync(prefixPath, JSON.stringify({}));
}

let prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const prefix = prefixes[message.guild.id] || process.env.PREFIX || ".";

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = client.commands.get(cmdName);
  if (!command || !command.executePrefix) return;

  try {
    await command.executePrefix(message, args);
  } catch (err) {
    console.error("Command Error:", err);
    message.reply("❌ Error executing command.");
  }
});

/* ===================== EXPRESS DASHBOARD ===================== */

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // penting!
app.use(express.static(path.join(__dirname, "public"))); // supaya css kebaca
app.use(express.urlencoded({ extended: true }));

/* ---------- ROUTES ---------- */

// Home
app.get("/", (req, res) => {
  res.render("home/index", {
    bot: client.user ? client.user.tag : "Bot not ready"
  });
});

// Commands page
app.get("/commands", (req, res) => {
  const commands = Array.from(client.commands.values());
  res.render("commands/index", { commands });
});

// Simple fallback route
app.use((req, res) => {
  res.status(404).send("404 Page Not Found");
});

/* ===================== START SERVER ===================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌐 Dashboard running at http://localhost:${PORT}`);
});

/* ===================== BOT READY ===================== */

client.once("ready", () => {
  console.log(`🤖 ${client.user.tag} is online!`);
});

/* ===================== LOGIN ===================== */

client.login(process.env.BOT_TOKEN);