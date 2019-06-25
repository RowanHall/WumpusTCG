const log = require('../log.js');
const fs = require('fs');
const capitalize = (s) => {
  if (typeof s !== 'string') s = String(s)
  return s.charAt(0).toUpperCase() + s.slice(1)
}
module.exports = (msg, commandarray, resolve, reject, assetHandler) => {
  var wumpuses = JSON.parse(fs.readFileSync("./wumpuses.json", 'utf-8'))
  
  // command input example 
  // 
  // --getwumpus name [WUMPUS NAME]
  // --getwumpus id   [WUMPUS ID]
  // --getwumpus [WUMPUS NAME]
  
  //check if 1st param is type of one found in object.
  
  var searchFactor = ""
  var r = commandarray.shift()
  if(Object.keys(wumpuses[Object.keys(wumpuses)[0]]).indexOf(r.toLowerCase()) == -1) {
    //we were just given a Name
    searchFactor = "name"
    commandarray.unshift(r)
  } else {
    //we were given a search factor
    searchFactor = r
  }
  
  var discoveredwumpus = false
  Object.keys(wumpuses).forEach(wumpusID => {
    var wumpus = wumpuses[wumpusID]
    if(wumpus[searchFactor.toLowerCase()].toLowerCase() == commandarray.join(" ").toLowerCase()) {
      discoveredwumpus = true
      console.log(wumpus)
      var fields = [];
      Object.keys(wumpus).forEach(key => {
        if([
          'flair-text',
          'name'
        ].indexOf(key) == -1 && key.split("-")[0] != "[dev]") {
          fields.push({
            "name": capitalize(key),
            "value": capitalize(wumpus[key]),
            "inline": true
          })
        }
      })
      var embed = {
        "title": "*" + wumpus['flair-text'] + "*",
        "description": "Wumpus info:",
        "color": 9168048,
        "timestamp": "2019-06-23T18:33:20.030Z",
        "footer": {
          "text": "Wumpus Discovered"
        },
        "image": {
          "url": assetHandler(wumpusID)
        },
        "author": {
          "name": wumpus['name']
        },
        "fields": fields
      };
      msg.channel.send({ embed });
    }
  })
  if(!discoveredwumpus) {
    const embed = {
      "description": "No Wumpus found by the " + searchFactor + " of \"" + commandarray.join(" ") + "\"\nEither, it doesn't exist, or you haven't found it yet! Keep hunting!",
      "color": 16711680
    };
    msg.channel.send({ embed });
  }
}