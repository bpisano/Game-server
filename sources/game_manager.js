class GameManager {

    static createGame(gameId, playerId, playerUsername) {
        const sql = require("./sql")
        const playerManager = require("./player_manager")
        
        return playerManager.createPlayer(playerId, playerUsername)
        .then(() => sql.insertInto("games", `(\`id\`) VALUES ('${id}')`))
        .then(() => playerManager.assignPlayerToGame(playerId, gameId))
        .cath
    }

}
