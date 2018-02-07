var $swiss = window.$swiss || {};

$swiss.ladder = function () {

    function create(players) {

        var firstRound = true;

        log("New swiss ladder with " + players.length + " players created");

        function ranking() {
            log("Ranking players");
            if (firstRound) {
                randomizePlayers();
            } else {
                sortPlayersByScore();
            }
            var theRanking = $swiss.ranking.create(players);
            logRanking(theRanking);
            return theRanking;
        }

        function pairing() {
            groupLog("Pairing players");
            var matches = $swiss.pairing.create(players);
            firstRound = false;
            endGroupLog();
            logPairing(matches);
            return matches;
        }

        function randomizePlayers() {
            var j, x, i;
            for (i = players.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = players[i];
                players[i] = players[j];
                players[j] = x;
            }
        }

        function sortPlayersByScore() {
            players.sort(function (player1, player2) {
                return player1.score() < player2.score();
            });
        }

        function logRanking(ranking) {
            var orderOfPlayers = "Ranking: ";
            for (var i = 0; i < ranking.length; i++) {
                var maybeComma = i === (ranking.length - 1) ? "" : ", ";
                orderOfPlayers +=
                    ranking[i].rank + ". " +
                    ranking[i].playerName +
                    " (" + ranking[i].score + ")" +
                    (maybeComma);
            }
            log(orderOfPlayers);
        }

        function logPairing(matches) {
            var pairing = "Pairing: ";
            for (var i = 0; i < matches.length; i++) {
                var match = matches[i];
                var maybeComma = i === (matches.length - 1) ? "" : ", ";
                pairing +=
                    (i + 1) + ". " +
                    "'" + match.name() + "'" +
                    maybeComma;
            }
            log(pairing);
        }

        function log(message) {
            console.info("ladder # " + message);
        }

        function groupLog(message) {
            console.groupCollapsed("ladder # " + message);
        }

        function endGroupLog() {
            console.groupEnd();
        }

        return {
            ranking: ranking,
            pairing: pairing
        }
    }

    return {
        create: create
    }

}();
