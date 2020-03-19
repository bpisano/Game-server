class PlayerManager {

    static getPlayerWithId(id) {
        const sql = require("./sql")
        return sql.performQuery(`SELECT * FROM 'players' WHERE 'players'.'id' = ${id}`)
    }

    static createPlayer(id, username) {
        const sql = require("./sql")
        return sql.insertInto("players", `(\`id\`, \`username\`) VALUES ('${id}', '${username}')`)
    }

    static assignPlayerToGame(playerId, gameId) {
        const sql = require("./sql")
        return sql.update("players", playerId, `\`gameId\` = '${gameId}'`)
    }

}

module.exports = PlayerManager
