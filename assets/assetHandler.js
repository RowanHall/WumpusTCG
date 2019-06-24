const express = require('express')
const uuidv4 = require('uuid/v4');
const fs = require('fs');
var wumpuses = JSON.parse(fs.readFileSync("./wumpuses.json", 'utf-8'))
const app = express()
const port = 8102

app.get('/', (req, res) => res.send('Hello World!'))

var mapobj = {}

fs.readdirSync('./assets/').forEach(i => {
  if(i != "assetHandler.js" && i != "curiousOne.html" && i != "Error.png") {
    var uuid = uuidv4();
    var wumpusUUID = ""
    Object.keys(wumpuses).forEach(wumpuuid => {
      var wumpus = wumpuses[wumpuuid]
      if(wumpus['[dev]-cdn-url'] == i) {
        wumpusUUID = wumpuuid
      }
    })
    mapobj[wumpusUUID] = uuid
    app.get('/' + uuid, (req, res) => {
      res.set("Content-Type", "image/png")
      res.send(fs.readFileSync("./assets/" + i))
    })
    console.log("Initiated", i, "as", uuid)
  }
})

app.get('/' + "wumpus404", (req, res) => {
  res.set("Content-Type", "image/png")
  res.send(fs.readFileSync("./assets/Error.png"))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = (uuid) => {
  if(mapobj[uuid]) {
    return "http://98.7.203.224:" + port + "/" + mapobj[uuid]
  } else {
    return "http://98.7.203.224:" + port + "/wumpus404"
  }
}