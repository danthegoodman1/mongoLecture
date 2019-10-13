const mongoose = require("mongoose")
const http = require("http")
const socketio = require("socket.io")
const server = http.createServer()
const io = socketio(server)

mongoose.connect("mongodb+srv://dan:dan@cluster0-uxq2y.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        validate: (input) => {
            return (input.length > 0)
        },
        unique: true
    },
    first: {
        type: String
    },
    last: {
        type: String
    }
})

io.on("connection", (socket) => {
    console.log("Someone connected to me")
})

const User = mongoose.model("User", userSchema, "Users")

db.once("open", () => {
    console.log("Connected to database")
    // const dan = new User({
    //     username: "dan",
    //     first: "Dan",
    //     last: "Goodman"
    // })
    // dan.save()

    const collection = db.collection("Users")

    const stream = collection.watch()
    stream.on("change", (event) => {

        console.log(event)

        switch (event.operationType) {

        case "replace":
            console.log(`Replaced: ${event.fullDocument}`)
            break

        case "insert":
            // console.log(`Inserted: ${event.fullDocument}`)
            io.emit("inserted", event.fullDocument)
            break

        case "delete":
            // console.log(`Deleted: ${event.documentKey._id}`)
            io.emit("deleted", event.documentKey._id)
            break

        default:
            console.log("what")
            break

        }
    })
})

server.listen(8080, () => {
    console.log("listneing")
})
