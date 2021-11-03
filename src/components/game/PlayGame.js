

export function playGameFunc(teamProp, formationProp, players) {
    const playersAtPositions = returnTeamFiltered(players)
    const rivalteam = generateRivalTeam(playersAtPositions)
    return rivalteam;
}

const returnTeamFiltered = (players) => {
    return (players.reduce((obj, player) => {
        obj[player.position].push(player)
        return obj
    }, {
        "GK": [],
        "LW": [],
        "RW": [],
        "ST": [],
        "CM": [],
        "LM": [],
        "RM": [],
        "CB": [],
        "LB": [],
        "RB": [],
    }))

}

const generateRivalTeam = (playersAtPositions) => {
    const formation = {
        "LW": "",
        "ST": "",
        "RW": "",
        "LM": "",
        "CM": "",
        "RM": "",
        "LB": "",
        "CB1": "",
        "CB2": "",
        "RB": "",
        "GK": ""
    }
    const team = {
        "GK": [],
        "back": [],
        "mid": [],
        "front": []
    }
    const teamLite = [];
    for (const playerArr in playersAtPositions) {
        if (playerArr === "CB") {
            const num = Math.floor(Math.random() * playersAtPositions[playerArr].length)
            let num1 = Math.floor(Math.random() * playersAtPositions[playerArr].length)
            while (num === num1) {
                num1 = Math.floor(Math.random() * playersAtPositions[playerArr].length)
            }
            const player1 = playersAtPositions[playerArr][num],
                player2 = playersAtPositions[playerArr][num1]
            team["back"].push(player1,player2)
            formation["CB1"] = parseInt(player1.id)
            formation["CB2"] = parseInt(player2.id)
            teamLite.push(player1,player2)
        }
        else {
            const num = Math.floor(Math.random() * playersAtPositions[playerArr].length)
            const player = playersAtPositions[playerArr][num]
            formation[playerArr] = parseInt(player.id);
            if (playerArr === "GK") {
                team["GK"].push(player)
            }
            if (playerArr === "RB" || playerArr === "LB") {
                team["back"].push(player)
            }
            else if (playerArr === "CM" || playerArr === "RM" || playerArr === "LM") {
                team["mid"].push(player)
            }
            else {
                team["front"].push(player)
            }
            teamLite.push(player)
        }
    }
    return { team: team, formation: formation,teamLite:teamLite };

}
