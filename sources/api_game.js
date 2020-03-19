class APIGame {

    constructor(game, currentPlayer) {
        this.game = game
        this.currentPlayer = currentPlayer
    }

    toJson() {
        return {
            "game": this.game.toJson(),
            "currentPlayer": this.currentPlayer.toJson()
        }
    }

}

module.exports = APIGame
