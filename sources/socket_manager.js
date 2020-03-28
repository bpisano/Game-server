class SocketManager {

    static configureSocketServer(server) {
        SocketManager.spaceshipDidConnectEvent = "spaceshipDidConnect"
        SocketManager.spaceshipDidDisconnectEvent = "spaceshipDidDisconnect"
        SocketManager.spaceshipDidUpdatePositionEvent = "spaceshipDidUpdatePosition"
        SocketManager.spaceshipDidFireEvent = "spaceshipDidFire"
        SocketManager.spaceshipHasBeenHitEvent = "spaceshipHasBeenHit"
        SocketManager.spaceshipHasBeenKilledEvent = "spaceshipHasBeenKilled"
        SocketManager.spaceshipTimerBeforeRespawnEvent = "spaceshipTimerBeforeRespawn"
        SocketManager.spaceshipDidRespawnEvent = "spaceshipDidRespawn"

        SocketManager.io = require("socket.io")(server)
        SocketManager.io.on("connection", (socket) => {
            console.log("Client connected")
        })
    }

    static room(roomName) {
        return SocketManager.io.of(roomName)
    }

}

module.exports = SocketManager
