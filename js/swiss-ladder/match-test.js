// noinspection ES6ConvertVarToLetConst
var $swiss = window.$swiss || {};

$swiss.match.test = function () {
    console.groupCollapsed("match.test");
    const playerA = $swiss.player.create("Sara");
    const playerB = $swiss.player.create("B");
    const match = $swiss.match.create(playerA, playerB);

    match.result(21, 17);
    let playerAScore = playerA.score();
    const expectedAScore = 4;

    console.assert(
        playerAScore === expectedAScore,
        "Player A score should be " + expectedAScore + ", was " + playerAScore);
    let playerBScore = playerB.score();
    const expectedBScore = -playerAScore;
    console.assert(
        playerBScore === expectedBScore,
        "Player B score should be " + expectedBScore + ", was " + playerBScore);
    console.assert(!match.hasPlayer($swiss.player.create("Sara Marie")));
    console.groupEnd();
}();
