var $swiss = window.$swiss || {};

$swiss.match = function () {

    function create(playerA, playerB) {

        var game = null;

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

        function isAPlayer(player) {
            return player.name() === playerA.name() || player.name() === playerB.name();
        }

        return {
            name: name,
            result: result,
            isAPlayer: isAPlayer
        }
    }

    return {
        create: create
    }

}();
