var $swiss = window.$swiss || {};

$swiss.player = function () {

    function create(playerName) {

        var totalScore = 0;
        var opponentNames = [];
        var hasAtLeastOneWalkOver = false;

        function name() {
            return playerName;
        }

        function score() {
            return totalScore;
        }

        function walkOver() {
            log(name() + " must walk over");
            hasAtLeastOneWalkOver = true;
            totalScore += Math.round(Math.abs(totalScore) / 2);
        }

        function hasWalkOver() {
            return hasAtLeastOneWalkOver;
        }

        function addMatch(opponentName, score) {
            totalScore += score;
            opponentNames.push(opponentName);
            log(name() + " got " + score + " points against " + opponentName);
        }

        function hasPlayed(otherPlayerName) {
            var hasPlayed = opponentNames.indexOf(otherPlayerName) >= 0;
            log(name() + " has " + (hasPlayed ? "" : "NOT ") + "played against " + otherPlayerName);
            return hasPlayed;
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
            hasWalkOver: hasWalkOver
        }
    }

    return {
        create: create
    }

}();
