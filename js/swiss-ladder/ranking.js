// noinspection ES6ConvertVarToLetConst
var $swiss = window.$swiss || {};

$swiss.ranking = function () {

    function create(players) {

        let rankOffset = 0;
        return players.sort(byScoreDescending)
            .map(playerWithoutRank)
            .map(playerWithRank);

        function byScoreDescending(playerA, playerB) {
            return playerB.score() - playerA.score();
        }

        function playerWithoutRank(player) {
            return ({
                rank: 0,
                playerName: player.name(),
                score: player.score()
            });
        }

        function playerWithRank(playerWithoutRank, index, allPlayers) {
            const previousPlayer = allPlayers[index - 1];
            if (previousPlayer) {
                if (playerWithoutRank.score === previousPlayer.score) {
                    playerWithoutRank.rank = previousPlayer.rank;
                    rankOffset++;
                } else {
                    playerWithoutRank.rank = previousPlayer.rank + 1 + rankOffset;
                    rankOffset = 0;
                }
            } else {
                playerWithoutRank.rank = 1;
            }

            return playerWithoutRank;
        }
    }

    return {
        create: create
    }

}();
