const localtunnel = require("localtunnel")
const open = require("open")

// Give the build some time to finish
setTimeout(() => {
  localtunnel({ port: 4200 }).then((tunnel) => {
    console.log()
    console.log("> serving examples on", "http://localhost:4200")
    console.log("> serving examples on", tunnel.url)
    console.log()

    open(tunnel.url)
    open("http://localhost:4200")
  })
}, 5000)
