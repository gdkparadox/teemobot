// Load libs
const Discord = require("discord.js");
const client = new Discord.Client();

// Load config.json
const config = require("./config.json");

client.on("ready", () => {

  // Ready Message
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

  client.user.setActivity(`$help`, { type: 'LISTENING' });
});

//Throw error exception into console
client.on('error', console.error);
// End of error exceptions

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  (`$help`, { type: 'LISTENING' });
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`$help`, { type: 'LISTENING' });
});


client.on("message", async message => {



});

client.login(config.token);