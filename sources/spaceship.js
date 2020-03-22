class Spaceship {

    constructor(player) {
        this.player = player
        this.health = 100
        this.position = [0, 0]
        this.rotation = 0
    }

    toJson() {
        return {
            "player": this.player.toJson(),
            "health": this.health,
            "position": this.position,
            "rotation": this.rotation
        }
    }

}

module.exports = Spaceship
