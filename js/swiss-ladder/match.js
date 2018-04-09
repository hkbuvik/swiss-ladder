var $swiss = window.$swiss || {};

$swiss.match = function () {

    function create(playerA, playerB) {

        var notEnded = true;
        var games = [];

        function name() {
            return playerA.name() + " - " + playerB.name();
        }

        function addGame(pointsPlayerA, pointsPlayerB) {
            if (notEnded) {
                games.push([pointsPlayerA, pointsPlayerB]);
            }
        }

        function end() {
            if (notEnded) {
                playerA.addMatch(playerB.name(), scorePlayerA());
                playerB.addMatch(playerA.name(), -scorePlayerA());
            }
            notEnded = false;
        }

        function scorePlayerA() {
            var score = 0;
            for (var i = 0; i < games.length; i++) {
                var game = games[i];
                score += game[0] - game[1];
            }
            return score;
        }

        function isAPlayer(player) {
            return player.name() === playerA.name() || player.name() === playerB.name();
        }

        return {
            name: name,
            addGame: addGame,
            isAPlayer: isAPlayer,
            end: end
        }
    }

    return {
        create: create
    }

}();
