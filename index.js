// Discord.js Lib
const Discord = require("discord.js");
const client = new Discord.Client();

// Load config.json
const config = require("./config.json");

// Kayn Lib
const { Kayn, REGIONS } = require('kayn');
const kayn = Kayn(config.apikey)({region: REGIONS.EUROPE_WEST});

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

    const summonerName = args;
    console.log(summonerName);

    kayn.Summoner.by.name(summonerName).callback(function(err, summoner) {
        kayn.League.Entries.by.summonerID(summoner.id).callback(function(err, sRank) {
            console.log(sRank);
            let found = sRank.filter(sRank => sRank.queueType === "RANKED_SOLO_5x5");
            if (!found[0]){
              message.channel.send(`Summoner ${summonerName} does not have Solo Queue ranked games or this account doesn't exist`);
            }
            let rank = found[0].tier;
            if (rank == "IRON") {rank = "Iron";}
            if (rank == "BRONZE") rank = "Bronze";
            if (rank == "SILVER") rank = "Silver";
            if (rank == "GOLD") rank = "Gold";
            if (rank == "PLATINUM") rank = "Platinum";
            if (rank == "DIAMOND") rank = "Diamond";
            if (rank == "MASTER") rank = "Master";
            if (rank == "GRANDMASTER") rank = "Grandmaster";
            if (rank == "CHALLENGER") rank = "Challenger";
            message.channel.send(`${summonerName} is ${rank}`);
        })
    })
        
    }

});

client.login(config.token);