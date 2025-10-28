var $swiss = window.$swiss || {};

$swiss.ladder.test = function () {
    console.groupCollapsed("ladder.test");

    var player1 = $swiss.player.create("Odin");
    var player2 = $swiss.player.create("Henrik");
    var player3 = $swiss.player.create("Sara");
    var player4 = $swiss.player.create("Jonas");
    var player5 = $swiss.player.create("Sara Marie");
    var player6 = $swiss.player.create("Per");
    var player7 = $swiss.player.create("Pål");
    var player8 = $swiss.player.create("Espen");
    var player9 = $swiss.player.create("Johan");
    var players = [player1, player2, player3, player4, player5, player6, player7, player8, player9];
    var ladder = $swiss.ladder.create(players);

    ladder.ranking();
    var matches = ladder.pairing();
    console.assert(matches.length === 4, "1. round should have 4 matches, was " + matches.length);
    matches[0].result(21, 0);
    matches[1].result(21, 11);
    matches[2].result(21, 10);
    matches[3].result(21, 19);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 4, "2. round should have 4 matches, was " + matches.length);
    matches[0].result(21, 12);
    matches[1].result(11, 21);
    matches[2].result(21, 10);
    matches[3].result(21, 19);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 4, "3. round should have 4 matches, was " + matches.length);
    matches[0].result(21, 12);
    matches[1].result(11, 21);
    matches[2].result(21, 10);
    matches[3].result(21, 19);

    var ranking = ladder.ranking();
    console.assert(ranking.length === 9, "9 players should have been ranked, was " + ranking.length);
    console.assert(ranking[0].score === 29, "Best score should have been 29, was " + ranking[0].score);
    var worstScore = ranking[ranking.length - 1].score;
    console.assert(worstScore === -15, "Worst score should have been -15, was " + worstScore);

    console.groupEnd();
}();
