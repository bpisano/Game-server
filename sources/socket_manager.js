class SocketManager {

    static configureSocketServer(server) {
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
