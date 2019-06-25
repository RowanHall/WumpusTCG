process.argv.shift()
process.argv.shift()
process.argv = process.argv.join(" ")
const fs = require('fs');
var tsv = fs.readFileSync("./Wumpus List - Sheet1.tsv", 'utf-8')
var tsvarr = tsv.split("\r\n")
var key = tsvarr.shift().split("\t")
var retobj = {}
tsvarr.forEach(val => {
  var data = (val.split("\t"))
  if(data[8]) {
    retobj[data[8]] = {}
    key.forEach((key, index) => {
      if(!retobj[data[8]]) {
        retobj[data[8]] = {}
      }
      retobj[data[8]][key.toLowerCase().split(" ").join("-")] = data[index]
    })
  }
})

fs.writeFileSync("wumpuses.json", JSON.stringify(retobj, null, 2))