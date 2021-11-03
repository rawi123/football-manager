

export function playGameFunc(teamProp, formationProp, players) {
    const playersAtPositions = returnTeamFiltered(players)
    const rivalteam = generateRivalTeam(playersAtPositions)
    console.log(rivalteam);
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
            team["back"].push(player1, player2)
            formation["CB1"] = parseInt(player1.id)
            formation["CB2"] = parseInt(player2.id)
            teamLite.push(player1, player2)
        }
        else {
            const num = Math.floor(Math.random() * playersAtPositions[playerArr].length)
            const player = playersAtPositions[playerArr][num]
            formation[playerArr] = parseInt(player.id);
            if (playerArr === "GK") {
                team["GK"].push(player)
            }
            else if (playerArr === "RB" || playerArr === "LB") {
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
    return { team: team, formation: formation, teamLite: teamLite };

}


export const calculateTeamRating = (team, formation) => {
    let rating = 0;
    for (const position in team) {
        //eslint-disable-next-line
        team[position].map(player => {
            if (player.position === "CB" || player.position === "RB" || player.position === "LB") {
                rating += calculatePlayerRating(player, "back", formation)
            }
            else if (player.position === "LM" || player.position === "RM" || player.position === "CM") {
                rating += calculatePlayerRating(player, "mid", formation)
            }
            else if (player.position === "ST" || player.position === "LW" || player.position === "RW") {
                rating += calculatePlayerRating(player, "front", formation)
            }
            else {
                rating += calculatePlayerRating(player, "GK", formation)
            }
        });
    }
    return parseFloat((rating / 11).toFixed(2));
}
const calculatePlayerRating = (player, pos, formation) => {//if player in the right position add 5% to his rating
    let rating = 0;
    let calc = 0;
    if (pos === "front") {
        //attack 80% mid 12% def 8%
        calc = parseFloat(player.attack * 0.8 + player.gameVision * 0.12 + player.defense * 0.08);
    }
    else if (pos === "mid") {
        //attack 15% mid 60% def 25%
        calc = parseFloat(player.attack * 0.15 + player.gameVision * 0.6 + player.defense * 0.25);
    }
    else if (pos === "back") {
        //attack 8% mid 15% def 75%
        calc = parseFloat(player.attack * 0.08 + player.gameVision * 0.15 + player.defense * 0.77);
    }
    else {
        //goalkeeper
        calc = parseFloat(player.goalKeeping);
    }
    //if player playing in his orginal position add 5% to rating else if he is in the same line remove 8% else remove 15%
    //if player is a goalie and he is not at goal take down 35%
    if (player.position === "CB") {
        if (formation[`${player.position}1`] === parseInt(player.id) ||
            formation[`${player.position}2`] === parseInt(player.id)) {
            rating = parseFloat((calc + calc * 0.05).toFixed(2));
        }
        else if (formation["RB"] === parseInt(player.id) || formation["LB"] === parseInt(player.id)) {
            rating = parseFloat((calc - calc * 0.08).toFixed(2));
        }
        else {
            rating = parseFloat((calc - calc * 0.15).toFixed(2));
        }
    }
    else if (formation[player.position] === parseInt(player.id)) {
        rating = parseFloat((calc + calc * 0.05).toFixed(2));
    }
    else {
        if(pos==="GK"){
            rating=parseFloat((calc - calc * 0.35).toFixed(2))
        }
        else if (pos === "back") {
            if (returnIfInPosition(formation, player, "RB", "CB1", "CB2", "LB")) {
                rating = parseFloat((calc - calc * 0.08).toFixed(2));
            }
        }
        else if (pos === "mid") {
            if (returnIfInPosition(formation, player, "CM", "RM", "LM")) {
                rating = parseFloat((calc - calc * 0.08).toFixed(2));
            }
        }
        else if (pos === "front") {
            if (returnIfInPosition(formation, player, "ST", "RW", "LW")) {
                rating = parseFloat((calc - calc * 0.08).toFixed(2));
            }
        }
        else rating = parseFloat((calc - calc * 0.15).toFixed(2));
    }
    return rating
}
const returnIfInPosition = (formation, player, pos1, pos2, pos3, pos4 = false) => {
    if (formation[pos1] === parseInt(player.id)
        || formation[pos2] === parseInt(player.id)
        || formation[pos3] === parseInt(player.id)
        || (pos4 && formation[pos4] === parseInt(player.id))) {
        return true
    }
    return false
}