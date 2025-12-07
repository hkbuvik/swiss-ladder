// noinspection ES6ConvertVarToLetConst
var $swiss = window.$swiss || {};

$swiss.match = function () {

    function create(playerA, playerB) {

        let game = null;

        function name() {
            return playerA.name() + " - " + playerB.name();
        }

        function result(pointsPlayerA, pointsPlayerB) {
            if (game == null) {
                game = [pointsPlayerA, pointsPlayerB];
                playerA.addMatch(playerB.name(), scorePlayerA());
                playerB.addMatch(playerA.name(), -scorePlayerA());
            }
            return {
                name: name(),
                points: game[0] + " - " + game[1]
            };
        }

        function scorePlayerA() {
            return game[0] - game[1];
        }

        function hasPlayer(player) {
            return player.name() === playerA.name() || player.name() === playerB.name();
        }

        return {
            name: name,
            result: result,
            hasPlayer: hasPlayer
        }
    }

    return {
        create: create
    }

}();
