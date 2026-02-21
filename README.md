# Naka Bot 🤖

**Naka Bot** is a full-featured Discord bot built with **discord.js v14**, designed for **moderation, fun mini-games, and role-based voucher systems**.  
It supports **prefix commands**, **slash commands**, and **custom prefixes per server**.

---

## 🌟 Features

### 1️⃣ Command System
- Supports **prefix commands** (default: `.`)  
- Supports **slash commands**  
- Customizable prefix per server (`.setprefix <prefix>`)

### 2️⃣ Moderation Commands
- `.ban <user> [reason]` → Ban a user  
- `.kick <user> [reason]` → Kick a user  
- `.warn <user> [reason]` → Issue a warning  
- `.userinfo <user>` → Show detailed user info  
- `.serverinfo` → Show server details

### 3️⃣ Voucher System
- Admin commands:
  - `/voucher create [code] [role] [maxredeem]` → Create voucher  
  - `/voucher list` → List all vouchers  
- User commands:
  - `.redeem <code>` → Redeem voucher and get role directly  
  - `/redeem <code>` → Slash version  
- Max redeem limit enforced  
- Redemption notifications via **embed messages**

### 4️⃣ Mini-Games 🎮
- `.coinflip <heads/tails>` → Flip a coin  
- `.dice` → Roll a dice  
- `.russianroulette` → Mini-game with 6-chamber random chance, embeds, and reactions

### 5️⃣ Help Command
- `.help` → Shows all commands categorized  
- Commands organized by category in **help embed**

---

## ⚙️ Setup

1. Clone the repository:

```bash
git clone https://github.com/Ariftxn/naka.git
cd naka