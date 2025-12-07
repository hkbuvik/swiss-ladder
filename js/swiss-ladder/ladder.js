// noinspection ES6ConvertVarToLetConst
var $swiss = window.$swiss || {};

$swiss.ladder = function () {

    function create(players) {

        let firstRound = true;

        log("New swiss ladder with " + players.length + " players created");

        function ranking() {
            log("Ranking players");
            if (firstRound) {
                randomizePlayers();
            } else {
                sortPlayersByScore();
            }
            let theRanking = $swiss.ranking.create(players);
            logRanking(theRanking);
            return theRanking;
        }

        function pairing(onWalkOverFound) {
            groupLog("Pairing players");
            let matches = $swiss.pairing.create(players, onWalkOverFound);
            firstRound = false;
            logPairing(matches);
            endGroupLog();
            return matches;
        }

        function randomizePlayers() {
            let j, x, i;
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
            let orderOfPlayers = "Ranking: ";
            for (let i = 0; i < ranking.length; i++) {
                const maybeComma = i === (ranking.length - 1) ? "" : ", ";
                orderOfPlayers +=
                    ranking[i].rank + ". " +
                    ranking[i].playerName +
                    " (" + ranking[i].score + ")" +
                    (maybeComma);
            }
            log(orderOfPlayers);
        }

        function logPairing(matches) {
            let pairing = "Pairing: ";
            for (let i = 0; i < matches.length; i++) {
                const match = matches[i];
                const maybeComma = i === (matches.length - 1) ? "" : ", ";
                pairing +=
                    (i + 1) + ". " +
                    "'" + match.name() + "'" +
                    maybeComma;
            }
            log(pairing);
        }

        function roundsToPlay() {
            return Math.ceil(Math.log(players.length) * Math.LOG2E);
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
            pairing: pairing,
            roundsToPlay: roundsToPlay
        }
    }

    return {
        create: create
    }

}();
