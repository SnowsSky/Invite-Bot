const { Client, GatewayIntentBits, Partials, Options } = require("discord.js");
const client = new Client({
    makeCache: Options.cacheWithLimits(Options.DefaultMakeCacheSettings),
    	sweepers: {
		...Options.DefaultSweeperSettings,
		messages: {
			interval: 3600, // Every hour...
			lifetime: 1800,	// Remove messages older than 30 minutes.
		},
		users: {
			interval: 3600, // Every hour...
			filter: () => user => user.bot && user.id !== client.user.id, // Remove all bots.
		},
	},
  intents: require("./config").intents,
  partials: require("./config").partials,
});


module.exports = client;
