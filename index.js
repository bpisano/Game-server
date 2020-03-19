require('dotenv').config()

const express = require("express")
const app = express()

app.post("/create_game", (req, res) => {
    const gameManager = require("./sources/game_manager")
    const gameId = req.query.gameId
    const playerId = req.query.playerId
    const playerUsername = req.query.playerUsername

    gameManager
    .createGame(gameId, playerId, playerUsername)
    .then((apiGame) => {
        res.send(apiGame.toJson())
    })
    .catch((error) => {
        console.log(error)
        res.sendStatus(500)
    })
})

const server = app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_PORT}.`)

    const sqlSetup = require("./sources/sql_setup")
	sqlSetup.setup()
})

const socketManager = require("./sources/socket_manager")
socketManager.configureSocketServer(server)













// const WebSocket = require("ws")
// const socketServer = new WebSocket.Server({ port: 3030 })

// socketServer.on("connection", (socket) => {
//     console.log("Client connected")

//     socket.on("message", (message) => {
//         console.log(`Received: ${message}`)
//     })

//     socket.send("Hello you !")
// })
