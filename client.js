const io = require("socket.io-client")("http://localhost:8080")

io.on("connect", (socket) => {
    console.log("I connected")
})

let docs = []

io.on("inserted", (doc) => {
    console.log("inserted:")
    console.log(doc)
    docs.push(doc._id)
    console.log(docs)
})

io.on("deleted", (docid) => {
    const ind = docs.indexOf(docid)
    docs.splice(ind, 1)
    console.log(`deleted:`)
    console.log(docid)
    console.log(docs)
})
