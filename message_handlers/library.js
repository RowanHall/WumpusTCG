const log = require('../log.js');
const fs = require('fs');
module.exports = (msg, commandarray, resolve, reject) => {
  var returnString = "Your library includes the card(s):\n\n```\n"
  var libraries = JSON.parse(fs.readFileSync("./libraries.json", 'utf-8'))
  if(!libraries[msg.author.id]) {
    libraries[msg.author.id] = {
      "cards": {}
    };
    fs.writeFileSync("./libraries.json", JSON.stringify(libraries, null, 2))
  }
  Object.keys(libraries[msg.author.id].cards).forEach(uuid => {
    var card = libraries[msg.author.id].cards[uuid]
    var string = ""
    string = string + card.wumpus.name.padEnd(24, " ")
    string = string + " : "
    string = string + card.count
    string = string + "\n"
    returnString = returnString + string
  })
  msg.channel.send(returnString + '```')
}