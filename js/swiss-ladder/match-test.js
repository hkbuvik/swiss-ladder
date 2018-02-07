var $swiss = window.$swiss || {};

$swiss.match.test = function () {
    console.groupCollapsed("match.test");
    var playerA = $swiss.player.create("A");
    var playerB = $swiss.player.create("B");
    var match = $swiss.match.create(playerA, playerB);

    match.addGame(21, 17);
    match.end();
    var playerAScore = playerA.score();
    var expectedAScore = 4;

    console.assert(
        playerAScore === expectedAScore,
        "Player A score should be " + expectedAScore + ", was " + playerAScore);
    var playerBScore = playerB.score();
    var expectedBScore = -playerAScore;
    console.assert(
        playerBScore === expectedBScore,
        "Player B score should be " + expectedBScore + ", was " + playerBScore);
    console.groupEnd();
}();
