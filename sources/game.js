class Game {

    constructor(id, players) {
        this.id = id
        this.players = {}
        this.socketRoom = require("./socket_manager").room(`/${id}`)

        players.forEach((player) => {
            this.players[player.id] = player
        })

        this.__configureSockets()
    }

    __configureSockets() {
        this.socketRoom.on("connection", (socket) => {
            console.log(`Client connected to game ${this.id}`)

            this.socket = socket

            this.socket.on("playerDidUpdatePosition", (playerId, xPosition, yPosition, rotation) => {
                this.__performPlayerPositionUpdate(playerId, xPosition, yPosition, rotation)
            })

            this.socket.on("playerDidFire", (playerId) => {
                this.socketRoom.emit("playerDidFire", playerId)
            })
        })
    }

    __performPlayerPositionUpdate(playerId, xPosition, yPosition, rotation) {
        this.socketRoom.emit("playerDidUpdatePosition", playerId, xPosition, yPosition, rotation)
        console.log(playerId, xPosition, yPosition, rotation)
    }

    addPlayer(newPlayer) {
        this.players[newPlayer.id] = newPlayer
        this.socketRoom.emit("playerDidJoinGame", newPlayer.id, newPlayer.username)
    }

    toJson() {
        return {
            "id": this.id,
            "players": Object.keys(this.players).map((playerId) => {
                return this.players[playerId].toJson()
            })
        }
    }

}

module.exports = Game
