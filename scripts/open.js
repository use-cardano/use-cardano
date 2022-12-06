const localtunnel = require("localtunnel")
const open = require("open")

localtunnel({ port: 3000 }).then((tunnel) => {
  console.log("serving examples on", tunnel.url)

  open(tunnel.url)
})
