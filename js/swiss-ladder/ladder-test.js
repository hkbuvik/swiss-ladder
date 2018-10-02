var $swiss = window.$swiss || {};

$swiss.ladder.test = function () {
    console.groupCollapsed("ladder.test");

    var player1 = $swiss.player.create("Odin");
    var player2 = $swiss.player.create("Henrik");
    var player3 = $swiss.player.create("Sara");
    var player4 = $swiss.player.create("Jonas");
    var player5 = $swiss.player.create("Sara Marie");
    var players = [player1, player2, player3, player4, player5];
    var ladder = $swiss.ladder.create(players);

    ladder.ranking();
    var matches = ladder.pairing();
    console.assert(matches.length === 2, "1. round should have 2 matches");
    matches[0].result(21, 0);
    matches[1].result(21, 11);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 2, "2. round should have 2 matches");
    matches[0].result(21, 12);
    matches[1].result(11, 21);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 2, "3. round should have 2 matches");
    matches[0].result(21, 12);
    matches[1].result(11, 21);

    var ranking = ladder.ranking();
    console.assert(ranking.length === 5, "5 players should have been ranked");
    console.assert(ranking[0].score === 31, "Best score should have been 31, was " + ranking[0].score);
    var worstScore = ranking[ranking.length - 1].score;
    console.assert(worstScore === -20, "Worst score should have been -20, was " + worstScore);

    console.groupEnd();
}();
