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

            socket.on("disconnected", () => {
                this.__handlePlayerDidDisconnect(socket)
            })

            socket.on(this.socketManager.spaceshipDidConnectEvent, (data) => {
                this.__handleSpaceshitDidConnect(data[0], socket)
            })

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

    __handlePlayerDidDisconnect(socket) {
        console.log("Client disconnected")
        const playerIds = Object.keys(this.players)
        playerIds.forEach((playerId) => {
            const player = this.players[playerId]
            if (player.socket == socket) {
                console.log(playerId)
                delete this.players[playerId]
                this.socketRoom.emit(this.socketManager.spaceshipDidDisconnectEvent, playerId)
            }
        })
    }

    __handleSpaceshitDidConnect(playerId, socket) {
        this.players[playerId].socket = socket
    }

    __handlePlayerPositionUpdate(playerId, xPosition, yPosition, rotation) {
        this.socketRoom.emit(this.socketManager.spaceshipDidUpdatePositionEvent, playerId, xPosition, yPosition, rotation)
    }

    __handleSpaceshipDidFire(playerId) {
        console.log(playerId, "did fire")
        this.socketRoom.emit(this.socketManager.spaceshipDidFireEvent, playerId)
    }

    __handlePlayerHit(playerId, damage) {
        const spaceship = this.spaceships[playerId]
        spaceship.health -= damage

        if (spaceship.health <= 0) {
            console.log(playerId, "has been killed")
            this.socketRoom.emit(this.socketManager.spaceshipHasBeenKilledEvent, playerId)

            var i = 3
            const timer = setInterval(() => {
                if (i == 0) {
                    spaceship.health = 100
                    spaceship.position = [0, 0]
                    this.socketRoom.emit(this.socketManager.spaceshipDidRespawnEvent, playerId, spaceship.position[0], spaceship.position[1], spaceship.health)
                    clearInterval(timer)
                } else {
                    this.socketRoom.emit(this.socketManager.spaceshipTimerBeforeRespawnEvent, playerId, i)
                    i -= 1
                }
            }, 1000);
        } else {
            console.log(`${playerId} has been hit`)
            this.socketRoom.emit(this.socketManager.spaceshipHasBeenHitEvent, playerId, damage)
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
