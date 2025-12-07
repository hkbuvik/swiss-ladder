// noinspection ES6ConvertVarToLetConst
var $swiss = window.$swiss || {};

$swiss.ladder.test = function () {
    console.groupCollapsed("ladder.test");

    const player1 = $swiss.player.create("Odin");
    const player2 = $swiss.player.create("Henrik");
    const player3 = $swiss.player.create("Sara");
    const player4 = $swiss.player.create("Jonas");
    const player5 = $swiss.player.create("Sara Marie");
    const player6 = $swiss.player.create("Per");
    const player7 = $swiss.player.create("Pål");
    const player8 = $swiss.player.create("Espen");
    const player9 = $swiss.player.create("Johan");
    const players = [player1, player2, player3, player4, player5, player6, player7, player8, player9];
    const ladder = $swiss.ladder.create(players);

    const noop = playerWithWalkover => {};

    ladder.ranking();
    let matches = ladder.pairing(noop);
    console.assert(matches.length === 4, "1. round should have 4 matches, was " + matches.length);
    matches[0].result(21, 0);
    matches[1].result(21, 11);
    matches[2].result(21, 10);
    matches[3].result(21, 19);

    ladder.ranking();
    matches = ladder.pairing(noop);
    console.assert(matches.length === 4, "2. round should have 4 matches, was " + matches.length);
    matches[0].result(21, 12);
    matches[1].result(11, 21);
    matches[2].result(21, 10);
    matches[3].result(21, 19);

    ladder.ranking();
    matches = ladder.pairing(noop);
    console.assert(matches.length === 4, "3. round should have 4 matches, was " + matches.length);
    matches[0].result(21, 12);
    matches[1].result(11, 21);
    matches[2].result(21, 10);
    matches[3].result(21, 19);

    const ranking = ladder.ranking();
    console.assert(ranking.length === 9, "9 players should have been ranked, was " + ranking.length);
    console.assert(ranking[0].score === 29, "Best score should have been 29, was " + ranking[0].score);
    const worstScore = ranking[ranking.length - 1].score;
    console.assert(worstScore === -15, "Worst score should have been -15, was " + worstScore);

    console.groupEnd();
}();
