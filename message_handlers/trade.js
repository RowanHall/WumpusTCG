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
      if(trades[uuid]['to'] == msg.author.id) {
        tradeUUID = uuid
      }
    })
    if(tradeUUID != null) {
      var c = trades[tradeUUID]
      delete trades[tradeUUID]
      
      /* preform trade stuff */
      
      var wumpuses = JSON.parse(fs.readFileSync("./wumpuses.json", 'utf-8'))
      var discoveredwumpus = null;
      // check if wumpus *exists*
      Object.keys(wumpuses).forEach(WUMPUUID => {
        var wumpus = wumpuses[WUMPUUID]
        if(wumpus.name.toLowerCase() == c.item) {
          discoveredwumpus = WUMPUUID
        }
      })
      if(discoveredwumpus == null) {
        reject("No wumpus found by the name of: " + c.item)
      }
      
      //check if they have the card, and the amount they have.
      var libraries = JSON.parse(fs.readFileSync("./libraries.json", 'utf-8'))
      if(!libraries[c.initiator]) {
        libraries[c.initiator] = {
          "cards": {}
        };
      }
      var hasCard = false;
      var hasAmountOfCard = false;
      Object.keys(libraries[c.initiator].cards).forEach(cardKey => {
        var wumpus = libraries[c.initiator].cards[cardKey].wumpus
        var count  = libraries[c.initiator].cards[cardKey].count
        console.log(wumpus['name'].toLowerCase(), c.item, wumpus['name'].toLowerCase() == c.item)
        if(wumpus['name'].toLowerCase() == c.item) {
          hasCard = true;
          if(count >= c.amount) {
            hasAmountOfCard = true;
            
            // go through with trade.
            
            if(!libraries[c.to]) {
              libraries[c.to] = {
                "cards": {}
              };
            }
            if(libraries[c.to].cards[wumpus['[dev]-uuid']]) {
              libraries[c.to].cards[wumpus['[dev]-uuid']].count = libraries[c.to].cards[wumpus['[dev]-uuid']].count + c.amount;
            } else {
              libraries[c.to].cards[wumpus['[dev]-uuid']] = {}
              libraries[c.to].cards[wumpus['[dev]-uuid']].wumpus = wumpus;
              libraries[c.to].cards[wumpus['[dev]-uuid']].count  = c.amount
            }
            libraries[c.initiator].cards[cardKey].count = libraries[c.initiator].cards[cardKey].count - c.amount
          }
        }
      })
      if(!hasCard) {
        reject("you don't have the card '" + c.item + "'")
      } else {
        if(!hasAmountOfCard) {
          reject("you don't have enough of the card '" + c.item + "'")
        } else {
          msg.channel.send("Trade Finished.")
        }
      }
      fs.writeFileSync("./libraries.json", JSON.stringify(libraries, null, 2))
    } else {
      reject("You're not in a trade right now!")
    }
  }
  if(tradecommand == "reject") {
    
  }
  fs.writeFileSync("./ongoingtrades.json", JSON.stringify(trades,null,4))
}