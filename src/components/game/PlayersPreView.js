import React from 'react'
import PlayerCard from '../teamOverview/PlayerCard'
export default function PlayersPreView({setPlayerNum,rivalTeam,savedPlayer,setSavedPlayer}) {
    const returnPlayers = () => {//return array of players as divs and add handlers 
        let temp = [],
            arr = [],
            counter = 0;
        for (const position in rivalTeam.formation) {
            const player = (rivalTeam.teamLite.find(val => rivalTeam.formation[position] === parseInt(val.id))) || {}
            arr.push(<div
                key={position}
                onClick={() => { savedPlayer !== player ? setSavedPlayer(player) : setSavedPlayer("") }}
                style={{ background: `url(${player.image})no-repeat center center/cover` }}
                className={`card`} data-player-position={position.slice(0, 2)}>
            </div>)

            if (counter === 2 || counter === 5 || counter === 9 || counter === 10) {
                temp.push(<div key={position} className="position-row">{arr.map(val => val)}</div>)
                arr = []
            }
            counter++;
        }
        return temp
    }
    return (
        <div className="preview-container">
        <div className="preview-background">
            {rivalTeam ? returnPlayers() : null}
        </div>
        {savedPlayer ? <PlayerCard noSell={true} player={savedPlayer} enableSell={false} sellPlayer={() => { }} /> : null}
    </div>
    )
}
