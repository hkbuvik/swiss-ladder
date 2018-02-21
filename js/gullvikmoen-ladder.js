var $gullvikmoen = window.$gullvikmoen || {};

$gullvikmoen.controller = function () {

    var players = [];
    var ladder = undefined;
    var ranking = undefined;
    var matches = undefined;
    var roundCount = 1;

    var addPlayersPanel = document.getElementById('addPlayersPanel');
    var rankingPanel = document.getElementById('rankingPanel');
    var pairingPanel = document.getElementById('pairingPanel');

    var playerName = document.getElementById('playerName');
    var playerList = document.getElementById('playerList');
    var rankingList = document.getElementById('rankingList');
    var pairingList = document.getElementById('pairingList');
    var roundSpan = document.getElementById('roundSpan');
    var pairPlayersButton = document.getElementById('pairPlayersButton');
    var ladderFinished = document.getElementById('ladderFinished');

    document.getElementsByTagName("input").item(0).focus();

    function addPlayer(event) {
        if (event.target.id === "playerName" && event.keyCode !== 13) {
            return;
        }
        var name = playerName.value;
        players.push($swiss.player.create(name));
        renderPlayers();
        playerName.value = "";

        if (players.length > 1) {
            pairPlayersButton.disabled = "";
        }
    }

    function removePlayer(index) {
        players.splice(index, 1);
        renderPlayers();
    }

    function pairPlayers() {
        ranking = [];
        matches = [];
        if (!ladder) {
            ladder = $swiss.ladder.create(players);
        }
        ranking = ladder.ranking();
        renderShowMatchesAndRanking();
        matches = ladder.pairing();
        if (matches.length === 0) {
            renderLadderFinished();
        } else {
            renderMatches();
        }
    }

    function pointsValidationErrors() {
        for (var i = 0; i < matches.length; i++) {
            var pointsPlayerAElement = document.getElementById("pointsPlayerAMatch" + i);
            if (isNaN(parseInt(pointsPlayerAElement.value, 10))) {
                pointsPlayerAElement.focus();
                return true;
            }
            var pointsPlayerBElement = document.getElementById("pointsPlayerBMatch" + i);
            if (isNaN(parseInt(pointsPlayerBElement.value, 10))) {
                pointsPlayerBElement.focus();
                return true;
            }
        }
        return false;
    }

    function endRound() {
        if (pointsValidationErrors()) {
            return;
        }
        for (var i = 0; i < matches.length; i++) {
            var pointsPlayerA = parseInt(document.getElementById("pointsPlayerAMatch" + i).value, 10);
            var pointsPlayerB = parseInt(document.getElementById("pointsPlayerBMatch" + i).value);
            matches[i].addGame(pointsPlayerA, pointsPlayerB);
            matches[i].end();
        }
        pairPlayers();
    }

    function renderLadderFinished() {
        pairingPanel.className = "hidden";
        ladderFinished.className = "";
    }

    function renderPlayers() {
        playerList.innerHTML = "";
        for (var i = 0; i < players.length; i++) {
            var li = document.createElement("li");
            li.id = "player" + (players.length - 1);
            li.innerHTML = "<a href=javascript:$gullvikmoen.controller.removePlayer(" + i + ")>";
            li.innerHTML += players[i].name();
            li.innerHTML += "</a>";
            playerList.appendChild(li);
        }
        playerName.focus();
    }

    function renderShowMatchesAndRanking() {
        addPlayersPanel.className = "hidden";
        rankingPanel.className = "";
        pairingPanel.className = "";
        rankingList.innerHTML = "";
        for (var i = 0; i < ranking.length; i++) {
            var div = document.createElement("div");
            div.id = "rank" + (players.length - 1);
            div.innerHTML = ranking[i].rank + ". " + ranking[i].playerName;
            div.innerHTML += "<span class='right'>(" + ranking[i].score + ")</span>";
            rankingList.appendChild(div);
        }
    }

    function renderMatches() {
        pairingList.innerHTML = "";
        var table = "<table>";
        roundSpan.innerText = "" + roundCount;
        for (var i = 0; i < matches.length; i++) {
            table += "<tr><td>" + (i + 1) + ". " + matches[i].name() + ": </td>";
            table += "<td>" +
                "<input type='text' minlength='1' maxlength='2' required id='pointsPlayerAMatch" + i + "' class='points'>" +
                "</td>";
            table += "<td> - </td>";
            table += "<td>" +
                "<input type='text' minlength='1' maxlength='2' required id='pointsPlayerBMatch" + i + "' class='points'>" +
                "</td>";
            table += "</tr>";
        }
        table += "</table>";
        pairingList.innerHTML = table;
        roundCount++;
    }

    return {
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        pairPlayers: pairPlayers,
        endRound: endRound
    }
}();

$gullvikmoen.delegate = function () {

    /**
     * @param id ID for the element which the listener should be triggered for
     */
    function forId(id) {

        /**
         * Delegation of event.
         *
         * @param listener Listener to delegate event to
         */
        function handleWith(listener) {

            function hasParentWithId(element) {
                var parent = element.parentNode;
                if (!parent) {
                    return false;
                }
                if (parent.id === id) {
                    return true;
                }
                return hasParentWithId(parent);
            }

            function delegate(event) {
                if (event.target.id === id || hasParentWithId(event.target)) {
                    if (document.getElementById(id)) {
                        listener(event);
                    }
                }
            }

            return delegate;
        }

        return {
            handleWith: handleWith
        }
    }

    return {
        forId: forId
    }

}();

$gullvikmoen.setup = function () {

    document.addEventListener(
        "click",
        $gullvikmoen.delegate
            .forId('addPlayerButton')
            .handleWith($gullvikmoen.controller.addPlayer));
    document.addEventListener(
        'keydown',
        $gullvikmoen.delegate
            .forId('playerName')
            .handleWith($gullvikmoen.controller.addPlayer));
    document.addEventListener(
        "click",
        $gullvikmoen.delegate
            .forId('pairPlayersButton')
            .handleWith($gullvikmoen.controller.pairPlayers)
    );
    document.addEventListener(
        "click",
        $gullvikmoen.delegate
            .forId('endRoundButton')
            .handleWith($gullvikmoen.controller.endRound)
    );

}();
