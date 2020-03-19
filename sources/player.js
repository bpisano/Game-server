class Player {

    constructor(id, username, game) {
        this.id = id
        this.username = username
        this.position = {"x": 0, "y": 0}
        this.orientation = 0
    }

    toJson() {
        return {
            "id": this.id,
            "username": this.username,
        }
    }

}

module.exports = Player
