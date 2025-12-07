// noinspection ES6ConvertVarToLetConst
var $swiss = window.$swiss || {};

$swiss.pairing = function () {

    const playersWithWalkover = [];

    let players = [];
    let matches = [];

    function create(playersToPair, onWalkOverFound) {
        players = playersToPair;
        matches = [];
        for (let i = 0; i < players.length; i++) {

            debug("Start finding player A in match " + (matches.length + 1));
            let playerA;

            const playerWithWalkOver = i === 0 && playersToPair.find((player) => player.hasWalkOver());
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

            const playerB = findCandidateB(playerA);

            if (playerB) {
                const match = $swiss.match.create(playerA, playerB);
                matches.push(match);
                log("Match " + matches.length + " set up: " + match.name());
            } else {
                let walkOverInfo = playerA.walkOver();
                onWalkOverFound(walkOverInfo);
            }
        }

        return matches;
    }

    function findCandidateB(playerA) {
        for (let j = 0; j < players.length; j++) {
            let candidateB = players[j];
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
