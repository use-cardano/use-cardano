const localtunnel = require("localtunnel")
const open = require("open")

localtunnel({ port: 4200 }).then((tunnel) => {
  console.log("serving examples on", tunnel.url)

  open("http://localhost:4200")
  open(tunnel.url)
})
