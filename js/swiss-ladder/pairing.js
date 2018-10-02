var $swiss = window.$swiss || {};

$swiss.pairing = function () {

    var players = [];
    var matches = [];

    function create(playersToPair) {
        players = playersToPair;
        matches = [];
        for (var i = 0; i < players.length; i++) {

            var playerWithWalkOver = i === 0 && findPlayerWithWalkOverWithoutMatch(playersToPair);
            var playerA = playerWithWalkOver ? playerWithWalkOver : players[i];
            debug("Start finding player A in match " + (matches.length + 1) + ": " + playerA.name());
            if (matchesContains(playerA)) {
                debug("Player " + playerA.name() + " has already a match, skipping search");
                continue;
            }

            var playerB = findCandidateB(playerA);

            if (playerB) {
                var match = $swiss.match.create(playerA, playerB);
                matches.push(match);
                log("Match " + matches.length + " set up: " + match.name());
            } else {
                if (playerA.hasWalkOver()) {
                    warn("Player " + playerA.name() + " has already a WO!");
                }
                playerA.walkOver();
            }
        }
        if (matches.length === 0) {
            warn("No playable matches!");
        }
        return matches;
    }

    function findPlayerWithWalkOverWithoutMatch(players) {
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.hasWalkOver() && !matchesContains(player)) {
                return player;
            }
        }
        return null;
    }

    function matchesContains(player) {
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            if (match.isAPlayer(player)) {
                return true;
            }
        }
        return false;
    }

    function findCandidateB(playerA) {
        var playerBCandidate;
        for (var j = 0; j < players.length; j++) {
            playerBCandidate = players[j];
            if (matchesContains(playerBCandidate) ||
                playerBCandidate.hasPlayed(playerA) ||
                playerA.name() === playerBCandidate.name()) {
                debug("Player " + playerBCandidate.name() + " has already played or matched, searching further...");
                playerBCandidate = players[j];
            } else {
                debug("Found new player B candidate: " + playerBCandidate.name());
                return playerBCandidate;
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

    function warn(message) {
        console.warn("pairing # " + message);
    }

    return {
        create: create
    }

}();
