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
            newGame.addPlayer(newPlayer)

            GameManager.createActiveGamesIfNeeded()
            GameManager.activeGames[gameId] = newGame

            return new APIGame(newGame, newPlayer)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    static joinGame(gameId, playerId, playerUsername) {
        const sql = require("./sql")
        const playerManager = require("./player_manager")
        
        return playerManager
        .createPlayer(playerId, playerUsername)
        .then(() => playerManager.assignPlayerToGame(playerId, gameId))
        .then(() => GameManager.getGameWithId(gameId))
        .then((fetchedGames) => {
            const Game = require("./game")
            const Player = require("./player")
            const APIGame = require("./api_game")

            GameManager.createActiveGamesIfNeeded()

            const newPlayer = new Player(playerId, playerUsername)
            
            if (GameManager.activeGames[fetchedGames[0]["id"]] == undefined) {
                const newGame = new Game(gameId, [newPlayer])
                GameManager.activeGames[gameId] = newGame
            }

            const joiningGame = GameManager.activeGames[fetchedGames[0]["id"]]
            joiningGame.addPlayer(newPlayer)

            return new APIGame(joiningGame, newPlayer)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    static getGameWithId(id) {
        const sql = require("./sql")
        return sql.performQuery(`SELECT * FROM games WHERE id = '${id}'`)
    }

    static createActiveGamesIfNeeded() {
        if (GameManager.activeGames == undefined) {
            GameManager.activeGames = {}
        }
    }

}

module.exports = GameManager
