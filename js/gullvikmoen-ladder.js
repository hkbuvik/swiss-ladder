var $gullvikmoen = window.$gullvikmoen || {};

$gullvikmoen.controller = function () {

    var showAbout;
    var players = [];
    var ladder;
    var ranking;
    var matches;
    var roundCount;

    var aboutPanel = document.getElementById('aboutPanel');
    var addPlayersPanel = document.getElementById('addPlayersPanel');
    var rankingPanel = document.getElementById('rankingPanel');
    var ladderFinishedPanel = document.getElementById('ladderFinishedPanel');

    var pairingPanel = document.getElementById('pairingPanel');
    var aboutLink = document.getElementById('aboutLink');
    var playerName = document.getElementById('playerName');
    var roundsToPlay = document.getElementById('roundsToPlay');
    var playerList = document.getElementById('playerList');
    var rankingList = document.getElementById('rankingList');
    var pairingList = document.getElementById('pairingList');
    var resultsList = document.getElementById('resultsList');
    var roundSpan = document.getElementById('roundSpan');
    var pairPlayersButton = document.getElementById('pairPlayersButton');

    init();

    function init() {
        for (var i = 0; i < players.length; i++) {
            players[i].reset();
        }
        ladder = null;
        ranking = null;
        matches = null;
        roundCount = 0;
        addPlayersPanel.className = "";
        rankingPanel.className = "hidden";
        pairingPanel.className = "hidden";
        rankingList.innerHTML = "";
        resultsList.innerHTML = "";
        document.getElementsByTagName("input").item(0).focus();
    }

    function addPlayer(event) {
        if (event.target.id === "playerName" && event.keyCode !== 13) {
            return;
        }
        if (!playerName.value) {
            return;
        }
        var thePlayerName = playerName.value.trim();
        if (thePlayerName.length === 0) {
            playerName.value = "";
            return;
        }
        var alreadyAdded = players.some(function (player) {
            return player.name() === thePlayerName
        });
        if (alreadyAdded) {
            playerName.value = thePlayerName + " finnes allerede!";
            setTimeout(function () {
                playerName.value = "";
            }, "700");
            return;
        }
        players.push($swiss.player.create(thePlayerName));
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
        if (ladder == null) {
            ladder = $swiss.ladder.create(players);
        }
        ranking = ladder.ranking();
        renderRankingAndPlayedMatches(ranking, matches);
        if (roundCount >= ladder.roundsToPlay()) {
            renderLadderFinished();
        } else {
            matches = ladder.pairing();
            renderNewMatches();
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
            matches[i].result(pointsPlayerA, pointsPlayerB);
        }
        pairPlayers();
    }

    function restart(event) {
        event && event.preventDefault();
        ladderFinishedPanel.className = "hidden";
        init();
        renderPlayers();
    }

    function renderAbout(event) {
        event && event.preventDefault();
        showAbout = !showAbout;
        aboutLink.innerText = showAbout ? "Skjul Om" : "Om";
        aboutPanel.className = showAbout ? "" : "hidden";
    }

    function renderLadderFinished() {
        pairingPanel.className = "hidden";
        ladderFinishedPanel.className = "";
    }

    function renderPlayers() {
        playerList.innerHTML = "";
        for (var i = 0; i < players.length; i++) {
            var a = document.createElement("a");
            a.href = 'javascript:$gullvikmoen.controller.removePlayer(' + i + ');';
            a.innerText = "" + players[i].name();
            a.title = "Klikk for å slette " + players[i].name();
            var li = document.createElement("li");
            li.id = "player" + (players.length - 1);
            li.appendChild(a);
            playerList.appendChild(li);
        }
        roundsToPlay.innerText = "" + Math.ceil(Math.log(players.length) * Math.LOG2E);
        playerName.focus();
    }

    function renderRankingAndPlayedMatches(ranking, matches) {
        addPlayersPanel.className = "hidden";
        pairingPanel.className = "";
        if (roundCount === 0) {
            return;
        }
        rankingPanel.className = "";
        var round = document.createElement("h3");
        round.innerHTML = "Etter runde " + roundCount;
        var thisRoundRankingList = document.createElement("div");
        thisRoundRankingList.appendChild(round);
        var rankingTable = document.createElement("table");
        var headerRow = document.createElement("thead");
        var rankHeader = document.createElement("td");
        rankHeader.innerText = "#";
        var nameHeader = document.createElement("td");
        nameHeader.innerText = "Navn";
        var scoreHeader = document.createElement("td");
        scoreHeader.innerText = "Poeng";
        headerRow
            .appendChild(rankHeader)
            .appendChild(nameHeader)
            .appendChild(scoreHeader);
        rankingTable.appendChild(headerRow);
        for (var i = 0; i < ranking.length; i++) {
            var rankCell = document.createElement("td");
            rankCell.innerText = ranking[i].rank + ". ";
            var nameCell = document.createElement("td");
            nameCell.innerText = ranking[i].playerName;
            var scoreCell = document.createElement("td");
            scoreCell.innerText = ranking[i].score;
            scoreCell.className = "resultPoints right";
            var rankingRow = document.createElement("tr");
            rankingRow
                .appendChild(rankCell)
                .appendChild(nameCell)
                .appendChild(scoreCell);
            rankingTable.appendChild(rankingRow);
        }
        thisRoundRankingList.appendChild(rankingTable);
        if (matches) {
            var table = "<table>";
            for (var j = 0; j < matches.length; j++) {
                table +=
                    "<tr>" +
                    "<td>" + matches[j].result().name + ": </td>" +
                    "<td>&nbsp;</td>" +
                    "<td class='resultPoints'>" + matches[j].result().points + "</td>" +
                    "</tr>";
            }
            table += "</table>";
        }
        rankingList.innerHTML =
            "<tr><td>" + thisRoundRankingList.innerHTML + "</td>" +
            "<td><hr>" + table + resultsList.innerHTML + "</td></tr>" +
            rankingList.innerHTML;
    }

    function renderNewMatches() {
        pairingList.innerHTML = "";
        var table = "<table>";
        roundSpan.innerText = "" + (roundCount + 1) + " (av " + ladder.roundsToPlay() + ")";
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

    // noinspection JSUnusedGlobalSymbols
    return {
        renderAbout: renderAbout,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        pairPlayers: pairPlayers,
        endRound: endRound,
        restart: restart
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
        "click",
        $gullvikmoen.delegate
            .forId('aboutLink')
            .handleWith($gullvikmoen.controller.renderAbout));
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
    document.addEventListener(
        "click",
        $gullvikmoen.delegate
            .forId('restartButton')
            .handleWith($gullvikmoen.controller.restart)
    );
    document.addEventListener(
        "click",
        $gullvikmoen.delegate
            .forId('abortLink')
            .handleWith($gullvikmoen.controller.restart)
    );

}();
