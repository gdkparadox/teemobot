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
    if(message.channel.type === "dm"){
      return message.channel.send("Please use the commands in a discord channel");
    }

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "stats") {

    const summonerName = args;

    kayn.Summoner.by.name(summonerName).callback(function(err, summoner) {
      if (!summoner){
        message.channel.send(`${summonerName} does not exist`);
      }else{
        kayn.League.Entries.by.summonerID(summoner.id).callback(function(err, sRank) {
            let found = sRank.filter(sRank => sRank.queueType === "RANKED_SOLO_5x5");
            if (found.length < 1){
              message.channel.send(`Summoner ${summonerName} is currently unranked`);
            }else{
            console.log(found);
            let rank = found[0].tier;
            let imagePath = "";
            let color = "";
            let division = found[0].rank;
            let points = found[0].leaguePoints;
            let wins = found[0].wins;
            let losses = found[0].losses;
            var pWinRate = wins/losses;
            var winRate = pWinRate.toFixed(2);

            // Rank Processing
            if (rank == "IRON") rank = "Iron", imagePath = "images/Emblem_Iron.png";
            if (rank == "BRONZE") rank = "Bronze", imagePath = "images/Emblem_Bronze.png";
            if (rank == "SILVER") rank = "Silver", imagePath = "images/Emblem_Silver.png";
            if (rank == "GOLD") rank = "Gold", imagePath = "images/Emblem_Gold.png";
            if (rank == "PLATINUM") rank = "Platinum", imagePath = "images/Emblem_Platinum.png";
            if (rank == "DIAMOND") rank = "Diamond", imagePath = "images/Emblem_Diamond.png";
            if (rank == "MASTER") rank = "Master", imagePath = "images/Emblem_Master.png";
            if (rank == "GRANDMASTER") rank = "Grandmaster", imagePath = "images/Emblem_Grandmaster.png";
            if (rank == "CHALLENGER") rank = "Challenger", imagePath = "images/Emblem_Challenger.png";
            console.log(imagePath);

            // Embed
            const image = new Discord.MessageAttachment(imagePath, 'image');

            const embed = new Discord.MessageEmbed()
            .setTitle(`${summonerName}'s Stats`)
            .setThumbnail('attachment://image')
            .setColor(0xeb7e46)
            .addField('\u200b', `**${rank} ${division}**\n${points} points`)
            .addField('\u200b', `**Win Rate:**\n${winRate}%`);

            return message.channel.send({ embed });
            }
        })
      }
    })
        
    }

});

client.login(config.token);