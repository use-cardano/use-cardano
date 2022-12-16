const localtunnel = require("localtunnel")
const open = require("open")

// Give the build some time to finish
setTimeout(() => {
  localtunnel({ port: 4200 }).then(async (tunnel) => {
    console.log()
    console.log("> serving examples on", "http://localhost:4200")
    console.log("> serving examples on", tunnel.url)
    console.log()

    // open one at a time to assure the localhost address is the last to be opened
    await open(tunnel.url)
    await open("http://localhost:4200")
  })
}, 5000)
