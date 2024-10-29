const { Collection } = require("discord.js");
const client = require("./Clients/DiscordJS");
const { readdirSync } = require("fs");
const config = require("./config");
const { EmbedBuilder } = require("discord.js")
require("dotenv").config();
client.messageCmd = new Collection();

client.slashCmd = new Collection();
client.events = new Collection();
require("./Handler/Events")(client);
require("./db.js")
require("./Handler/Message")(client);
require("./Handler/Slash")(client);
client.cooldowns = new Collection();
client.handleEvents();


client.login();



process.on("unhandledRejection", (err, promise) => {
 
  // Needed
  console.error("[ANTICRASH] :: [unhandledRejection]");
  console.log(promise, err);
  console.error("[ANTICRASH] :: [unhandledRejection] END");
});
process.on("uncaughtException", (err, origin) => {
    
  console.error("[ANTICRASH] :: [uncaughtException]");
  console.log(err, origin);
  console.error("[ANTICRASH] :: [uncaughtException] END");
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.error("[ANTICRASH] :: [uncaughtExceptionMonitor]");
  console.log(err, origin);
  console.error("[ANTICRASH] :: [uncaughtExceptionMonitor] END");
 
});





