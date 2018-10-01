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
    var firstMatch = matches[0];
    firstMatch.result(21, 0);
    var secondMatch = matches[1];
    secondMatch.result(21, 11);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 2, "2. round should have 2 matches");
    firstMatch = matches[0];
    firstMatch.result(21, 12);
    secondMatch = matches[1];
    secondMatch.result(11, 21);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 2, "3. round should have 2 matches");
    firstMatch = matches[0];
    firstMatch.result(21, 12);
    secondMatch = matches[1];
    secondMatch.result(11, 21);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 2, "4. round should have 2 matches");
    firstMatch = matches[0];
    firstMatch.result(21, 12);
    secondMatch = matches[1];
    secondMatch.result(11, 21);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 1, "5. round should have 1 match");
    firstMatch = matches[0];
    firstMatch.result(21, 19);

    var ranking = ladder.ranking();
    console.assert(ranking.length === 5, "5 players should have been ranked");
    console.assert(ranking[0].score === 72, "Best score should have been 72");
    var worstScore = ranking[ranking.length - 1].score;
    console.assert(worstScore === -10, "Worst score should have been -10, was " + worstScore);
    matches = ladder.pairing();
    console.assert(matches.length === 1, "There should have been one more match");
    firstMatch = matches[0];
    firstMatch.result(1, 21);

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 0, "There should not have been any more matches now!");

    console.groupEnd();
}();
