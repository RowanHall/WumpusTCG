const log = require('../log.js');
const fs = require('fs');
module.exports = (msg, commandarray, resolve, reject) => {
  if(msg.member.hasPermission("ADMINISTRATOR")) {
    var prefixes = JSON.parse(fs.readFileSync("./prefixes.JSON", 'utf-8'))
    prefixes[msg.guild.id] = commandarray.join(" ")
    msg.channel.send(`Changed the prefix to: \`${commandarray.join(" ")}\``)
  } else {
    reject("You do not have the \"ADMINISTRATOR\" permission")
  }
}