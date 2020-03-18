class SQLSetup {
    
    static setup() {
        const sql = require("./sql")
        return sql.configureSQL()
        .then(database => sql.createDataBase(database))
        .then(database => sql.configureDataBase(database))
        .then(() => sql.createTable("games (`id` VARCHAR(255) PRIMARY KEY NOT NULL, `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)"))
        .then(() => sql.createTable("players (`id` VARCHAR(255) PRIMARY KEY NOT NULL, `username` VARCHAR(255) NOT NULL, gameId VARCHAR(255), `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)"))
        .catch(error => {
            console.log(error)
        })
    }
    
}

module.exports = SQLSetup
