const uuidv4 = require('uuid/v4');
const fs = require('fs');

var getPrefix = (guildID) => {
  var prefixes = JSON.parse(fs.readFileSync("./prefixes.JSON", 'utf-8'))
  if(prefixes[guildID]) {
    return prefixes[guildID]
  } else {
    return "--"
  }
}

module.exports = (msg, commandarray, resolve, reject) => {
  var tradecommand = commandarray.shift();
  var trades = JSON.parse(fs.readFileSync("./ongoingtrades.json", 'utf-8'))
  if(tradecommand == "new") {
    var uuid = uuidv4()
    var to = message.mentions.members.first()
    if(to) {
      trades[uuid] = {
        "initiator": msg.author.id,
        "to": to,
        "started": Date.now()
      }
      msg.channel.send("Trade Started! The other user has 10 seconds to respond with `" + getPrefix(msg.guild.id) + "trade accept` or else the trade will be automatically rejected.")
      setTimeout(() => {
        
      })
    } else {
      reject("You must mention a user to trade with them!")
    }
  }
  if(tradecommand == "accept") {
    
  }
  if(tradecommand == "reject") {
    
  }
}