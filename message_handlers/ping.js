const log = require('../log.js');
const fs = require('fs');
module.exports = (msg, commandarray, resolve, reject) => {
  msg.channel.send(fs.readFileSync("./texts/pingResponse.md", 'utf-8').split("${pingms}").join(String(Date.now() - msg.createdTimestamp)))
}