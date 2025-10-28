var $swiss = window.$swiss || {};

$swiss.pairing = function () {

    const playersWithWalkover = [];

    var players = [];
    var matches = [];

    function create(playersToPair) {
        players = playersToPair;
        matches = [];
        for (var i = 0; i < players.length; i++) {

            debug("Start finding player A in match " + (matches.length + 1));
            var playerA;

            var playerWithWalkOver = i === 0 && playersToPair.find((player) => player.hasWalkOver());
            if (playerWithWalkOver
                && !playersWithWalkover.some(player => player.name() === playerWithWalkOver.name())) {
                playersWithWalkover.push(playerWithWalkOver);
                playerA = playerWithWalkOver;
                debug("Found player A (with walkover): " + playerWithWalkOver.name());
            } else {
                playerA = players[i];
                debug("Found player A: " + playerA.name());
            }

            if (matches.some(match => match.hasPlayer(playerA))) {
                debug("Player " + playerA.name() + " has already a match, skipping search");
                continue;
            }

            var playerB = findCandidateB(playerA);

            if (playerB) {
                var match = $swiss.match.create(playerA, playerB);
                matches.push(match);
                log("Match " + matches.length + " set up: " + match.name());
            } else {
                playerA.walkOver();
            }
        }

        return matches;
    }

    function findCandidateB(playerA) {
        for (var j = 0; j < players.length; j++) {
            var candidateB = players[j];
            if (matches.some(match => match.hasPlayer(candidateB))
                || candidateB.hasPlayed(playerA)
                || candidateB.name() === playerA.name()) {
                debug("Player " + candidateB.name() + " has already played with, or is in match with " + playerA.name());
            } else {
                debug("Found new player B candidate: " + candidateB.name());
                return candidateB;
            }
        }
        return null;
    }

    function debug(message) {
        console.debug("pairing # " + message);
    }

    function log(message) {
        console.info("pairing # " + message);
    }

    return {
        create: create
    }

}();
