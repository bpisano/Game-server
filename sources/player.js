class Player {

    constructor(id, username) {
        this.id = id
        this.username = username
    }

    toJson() {
        return {
            "id": this.id,
            "username": this.username,
        }
    }

}

module.exports = Player
