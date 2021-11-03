import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { playGameFunc } from './PlayGame'
import PlayerCard from '../teamOverview/PlayerCard'
import "./style.css"
import logo from "../../img/logo2.png"
export default function Game({ user, team, formationProp, handelUpdate, players }) {
    const [enable, setEnable] = useState(true)
    const [rivalTeam, setRivalTeam] = useState("")
    const [savedPlayer, setSavedPlayer] = useState("")
    const [genLeft,setGenLeft]=useState(1)
    if (Object.keys(user).length === 0) {
        return <Redirect to="/login" />
    }

    const generateTeam = () => {
        if (!enable || genLeft===4)
            return
        const rivalTeam = playGameFunc(team, formationProp, players)
        setRivalTeam(rivalTeam);
        setSavedPlayer("")
        setGenLeft(genLeft+1)
    }
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

    const playGame = () => {
        console.log("play game");
    }

    return (

        <div className="game-container">
            {rivalTeam ?
                <div className="preview-container">
                    <div className="preview-background">
                        {rivalTeam ? returnPlayers() : null}
                    </div>
                    {savedPlayer ? <PlayerCard noSell={true} player={savedPlayer} enableSell={false} sellPlayer={() => { }} /> : null}
                </div>
                : null}

            <div className={`game-left ${rivalTeam ? "play-game-active" : "row"}`}>
                {rivalTeam ? <>
                    <p>Generate left: {4-genLeft}</p>
                    <button className={`game-btn`} onClick={() => enable ? playGame() : null}>
                        play-game
                    </button> </> : <img src={logo} style={{ width: "18vw", height: "24vh", marginTop: "2vw", marginBottom: "2vw" }} alt="my-logo" />}
                <button className={`game-btn `} onClick={() => enable ? generateTeam() : null}>Generate rival team</button>

            </div>

        </div>
    )
}
