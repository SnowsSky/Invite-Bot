const { ShardingManager } = require("discord.js");
require("dotenv").config();
const client = require("./Clients/DiscordJS");
const manager = new ShardingManager("./bot.js", { token: process.env.TOKEN, totalShards: "auto" });

manager.on("shardCreate", (shard, client) => console.log(`Le shard ${shard.id} a démarré`));

manager.spawn();


