const log = require('../log.js');
const fs = require('fs');
module.exports = (msg, commandarray, resolve, reject) => {
  var libraries = JSON.parse(fs.readFileSync("./libraries.json", 'utf-8'))
  var wumpuses  = JSON.parse(fs.readFileSync("./wumpuses.json", 'utf-8'))
  if(!libraries[msg.author.id]) {
    libraries[msg.author.id] = {
      "cards": {}
    };
  }
  if(libraries[msg.author.id].cards[commandarray.join(" ")]) {
    libraries[msg.author.id].cards[commandarray.join(" ")].count++;
  } else {
    libraries[msg.author.id].cards[commandarray.join(" ")] = {}
    libraries[msg.author.id].cards[commandarray.join(" ")].wumpus = wumpuses[commandarray.join(" ")];
    libraries[msg.author.id].cards[commandarray.join(" ")].count  = 1
  }
  fs.writeFileSync("./libraries.json", JSON.stringify(libraries, null, 2))
}