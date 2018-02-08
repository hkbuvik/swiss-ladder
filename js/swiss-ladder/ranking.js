var $swiss = window.$swiss || {};

$swiss.ranking = function () {

    function create(players) {
        var rankingNameAndScore = [];
        for (var i = 0; i < players.length; i++) {
            rankingNameAndScore.push(
                {
                    rank: 0,
                    playerName: players[i].name(),
                    score: players[i].score()
                });
        }
        for (var j = 0; j < rankingNameAndScore.length; j++) {
            var previous = rankingNameAndScore[j - 1];
            var current = rankingNameAndScore[j];
            var next = rankingNameAndScore[j + 1];
            if (previous && next) {
                current.rank = current.score === previous.score ? previous.rank : j + 1;
            } else if (previous) {
                current.rank = current.score === previous.score ? previous.rank : rankingNameAndScore.length;
            } else {
                current.rank = 1;
            }
        }
        return rankingNameAndScore;
    }

    return {
        create: create
    }

}();
