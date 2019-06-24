const chalk = require('chalk');
module.exports = (msg, text) => {
  if(msg.guild) {
    console.log(`${chalk.green(`[${msg.guild.name} #{${msg.channel.name}}]`) + chalk.red(` @ ${msg.author.tag}`) + ` : ` + chalk.blue(`${text}`)}`)
  } else {
    console.log(`${chalk.green(`[DM]`) + chalk.red(` @ ${msg.author.tag}`) + ` : ` + chalk.blue(`${text}`)}`)
  }
}