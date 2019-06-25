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
    var to = msg.mentions.members.first()
    console.log(to, to.id)
    var userraw = commandarray.shift()
    var amount = parseInt(commandarray.shift())
    var item = commandarray.join(" ")
    if(to && userraw && amount && item) {
      trades[uuid] = {
        "initiator": msg.author.id,
        "to": to.id,
        "started": Date.now(),
        "userraw": userraw,
        "amount": amount,
        "item": item
      }
      msg.channel.send("Trade Started! The other user has 10 seconds to respond with `" + getPrefix(msg.guild.id) + "trade accept` or else the trade will be automatically rejected.")
      setTimeout(() => {
        var trades = JSON.parse(fs.readFileSync("./ongoingtrades.json", 'utf-8'))
        if(trades[uuid]) {
          delete trades[uuid]
          msg.channel.send("Trade Expired.")
        }
        fs.writeFileSync("./ongoingtrades.json", JSON.stringify(trades,null,4))
      }, 10000)
    } else {
      reject("Missing element. Proper syntax:\n  " + getPrefix(msg.guild.id) + "trade new [@user] [amount] [card name]")
    }
  }
  if(tradecommand == "accept") {
    var tradeUUID = null
    Object.keys(trades).forEach(uuid => {
      console.log(trades[uuid][to], msg.author.id)
      if(trades[uuid][to] == msg.author.id) {
        tradeUUID = uuid
      }
    })
    if(tradeUUID != null) {
      var c = trades[tradeUUID]
      delete trades[tradeUUID]
      
      /* preform trade stuff */
      
      console.log(c)
      
    } else {
      reject("You're not in a trade right now!")
    }
  }
  if(tradecommand == "reject") {
    
  }
  fs.writeFileSync("./ongoingtrades.json", JSON.stringify(trades,null,4))
}