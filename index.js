const env = require('dotenv')
env.config()

const express = require("express")
const app = express()

app.post("/create_game", (req, res) => {
    try {
        const gameId = req.query.gameId
        const playerId = req.query.playerId
        const playerUsername = requ.query.playerUsername
    } catch {
        console.log("Bad arguments")
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}.`)

    const sqlSetup = require("./sources/sql_setup")
	sqlSetup.setup()
})















const WebSocket = require("ws")
const socketServer = new WebSocket.Server({ port: 3030 })

socketServer.on("connection", (socket) => {
    console.log("Client connected")

    socket.on("message", (message) => {
        console.log(`Received: ${message}`)
    })

    socket.send("Hello you !")
})
