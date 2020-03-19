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

            socket.on("playerDidUpdatePosition", (playerId, xPosition, yPosition, rotation) => {
                this.performPlayerPositionUpdate(playerId, (xPosition, yPosition), rotation)
            })
        })
    }

    toJson() {
        return {
            "id": this.id,
            "players": Object.keys(this.players).map((playerId) => {
                return this.players[playerId].toJson()
            })
        }
    }

    performPlayerPositionUpdate(playerId, position, rotation) {
        console.log(playerId, position[0], position[1], rotation)
    }

}

module.exports = Game
