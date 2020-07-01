// Discord.js Lib
const Discord = require("discord.js");
const client = new Discord.Client();

// Load config.json
const config = require("./config.json");

// Kayn Lib
const { Kayn, REGIONS } = require('kayn');
const kayn = Kayn(process.env.API_KEY)({region: REGIONS.NORTH_AMERICA});

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

    const summonerName = args.join(" ");
    console.log(summonerName);

    kayn.Summoner.by.name(summonerName).callback(function(err, summoner) {
      if (!summoner){
        message.channel.send(`${summonerName} does not exist`);
      }else{
        kayn.League.Entries.by.summonerID(summoner.id).callback(function(err, sRank) {
          console.log(sRank);
            let soloq = sRank.filter(sRank => sRank.queueType === "RANKED_SOLO_5x5");
            let flexq = sRank.filter(sRank => sRank.queueType === "RANKED_FLEX_SR");
            if (soloq.length < 1 && flexq.length < 1){
              message.channel.send(`Summoner ${summonerName} is currently unranked`);
            }else{
            let rank = soloq[0].tier;
            let division = soloq[0].rank;
            let points = soloq[0].leaguePoints;
            let wins = soloq[0].wins;
            let losses = soloq[0].losses;
            var pWinRate = wins/losses;
            var winRate = pWinRate.toFixed(2);
            let flexRank = flexq[0].tier;
            let flexDivision = flexq[0].rank;
            let flexPoints = flexq[0].leaguePoints;
            let flexWins = flexq[0].wins;
            let flexLosses = flexq[0].losses;
            var flexPWinRate = flexWins/flexLosses;
            var flexWinRate = flexPWinRate.toFixed(2);

            // Rank Processing
            if (rank == "IRON") rank = "Iron", imagePath = "https://i.imgur.com/o1Zueal.png";
            if (rank == "BRONZE") rank = "Bronze", imagePath = "https://i.imgur.com/rs4SZvt.png";
            if (rank == "SILVER") rank = "Silver", imagePath = "https://i.imgur.com/RiLIAaW.png";
            if (rank == "GOLD") rank = "Gold", imagePath = "https://i.imgur.com/TPb2MTW.png";
            if (rank == "PLATINUM") rank = "Platinum", imagePath = "https://i.imgur.com/radVwv6.png";
            if (rank == "DIAMOND") rank = "Diamond", imagePath = "https://i.imgur.com/4tuGatb.png";
            if (rank == "MASTER") rank = "Master", imagePath = "https://i.imgur.com/Kl0C1nw.png";
            if (rank == "GRANDMASTER") rank = "Grandmaster", imagePath = "https://i.imgur.com/dWwxQ2c.png";
            if (rank == "CHALLENGER") rank = "Challenger", imagePath = "https://i.imgur.com/C42dBE6.png";

            // Embed

            const embed = new Discord.MessageEmbed()
            .setTitle(`${summonerName}'s Stats`)
            .setThumbnail(imagePath)
            .setColor(0xeb7e46)
            .addField('Solo/Duo', `**${rank} ${division} | ${points} LP**\n**Win Rate:** ${winRate}%`, true)
            .addField('Flex', `**${flexRank} ${flexDivision} | ${flexPoints} LP**\n**Win Rate:** ${flexWinRate}%`, true);

            return message.channel.send({ embed });
            }
        })
      }
    })
        
    }

});

client.login(process.env.BOT_TOKEN);