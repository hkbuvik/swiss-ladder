var $swiss = window.$swiss || {};

$swiss.ladder.test = function () {
    console.groupCollapsed("ladder.test");

    var player1 = $swiss.player.create("Odin");
    var player2 = $swiss.player.create("Henrik");
    var player3 = $swiss.player.create("Sara");
    var player4 = $swiss.player.create("Jonas");
    var player5 = $swiss.player.create("Siv");
    var players = [player1, player2, player3, player4, player5];
    var ladder = $swiss.ladder.create(players);

    ladder.ranking();
    var matches = ladder.pairing();
    console.assert(matches.length === 2, "1. round should have 2 matches");
    var firstMatch = matches[0];
    firstMatch.addGame(21, 0);
    firstMatch.end();
    var secondMatch = matches[1];
    secondMatch.addGame(21, 11);
    secondMatch.end();

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 2, "2. round should have 2 matches");
    firstMatch = matches[0];
    firstMatch.addGame(21, 12);
    firstMatch.end();
    secondMatch = matches[1];
    secondMatch.addGame(11, 21);
    secondMatch.end();

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 2, "3. round should have 2 matches");
    firstMatch = matches[0];
    firstMatch.addGame(21, 12);
    firstMatch.end();
    secondMatch = matches[1];
    secondMatch.addGame(11, 21);
    secondMatch.end();

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 2, "4. round should have 2 matches");
    firstMatch = matches[0];
    firstMatch.addGame(21, 12);
    firstMatch.end();
    secondMatch = matches[1];
    secondMatch.addGame(11, 21);
    secondMatch.end();

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 1, "5. round should have 1 match");
    firstMatch = matches[0];
    firstMatch.addGame(21, 19);
    firstMatch.end();

    var ranking = ladder.ranking();
    console.assert(ranking.length === 5, "5 players should have been ranked");
    console.assert(ranking[0].score === 72, "Best score should have been 72");
    var worstScore = ranking[ranking.length - 1].score;
    console.assert(worstScore === -9, "Worst score should have been -9, was " + worstScore);
    matches = ladder.pairing();
    console.assert(matches.length === 1, "There should have been one more match");
    firstMatch = matches[0];
    firstMatch.addGame(1, 21);
    firstMatch.end();

    ladder.ranking();
    matches = ladder.pairing();
    console.assert(matches.length === 0, "There should not have been any more matches now!");

    console.groupEnd();
}();
