

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
    const nations = {};
    for (const position in team) {
        //eslint-disable-next-line
        team[position].map(player => {
            nations[player.nationality] = nations[player.nationality] + 1 || 1
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
    rating = rating / 11;
    rating += calcNations(nations);
    return parseFloat((rating).toFixed(2))
}

const calcNations = (nations) => {
    let ratingToAdd = 0;
    for (const playerNum in nations) {
        if (nations[playerNum] < 3) { }

        else if (nations[playerNum] >= 3 && nations[playerNum] <= 5) { ratingToAdd += 2; }

        else if (nations[playerNum] >= 6 && nations[playerNum] <= 9) { ratingToAdd += 4.5; }

        else { ratingToAdd += 5.8; }

    }
    return ratingToAdd;
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
        if (pos === "GK") {
            rating = parseFloat((calc - calc * 0.35).toFixed(2))
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

export const playFinalGame = (rating, rivalRating, teamScoreProp, rivalScoreProp) => {
    let teamScore = teamScoreProp;
    let rivalScore = rivalScoreProp;
    // const num = Math.floor(Math.random() * gameTime + 1)
    if (rivalRating > rating) {
        if (calcGoal(rivalRating, rating) === "max") {
            rivalScore++;
        }
        else {
            teamScore++;
        }
    }
    else {
        if (calcGoal(rivalRating, rating)) {
            if (calcGoal(rivalRating, rating) === "max") {
                teamScore++;
            }
            else {
                rivalScore++;
            }
        }
    }
    return ({ team: teamScore, rival: rivalScore })
}
const calcGoal = (maxScore, minScore) => {
    let difference = parseFloat((maxScore - minScore).toFixed(2)) - minScore * 0.4;
    const max = Math.floor(Math.random() * (maxScore - difference) + difference);
    const min = Math.floor(Math.random() * (minScore - minScore * 0.1));
    if (max > min) {
        return "max"
    }
    else return "min"
}

export const genTeamLite=(team)=>{
    const teamLite=[]
    for (const pos in team){
        team[pos].map(val=>{
            teamLite.push(val)
        })
    }
    return (teamLite);
}