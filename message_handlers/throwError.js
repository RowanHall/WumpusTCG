const log = require('../log.js');
const fs = require('fs');
module.exports = (msg, commandarray, resolve, reject) => {
  log(msg, "ERROR: " + commandarray.join(" "))
  msg.channel.send(fs.readFileSync("./texts/error.md", 'utf-8').split("${err}").join(commandarray.join(" ")))
}