// Discord.js Lib
const Discord = require("discord.js");
const client = new Discord.Client();

// Load config.json
const config = require("./config.json");

// Kayn Lib
const { Kayn, REGIONS } = require('kayn');

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

    if (command === "nastats") {

    const kayn = Kayn(process.env.API_KEY)({region: REGIONS.NORTH_AMERICA});

    const summonerName = args.join(" ");
    console.log(summonerName);

    if(args.length < 1){
      message.channel.send("You must provide a valid Summoner name");
    }else{

    kayn.Summoner.by.name(summonerName).callback(function(err, summoner) {
      if (!summoner){
        message.channel.send(`${summonerName} does not exist`);
      }else{
        kayn.League.Entries.by.summonerID(summoner.id).callback(function(err, sRank) {
          console.log(sRank);
            let soloq = sRank.filter(sRank => sRank.queueType === "RANKED_SOLO_5x5");
            let flexq = sRank.filter(sRank => sRank.queueType === "RANKED_FLEX_SR");
            console.log(soloq.length, flexq.length);
            if (soloq.length < 1 && flexq.length > 0){

              let flexRank = flexq[0].tier;
              let flexDivision = flexq[0].rank;
              let flexPoints = flexq[0].leaguePoints;
              let flexWins = flexq[0].wins;
              let flexLosses = flexq[0].losses;
              var flexPWinRate = flexWins/flexLosses;
              var flexWinRate = flexPWinRate.toFixed(2);

              // Rank Processing
              if (flexRank == "IRON") flexRank = "Iron", imagePath = "https://i.imgur.com/o1Zueal.png";
              if (flexRank == "BRONZE") flexRank = "Bronze", imagePath = "https://i.imgur.com/rs4SZvt.png";
              if (flexRank == "SILVER") flexRank = "Silver", imagePath = "https://i.imgur.com/RiLIAaW.png";
              if (flexRank == "GOLD") flexRank = "Gold", imagePath = "https://i.imgur.com/TPb2MTW.png";
              if (flexRank == "PLATINUM") flexRank = "Platinum", imagePath = "https://i.imgur.com/radVwv6.png";
              if (flexRank == "DIAMOND") flexRank = "Diamond", imagePath = "https://i.imgur.com/4tuGatb.png";
              if (flexRank == "MASTER") flexRank = "Master", imagePath = "https://i.imgur.com/Kl0C1nw.png";
              if (flexRank == "GRANDMASTER") flexRank = "Grandmaster", imagePath = "https://i.imgur.com/dWwxQ2c.png";
              if (flexRank == "CHALLENGER") flexRank = "Challenger", imagePath = "https://i.imgur.com/C42dBE6.png";

              // Embed

              const embed = new Discord.MessageEmbed()
              .setTitle(`${summonerName}'s Stats`)
              .setThumbnail(imagePath)
              .setColor(0xeb7e46)
              .addField('Flex', `**${flexRank} ${flexDivision} | ${flexPoints} LP**\n**Win Rate:** ${flexWinRate}%`, true);

              return message.channel.send({ embed });

            } else if (soloq.length > 0 && flexq.length < 1){

              let rank = soloq[0].tier;
              let division = soloq[0].rank;
              let points = soloq[0].leaguePoints;
              let wins = soloq[0].wins;
              let losses = soloq[0].losses;
              var pWinRate = wins/losses;
              var winRate = pWinRate.toFixed(2);

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
              .addField('Solo/Duo', `**${rank} ${division} | ${points} LP**\n**Win Rate:** ${winRate}%`, true);

              return message.channel.send({ embed });

            } else if(soloq.length > 0 && flexq.length > 0){

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

            }else{

              message.channel.send(`Summoner ${summonerName} is currently unranked`);
            
            }
        })
      }
    })
    }
        
    }

    if (command === "euwstats") {

      const kayn = Kayn(process.env.API_KEY)({region: REGIONS.EUROPE_WEST});
  
      const summonerName = args.join(" ");
      console.log(summonerName);
  
      if(args.length < 1){
        message.channel.send("You must provide a valid Summoner name");
      }else{
  
      kayn.Summoner.by.name(summonerName).callback(function(err, summoner) {
        if (!summoner){
          message.channel.send(`${summonerName} does not exist`);
        }else{
          kayn.League.Entries.by.summonerID(summoner.id).callback(function(err, sRank) {
            console.log(sRank);
              let soloq = sRank.filter(sRank => sRank.queueType === "RANKED_SOLO_5x5");
              let flexq = sRank.filter(sRank => sRank.queueType === "RANKED_FLEX_SR");
              console.log(soloq.length, flexq.length);
              if (soloq.length < 1 && flexq.length > 0){
  
                let flexRank = flexq[0].tier;
                let flexDivision = flexq[0].rank;
                let flexPoints = flexq[0].leaguePoints;
                let flexWins = flexq[0].wins;
                let flexLosses = flexq[0].losses;
                var flexPWinRate = flexWins/flexLosses;
                var flexWinRate = flexPWinRate.toFixed(2);
  
                // Rank Processing
                if (flexRank == "IRON") flexRank = "Iron", imagePath = "https://i.imgur.com/o1Zueal.png";
                if (flexRank == "BRONZE") flexRank = "Bronze", imagePath = "https://i.imgur.com/rs4SZvt.png";
                if (flexRank == "SILVER") flexRank = "Silver", imagePath = "https://i.imgur.com/RiLIAaW.png";
                if (flexRank == "GOLD") flexRank = "Gold", imagePath = "https://i.imgur.com/TPb2MTW.png";
                if (flexRank == "PLATINUM") flexRank = "Platinum", imagePath = "https://i.imgur.com/radVwv6.png";
                if (flexRank == "DIAMOND") flexRank = "Diamond", imagePath = "https://i.imgur.com/4tuGatb.png";
                if (flexRank == "MASTER") flexRank = "Master", imagePath = "https://i.imgur.com/Kl0C1nw.png";
                if (flexRank == "GRANDMASTER") flexRank = "Grandmaster", imagePath = "https://i.imgur.com/dWwxQ2c.png";
                if (flexRank == "CHALLENGER") flexRank = "Challenger", imagePath = "https://i.imgur.com/C42dBE6.png";
  
                // Embed
  
                const embed = new Discord.MessageEmbed()
                .setTitle(`${summonerName}'s Stats`)
                .setThumbnail(imagePath)
                .setColor(0xeb7e46)
                .addField('Flex', `**${flexRank} ${flexDivision} | ${flexPoints} LP**\n**Win Rate:** ${flexWinRate}%`, true);
  
                return message.channel.send({ embed });
  
              } else if (soloq.length > 0 && flexq.length < 1){
  
                let rank = soloq[0].tier;
                let division = soloq[0].rank;
                let points = soloq[0].leaguePoints;
                let wins = soloq[0].wins;
                let losses = soloq[0].losses;
                var pWinRate = wins/losses;
                var winRate = pWinRate.toFixed(2);
  
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
                .addField('Solo/Duo', `**${rank} ${division} | ${points} LP**\n**Win Rate:** ${winRate}%`, true);
  
                return message.channel.send({ embed });
  
              } else if(soloq.length > 0 && flexq.length > 0){
  
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
  
              }else{
  
                message.channel.send(`Summoner ${summonerName} is currently unranked`);
              
              }
          })
        }
      })
      }
          
      }

      if(command === "help"){
    
        const embed = new Discord.MessageEmbed()
        .setTitle('Help Menu')
        .setDescription('User Command Usage:')
        .setThumbnail("https://i.imgur.com/ZpB6wXo.jpg")
        .setColor(0xeb7e46)
        .addField('\u200b', `**Usage:** \`${config.prefix}nastats [Summoner Name]\`\nThis command displays the stats for summoners in the NA region`)
        .addField('\u200b', `**Usage:** \`${config.prefix}euwstats [Summoner Name]\`\nThis command displays the stats for summoners in the EUW region`);
      
        return message.channel.send({embed});
    
      }

      if(command === "about"){

        // Get Memory Usage
        const memoryUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    
        //Get Client Uptime
        var totalSeconds = (client.uptime / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = Math.round(totalSeconds % 60);
        
        const embed = new Discord.MessageEmbed()
        .setTitle('Teemo Bot - Statistics')
        .setFooter(`©2020 ${config.author}`)
        .setThumbnail("https://i.imgur.com/FQXPR3D.png")
        .setColor(0xeb7e46)
        .addField('❯ Uptime', `${days}d ${hours}h ${minutes}m ${seconds}s`)
        .addField('❯ Memory Usage', `${memoryUsage}MB`)
        .addField('❯ General Stats', `• Guilds: ${client.guilds.cache.size}\n• Channels: ${client.channels.cache.size}`)
        .addField('❯ Version', `${config.version}`);
      
        return message.channel.send({embed});
    
      }

});

client.login(process.env.BOT_TOKEN);