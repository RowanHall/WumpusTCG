const Discord = require('discord.js');
const assetHandler = require('./assets/assetHandler.js');
const fs = require('fs');
const log = require('./log.js');
const secrets = JSON.parse(fs.readFileSync("./secrets.JSON"))
const client = new Discord.Client();
const capitalize = (s) => {
  if (typeof s !== 'string') s = String(s)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

client.on('ready', () => {
  console.log(`Connected to Discord as ${client.user.tag}!`);
});

var randomize = (float) => {
  //console.log("ASKED TO POLL A RANDOM NUMBER. CHANCE OF RETURN true: " + float)
  return ((Math.floor(Math.random() * 100)) < (Math.floor(float * 100)));
}

client.on('message', msg => {
  if(msg.guild) {
    if(msg.author.id != client.user.id && randomize(0.02)) {
      var wumpuses = JSON.parse(fs.readFileSync("./wumpuses.json", 'utf-8'))
      var donatedWumpus = false;
      Object.keys(wumpuses).forEach((UUID) => {
        if(randomize(parseFloat(wumpuses[UUID]['[dev]-rarity-percent'])) && !donatedWumpus) {
          donatedWumpus = true;
          var libraries = JSON.parse(fs.readFileSync("./libraries.json", 'utf-8'))
          if(!libraries[msg.author.id]) {
            libraries[msg.author.id] = {
              "cards": {}
            };
          }
          if(libraries[msg.author.id].cards[UUID]) {
            libraries[msg.author.id].cards[UUID].count++;
          } else {
            libraries[msg.author.id].cards[UUID] = {}
            libraries[msg.author.id].cards[UUID].wumpus = wumpuses[UUID];
            libraries[msg.author.id].cards[UUID].count  = 1
          }
          fs.writeFileSync("./libraries.json", JSON.stringify(libraries, null, 2))
          var fields = [];
          Object.keys(wumpuses[UUID]).forEach(key => {
            if([
              'flair-text',
              'name'
            ].indexOf(key) == -1 && key.split("-")[0] != "[dev]") {
              fields.push({
                "name": capitalize(key),
                "value": capitalize(wumpuses[UUID][key]),
                "inline": true
              })
            }
          })
          var embed = {
            "title": "*" + wumpuses[UUID]['flair-text'] + "*",
            "description": "Wumpus info:",
            "color": 9168048,
            "timestamp": "2019-06-23T18:33:20.030Z",
            "footer": {
              "text": "Wumpus Discovered"
            },
            "thumbnail": {
              "url": assetHandler(UUID)
            },
            "author": {
              "name": "Congrats! You found a wumpus! : " + wumpuses[UUID]['name']
            },
            "fields": fields
          };
          msg.channel.send({ embed });
        }
      })
    }
    
    
    try {
      var splitElement = getPrefix(msg.guild.id)
    } catch(err) {
      var splitElement = "--"
    }
    var x = msg.content.split(splitElement)
    if(x.length > 1 && x[0] == "") { //check that the prefix is in the message, and is the first part of the message
    x.shift()
    execute(msg, x.join(splitElement).toLowerCase().split(" ")).then(() => {
      //finished executing command
    }).catch(err => {
      log(msg, "ERROR: " + err)
      msg.channel.send(fs.readFileSync("./texts/error.md", 'utf-8').split("${err}").join(err))
    })
  }
  } else {
    msg.channel.send("This bot doesn't work in DMs. Sorry!")
  }
});

client.login(secrets.BOT_TOKEN);

var getPrefix = (guildID) => {
  var prefixes = JSON.parse(fs.readFileSync("./prefixes.JSON", 'utf-8'))
  if(prefixes[guildID]) {
    return prefixes[guildID]
  } else {
    return "--"
  }
}

var execute = (msg, commandarray) => {
  return new Promise(function(resolve, reject) {
    var message_handlers = JSON.parse(fs.readFileSync('./message_handlers/messageHandlerIndex.JSON', 'utf-8'))
    var cmd = commandarray.shift()
    if(message_handlers[cmd]) {
      log(msg, "executing: " + cmd)
      require("./message_handlers/" + message_handlers[cmd])(msg, commandarray, resolve, reject, assetHandler)
    } else {
      reject("No command found; \"" + cmd + "\"")
    }
  });
}