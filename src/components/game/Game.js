import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { playGameFunc, calculateTeamRating, playFinalGame } from './PlayGame'
import PlayerCard from '../teamOverview/PlayerCard'
import "./style.css"
import stadium from "../../img/stadium2.jpg"
import football from "../../img/football.png"
import goal from "../../img/goal.png"
import logo from "../../img/logo2.png"
import Result from './Result'
export default function Game({ user, team, formationProp, handelUpdate, players }) {
    const [enable, setEnable] = useState(false);
    const [rivalTeam, setRivalTeam] = useState("");
    const [savedPlayer, setSavedPlayer] = useState("");
    const [genLeft, setGenLeft] = useState(1);
    const [rivalRating, setRivalRating] = useState(0);
    const [gamePlaying, setGamePlaying] = useState("");
    const [interv, setInterv] = useState(0)
    const [score, setScore] = useState({
        rival: 0,
        team: 0
    })
    const [leftTop, setLeftTop] = useState({
        top: "40.5%",
        left: "46.5%"
    })
    const [goalClass, setGoalClass] = useState("no-ball")
    useEffect(() => {
        if (players.length)
            setEnable(true)
    }, [players])

    useEffect(() => {
        let intev = 0
        if (gamePlaying === "playing") {
            intev = setInterval(() => {
                setLeftTop({
                    top: Math.floor(Math.random() * 85) + "%",
                    left: Math.floor(Math.random() * 85) + "%"
                })
            }, Math.floor(Math.random() * 3000 + 500));
            setInterv(interv)
        }
        return (() => {
            clearInterval(intev)
        })
        //eslint-disable-next-line
    }, [gamePlaying])

    if (Object.keys(user).length === 0) {
        return <Redirect to="/login" />
    }


    const generateTeam = () => {
        if (!enable || genLeft === 4)
            return
        setEnable(false)
        setTimeout(() => {
            setEnable(true)
        }, 800);
        const rivalTeam = playGameFunc(team, formationProp, players)
        setRivalTeam(rivalTeam);
        setSavedPlayer("")
        setGenLeft(genLeft + 1)
        setRivalRating(calculateTeamRating(rivalTeam.team, rivalTeam.formation))
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
        if (!enable)
            return
        const num = 10000;
        const teamRating = calculateTeamRating(team, formationProp)
        setGamePlaying("playing")
        setRivalRating(0)
        setGenLeft(1)
        const goalScorrer = setInterval(() => {
            const newScore=playFinalGame(teamRating, rivalRating, score.team, score.rival);
            setScore(newScore)
            if(score.rival===newScore.rival){
                setLeftTop({
                    top: "40.5%",
                    left: "0"
                })
            }
            else{
                setLeftTop({
                    top: "40.5%",
                    left: "93%"
                })
            }
            setGoalClass("fullBall")
            setTimeout(() => {
                setGoalClass("hidden")
            }, 1000);

        }, Math.floor(Math.random() * num));
        setTimeout(() => {
            setRivalTeam("")
            setGamePlaying("result")
            clearInterval(goalScorrer);
            setGoalClass("no-ball")
        }, num);

    }
    console.log(goalClass);
    if (gamePlaying === "playing") {
        return (
            <div className="pitch-result">
                <Result myTeam={user.teamName} myScore={score.team} rivalScore={score.rival} />
                <div className="pitch" style={{ background: `url(${stadium})no-repeat center center/cover` }}>
                    <img src={goal} alt="goal" className={goalClass} />
                    <img alt="ball" src={football} className="football" style={{ left: leftTop.left, top: leftTop.top }}></img>
                </div>
            </div>
        )
    }
    else if (gamePlaying === "result") {
        return (
            <div className="result-container pitch-result">
                <Result myTeam={user.teamName} myScore={score.team} rivalScore={score.rival} />
                <button className={`game-btn result-btn `} onClick={() => enable ? (function () {
                    setGamePlaying("");
                    setScore({ team: 0, rival: 0 })
                    generateTeam();
                }()) : null}>Generate rival team</button>
            </div>
        )
    }
    return (

        <div className="game-container">
            {console.log(score)}

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
                    <p>Generate left: {4 - genLeft}</p>
                    {rivalRating ? <p>rating: {rivalRating}</p> : null}
                    <div className="flex">{Array.from({ length: rivalRating / 20 }).map((val, i) => <h4 key={i}>⭐</h4>)}</div>
                    <button className={`game-btn`} onClick={() => enable ? playGame() : null}>
                        play-game
                    </button> </> : <img src={logo} style={{ width: "20rem", height: "14rem", marginTop: "2vw", marginBottom: "2vw" }} alt="my-logo" />}
                <button className={`game-btn `} onClick={() => enable ? generateTeam() : null}>Generate rival team</button>
            </div>
        </div>
    )
}
