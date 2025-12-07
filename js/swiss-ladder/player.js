// noinspection ES6ConvertVarToLetConst
var $swiss = window.$swiss || {};

$swiss.player = function () {

    function create(playerName) {

        let totalScore = 0;
        let opponentNames = [];
        let hasAtLeastOneWalkOver = false;

        function name() {
            return playerName;
        }

        function score() {
            return totalScore;
        }

        function walkOver() {
            log(name() + " must walk over");
            hasAtLeastOneWalkOver = true;
            const compensation = parseInt(Math.abs(totalScore) / 2);
            totalScore += compensation;
            return {
                playerName: playerName,
                compensation: compensation
            }
        }

        function hasWalkOver() {
            return hasAtLeastOneWalkOver;
        }

        function addMatch(opponentName, score) {
            totalScore += score;
            opponentNames.push(opponentName);
            log(name() + " got " + score + " points against " + opponentName);
        }

        function hasPlayed(otherPlayer) {
            const hasPlayed = opponentNames.indexOf(otherPlayer.name()) >= 0;
            log(name() + " has " + (hasPlayed ? "" : "NOT ") + "played against " + otherPlayer.name());
            return hasPlayed;
        }

        function reset() {
            totalScore = 0;
            opponentNames = [];
            hasAtLeastOneWalkOver = false;
        }

        function log(message) {
            console.debug("player # " + message);
        }

        return {
            name: name,
            score: score,
            addMatch: addMatch,
            hasPlayed: hasPlayed,
            walkOver: walkOver,
            hasWalkOver: hasWalkOver,
            reset: reset
        }
    }

    return {
        create: create
    }

}();
