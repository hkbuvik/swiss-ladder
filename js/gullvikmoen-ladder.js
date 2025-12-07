// noinspection ES6ConvertVarToLetConst
var $gullvikmoen = window.$gullvikmoen || {};

$gullvikmoen.controller = function () {

    let showAbout;
    let ladder;
    let ranking;
    let matches;
    let roundCount;
    const players = [];
    const playersWithWalkover = [];

    const aboutPanel = document.getElementById('aboutPanel');
    const addPlayersPanel = document.getElementById('addPlayersPanel');
    const rankingPanel = document.getElementById('rankingPanel');
    const ladderFinishedPanel = document.getElementById('ladderFinishedPanel');

    const pairingPanel = document.getElementById('pairingPanel');
    const aboutLink = document.getElementById('aboutLink');
    const playerName = document.getElementById('playerName');
    const roundsToPlay = document.getElementById('roundsToPlay');
    const playerList = document.getElementById('playerList');
    const rankingList = document.getElementById('rankingList');
    const pairingList = document.getElementById('pairingList');
    const resultsList = document.getElementById('resultsList');
    const roundSpan = document.getElementById('roundSpan');
    const pairPlayersButton = document.getElementById('pairPlayersButton');

    init();

    function init() {
        players.forEach(player => player.reset());
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
        const thePlayerName = playerName.value.trim();
        if (thePlayerName.length === 0) {
            playerName.value = "";
            return;
        }
        const alreadyAdded = players.some(player => player.name() === thePlayerName);
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
            matches = ladder.pairing(playerWithWalkover => playersWithWalkover.push(playerWithWalkover));
            renderNewMatches();
        }
    }

    function pointsValidationErrors() {
        for (let i = 0; i < matches.length; i++) {
            const pointsPlayerAElement = document.getElementById("pointsPlayerAMatch" + i);
            if (isNaN(parseInt(pointsPlayerAElement.value))) {
                pointsPlayerAElement.focus();
                return true;
            }
            const pointsPlayerBElement = document.getElementById("pointsPlayerBMatch" + i);
            if (isNaN(parseInt(pointsPlayerBElement.value))) {
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
        matches.forEach((match, index) => {
            const pointsPlayerA = parseInt(document.getElementById("pointsPlayerAMatch" + index).value);
            const pointsPlayerB = parseInt(document.getElementById("pointsPlayerBMatch" + index).value);
            match.result(pointsPlayerA, pointsPlayerB);
        });
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
        for (let i = 0; i < players.length; i++) {
            const a = document.createElement("a");
            a.href = 'javascript:$gullvikmoen.controller.removePlayer(' + i + ');';
            a.innerText = "" + players[i].name();
            a.title = "Klikk for å slette " + players[i].name();
            const li = document.createElement("li");
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
        const round = document.createElement("h3");
        round.innerHTML = "Stilling etter runde " + roundCount;
        const thisRoundRankingList = document.createElement("div");
        thisRoundRankingList.appendChild(round);
        const rankingTable = document.createElement("table");
        const headerRow = document.createElement("thead");
        const rankHeader = document.createElement("td");
        rankHeader.innerText = "#";
        const nameHeader = document.createElement("td");
        nameHeader.innerText = "Navn";
        const scoreHeader = document.createElement("td");
        scoreHeader.innerText = "Poeng";
        headerRow
            .appendChild(rankHeader)
            .appendChild(nameHeader)
            .appendChild(scoreHeader);
        rankingTable.appendChild(headerRow);
        for (let i = 0; i < ranking.length; i++) {
            const rankCell = document.createElement("td");
            rankCell.innerText = ranking[i].rank + ". ";
            const nameCell = document.createElement("td");
            nameCell.innerText = ranking[i].playerName;
            const scoreCell = document.createElement("td");
            scoreCell.innerText = ranking[i].score;
            scoreCell.className = "resultPoints right";
            const rankingRow = document.createElement("tr");
            rankingRow
                .appendChild(rankCell)
                .appendChild(nameCell)
                .appendChild(scoreCell);
            rankingTable.appendChild(rankingRow);
        }
        thisRoundRankingList.appendChild(rankingTable);

        let matchResults = "";
        if (matches) {
            matchResults = "<table><thead><td colspan='3'>Kamper</td></thead>";
            matches.forEach(match =>
                matchResults +=
                    "<tr>" +
                    "<td>" + match.result().name + ": </td>" +
                    "<td>&nbsp;</td>" +
                    "<td class='resultPoints'>" + match.result().points + "</td>" +
                    "</tr>");
            matchResults += "</table>";
        }

        let compensationTable = "";
        let playerWithWalkover = playersWithWalkover.pop();
        if (playerWithWalkover) {
            compensationTable = "<table>" +
                "<thead><td>Kompensasjon</td></thead>" +
                "<tr><td>" + playerWithWalkover.playerName + ": +<span class='resultPoints'>" + playerWithWalkover.compensation + "</span></td></tr>" +
                "</table>";
        }

        rankingList.innerHTML =
            "<tr>" +
            "<td>" + thisRoundRankingList.innerHTML + "</td>" +
            "<td>" + compensationTable + "</td>" +
            "<td>" + matchResults + resultsList.innerHTML + "</td>" +
            "</tr>" +
            // Previous rankings and matches
            rankingList.innerHTML;
    }

    function renderNewMatches() {
        pairingList.innerHTML = "";
        let table = "<table>";
        roundSpan.innerText = "" + (roundCount + 1) + " (av " + ladder.roundsToPlay() + ")";
        for (let i = 0; i < matches.length; i++) {
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
        playersWithWalkover.forEach(player => table += "<tr><td>" + player.playerName + " må stå over" + "</td></tr>");
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
                let parent = element.parentNode;
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
