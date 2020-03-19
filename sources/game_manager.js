class GameManager {

    static createGame(gameId, playerId, playerUsername) {
        const sql = require("./sql")
        const playerManager = require("./player_manager")
        
        return playerManager
        .createPlayer(playerId, playerUsername)
        .then(() => sql.insertInto("games", `(\`id\`) VALUES ('${gameId}')`))
        .then(() => playerManager.assignPlayerToGame(playerId, gameId))
        .then(() => {
            const Game = require("./game")
            const Player = require("./player")
            const APIGame = require("./api_game")

            const newPlayer = new Player(playerId, playerUsername)
            const newGame = new Game(gameId, [newPlayer])

            if (GameManager.activeGames == undefined) {
                GameManager.activeGames = {}
            }

            GameManager.activeGames[gameId] = newGame

            return new APIGame(newGame, newPlayer)
        })
        .catch((error) => {
            console.log(error)
        })
    }

}

module.exports = GameManager
