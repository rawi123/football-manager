import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { playGameFunc, calculateTeamRating, playFinalGame, genTeamLite } from './PlayGame'
import "./style.css"
import stadium from "../../img/stadium2.jpg"
import logo from "../../img/logo2.png"
import boo from "../../soundtrack/boo.m4a"
import cheer from "../../soundtrack/cheer.m4a"
import FinalResults from './FinalResults'
import GameRunnining from './GameRunnining'
import PlayersPreView from './PlayersPreView'
import { putUser } from '../../api'
import { toast, ToastContainer } from 'react-toastify';

export default function Game({ user,onlineRivalName, generateOnlineRival, allUsers, team, formationProp, updateUserCB, players, onlineRival }) {
    const [enable, setEnable] = useState(false);
    const [rivalTeam, setRivalTeam] = useState("");
    const [savedPlayer, setSavedPlayer] = useState("");
    const [genLeft, setGenLeft] = useState(1);
    const [rivalRating, setRivalRating] = useState(0);
    const [gamePlaying, setGamePlaying] = useState("");
    const [interv, setInterv] = useState(0);
    const [rivalName,setRivalName]=useState(onlineRivalName);

    const [score, setScore] = useState({
        rival: 0,
        team: 0
    })
    const [leftTop, setLeftTop] = useState({
        top: "40.5%",
        left: "46.5%"
    })
    const [goalClass, setGoalClass] = useState("no-goal")


    useEffect(() => {
        if (players.length)
            setEnable(true)
    }, [players])



    useEffect(() => {
        let intev = 0
        if (gamePlaying === "playing") {
            let num = Math.floor(Math.random() * 3000 + 1000)
            intev = setInterval(() => {
                num = Math.floor(Math.random() * 3000 + 500);
                setLeftTop({
                    top: Math.floor(Math.random() * 85) + "%",
                    left: Math.floor(Math.random() * 85) + "%"
                })
            }, num);
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
        setRivalName(false)
        setTimeout(() => {
            setEnable(true)
        }, 800);
        const rivalTeam = playGameFunc(team, formationProp, players);
        setRivalTeam(rivalTeam);
        setSavedPlayer("");
        setGenLeft(genLeft + 1);
        setRivalRating(calculateTeamRating(rivalTeam.team, rivalTeam.formation));
    }
    const notifyFail = (text) => toast.error(text, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const generateRival = () => {
        if (Object.keys(onlineRival).length > 0) {
            setRivalTeam({
                formation: onlineRival.formation,
                team: onlineRival.team,
                teamLite: genTeamLite(onlineRival.team)
            })
            setRivalName(onlineRivalName)
            setRivalRating(calculateTeamRating(onlineRival.team, onlineRival.formation));
        }
        else {
            notifyFail("No games ATM!")
        }
    }
    const playGame = () => {
        if (!enable)
            return
        if (user.energy <= 0) {
            notifyFail("Not enough energy!")
            return
        }
        const num = 15000,
            teamRating = calculateTeamRating(team, formationProp);
        let interval1Time = Math.floor((Math.random() * (num - 1500)) + 1500),
            gameScore = { ...score };
        setGamePlaying("playing")
        setGenLeft(1)
        const goalScorrer = setInterval(() => {
            const newScore = playFinalGame(teamRating, rivalRating, gameScore.team, gameScore.rival);
            if (gameScore.rival === newScore.rival) {
                setLeftTop({
                    top: "40.5%",
                    left: "93%"
                })
                new Audio(cheer).play()
            }
            else {
                setLeftTop({
                    top: "40.5%",
                    left: "0"
                })
                new Audio(boo).play()
            }
            gameScore = { ...newScore }
            interval1Time = Math.floor((Math.random() * (num - 1500)) + 1500);
            setScore({ ...newScore });
            setGoalClass("fullBall")
            setTimeout(() => {
                setGoalClass("hidden");
            }, 1000);
        }, interval1Time);
        setTimeout(() => {
            gameEnd(goalScorrer, gameScore);
        }, num);
    }
    const gameEnd = (goalScorrer, gameScore) => {
        setRivalTeam("");
        setGamePlaying("result");
        clearInterval(goalScorrer);
        setGoalClass("no-goal");
        setRivalRating(0);
        updateUserInfo(gameScore);
        setLeftTop({ top: "40.5%", left: "46.5%" })
        generateOnlineRival(allUsers, user)
    }
    const updateUserInfo = async (gameScore) => {
        try {
            let money = 0,
                points = 0;
            if (gameScore.team > gameScore.rival) {
                money = 8000;
                points = 3;
            }
            else if (gameScore.team === gameScore.rival) {
                money = 4000;
                points = 1;
            }
            else {
                money = 1000;
                points = 0;
            }
            const userTemp = { ...user };
            userTemp["money"] = userTemp.money + money;
            userTemp["energy"] -= 10;
            userTemp["points"] = userTemp.points + points;
            userTemp["games"]++;
            userTemp["gamesDate"].push(new Date())
            updateUserCB(userTemp);
            await putUser(user.id, {
                "money": user.money + money,
                energy: userTemp["energy"],
                gamesDate: userTemp["gamesDate"],
                games: userTemp.games,
                points: userTemp.points
            });
        }
        catch {
            notifyFail("Error money not added")
            updateUserCB(user)
        }
    }
    
    if (gamePlaying === "playing") {
        return (
            <GameRunnining rivalName={rivalName} user={user} score={score} stadium={stadium} goalClass={goalClass} leftTop={leftTop} />
        )
    }
    else if (gamePlaying === "result") {
        return (<>
            <ToastContainer />
            <FinalResults rivalName={rivalName} generateRival={generateRival} enable={enable} setGamePlaying={setGamePlaying} setScore={setScore} generateTeam={generateTeam} user={user} score={score} />
        </>
        )
    }
    return (
        <div className="game-container">
            <ToastContainer />
            {rivalTeam ?
                <PlayersPreView setSavedPlayer={setSavedPlayer} rivalTeam={rivalTeam} savedPlayer={savedPlayer} />
                : null}
            <div className={`game-left ${rivalTeam ? "play-game-active" : "row"}`}>
                {rivalTeam ? <>
                    <p>Generate left: {4 - genLeft}</p>
                    {rivalRating ? <p>rating: {rivalRating}</p> : null}
                    <div className="flex">{Array.from({ length: rivalRating / 20 }).map((val, i) => <h4 key={i}>⭐</h4>)}</div>
                    <button className={`game-btn`} onClick={() => enable ? playGame() : null}>
                        play-game
                    </button> </> : <img src={logo} style={{ width: "20rem", height: "14rem", marginTop: "2vw", marginBottom: "2vw" }} alt="my-logo" />}
                {!rivalTeam ? <button className={`game-btn `} onClick={() => enable ? generateRival() : null}>Play Online</button> : null}
                <button className={`game-btn `} onClick={() => enable ? generateTeam() : null}>Generate rival team</button>
            </div>
        </div>
    )
}
