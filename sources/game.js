class Game {

    constructor(id, players) {
        this.id = id
        this.players = {}
        this.spaceships = {}
        this.socketRoom = require("./socket_manager").room(`/${id}`)
        this.socketManager = require("./socket_manager")

        players.forEach((player) => {
            this.players[player.id] = player
        })

        this.__configureSockets()
    }

    __configureSockets() {
        this.socketRoom.on("connection", (socket) => {
            console.log(`Client connected to game ${this.id}`)

            socket.on(this.socketManager.spaceshipDidUpdatePositionEvent, (data) => {
                this.__handlePlayerPositionUpdate(data[0], data[1], data[2], data[3])
            })

            socket.on(this.socketManager.spaceshipDidFireEvent, (data) => {
                this.__handleSpaceshipDidFire(data[0])
            })

            socket.on(this.socketManager.spaceshipHasBeenHitEvent, (data) => {
                this.__handlePlayerHit(data[0], data[1])
            })
        })
    }

    __handlePlayerPositionUpdate(playerId, xPosition, yPosition, rotation) {
        this.socketRoom.emit(this.socketManager.spaceshipDidUpdatePositionEvent, playerId, xPosition, yPosition, rotation)
    }

    __handleSpaceshipDidFire(playerId) {
        console.log(playerId, "Fire")
        this.socketRoom.emit(this.socketManager.spaceshipDidFireEvent, playerId)
    }

    __handlePlayerHit(playerId, damage) {
        const spaceship = this.spaceships[playerId]
        spaceship.health -= damage

        if (spaceship.health <= 0) {
            this.socketRoom.emit("playerHasBeenKilled")

            var i = 3
            const timer = setInterval(() => {
                if (i == 0) {
                    this.socketRoom.emit("playerDidRespawn", playerId)
                    clearInterval(timer)
                } else {
                    this.socketRoom.emit("timerBeforeRespawn", playerId, i)
                    i -= 1
                }
            }, 1000);
        } else {
            this.socketRoom.emit("playerHasBeenHit", playerId, damage)
        }
    }

    addPlayer(newPlayer) {
        const Spaceship = require("./spaceship")
        const newSpaceship = new Spaceship(newPlayer)
        const newPlayerString = JSON.stringify(newPlayer.toJson())
        const newSpaceshipString = JSON.stringify(newSpaceship.toJson())

        this.players[newPlayer.id] = newPlayer
        this.spaceships[newPlayer.id] = new Spaceship(newPlayer)
        this.socketRoom.emit(this.socketManager.spaceshipDidConnectEvent, newPlayerString, newSpaceshipString)
    }

    toJson() {
        return {
            "id": this.id,
            "players": Object.keys(this.players).map((playerId) => {
                return this.players[playerId].toJson()
            }),
            "spaceships": Object.keys(this.spaceships).map((playerId) => {
                return this.spaceships[playerId].toJson()
            })
        }
    }

}

module.exports = Game
