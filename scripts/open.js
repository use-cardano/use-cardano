const localtunnel = require("localtunnel")
const open = require("open")

// Give the build some time to finish
setTimeout(() => {
  localtunnel({ port: 4200 }).then((tunnel) => {
    console.log("serving examples on", tunnel.url)

    open("http://localhost:4200")
    open(tunnel.url)
  })
}, 5000)
