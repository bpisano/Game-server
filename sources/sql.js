class SQL {

    static database = null
    
    static configureSQL() {
        return new Promise((resolve, reject) => {
            const mysql = require("mysql")
            const db = mysql.createConnection({
                host: "localhost",
                port: process.env.MYSQL_PORT,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
            })
            
            db.connect(error => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    resolve(db)
                }
            })
        })
    }

    static createDataBase(db) {
        return new Promise((resolve, reject) => {
            db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE_NAME}`, (error, result) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    console.log("Database created.")
                    resolve(result)
                }
            })
        })
    }

    static configureDataBase() {
        return new Promise((resolve, reject) => {
            const mysql = require("mysql")
            const db = mysql.createConnection({
                host: process.env.MYSQL_HOST,
                port: process.env.MYSQL_PORT,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE_NAME
            })
            
            db.connect(error => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    console.log("Database connected.")
                    SQL.database = db
                    resolve(db)
                }
            })
        })
    }

    static performQuery(query) {
        return new Promise((resolve, reject) => {
            SQL.database.query(query, (error, result) => {
                if (error) {
                    console.log(error)
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
        .catch(error => console.log(error))
    }
    
    static createTable(tableQuery) {
        return this.performQuery("CREATE TABLE IF NOT EXISTS " + tableQuery)
    }
    
    static insertInto(tableName, insertionQuery) {
        return this.performQuery(`INSERT INTO ${tableName} ${insertionQuery}`)
    }
    
    static update(tableName, itemId, updateQuery) {
        return this.performQuery(`UPDATE ${tableName} SET ${updateQuery} WHERE \`${tableName}\`.\`id\` = '${itemId}'`)
    }
    
}

module.exports = SQL
