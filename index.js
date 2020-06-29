// Discord.js Lib
const Discord = require("discord.js");
const client = new Discord.Client();

// Load config.json
const config = require("./config.json");

// Kayn Lib
const { Kayn, REGIONS } = require('kayn');
const kayn = Kayn(config.apikey)({region: REGIONS.EUROPE_WEST});

kayn.Summoner.by.name('AyyyyyLmao').callback(function(err, summoner) {
    kayn.League.Entries.by.summonerID(summoner.id).callback(function(err, rank) {
        console.log(rank);
        let result = rank.map(a => a.queueType);
        var found = rank.find(function (element, index, arr) { 
            return element === "RANKED_SOLO_5x5"; 
        }); 
        console.log(found);
    })
})

kayn.League.Entries.by.summonerID()

client.on("ready", () => {

  // Ready Message
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);

  client.user.setActivity(`${config.prefix}help`, { type: 'LISTENING' });
});

//Throw error exception into console
client.on('error', console.error);
// End of error exceptions

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  (`${config.prefix}help`, { type: 'LISTENING' });
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`${config.prefix}help`, { type: 'LISTENING' });
});


client.on("message", async message => {

    // Check if bot and prefix
    if(message.author.bot) return;
    if(!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    if (command === "help"){

    }

    if (command === "stats") {

        const region = args[0];
        if (region.toLowerCase === "euw") region = euw1;
        const summonerName = message.mentions.members.first();

        api.get(region, 'summoner.getBySummonerName', summonerName)
        .then(data => message.channel.send(data.name + "'s summoner id is " + data.id + '.'));
        
    }

});

client.login(config.token);