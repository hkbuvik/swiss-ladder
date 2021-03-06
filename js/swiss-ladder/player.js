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
            totalScore += parseInt(Math.abs(totalScore) / 2, 10);
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
            var hasPlayed = opponentNames.indexOf(otherPlayer.name()) >= 0;
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
