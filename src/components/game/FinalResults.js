import React, { useState, useEffect } from 'react'
import Result from './Result';
import logo from "../../img/logo2.png"

export default function FinalResults({ rivalName,setGamePlaying, setScore, generateRival, generateTeam, user, score, enable }) {
    const [localScore, setLocalScore] = useState(score)
    useEffect(() => {
        setLocalScore(score)
    }, [score])
    return (
        <div className="result-container pitch-result">
            <img src={logo} style={{ width: "20rem", height: "14rem", marginTop: "2vw", marginBottom: "2vw" }} alt="my-logo" />
            <Result rivalName={rivalName} myTeam={user.teamName} myScore={localScore.team} rivalScore={localScore.rival} />
            <button className={`game-btn `} onClick={() => enable ? (function () {
                setGamePlaying("");
                generateRival();
                setScore({ team: 0, rival: 0 })
            }()) : null}>Play Online</button>
            <button className={`game-btn result-btn `} onClick={() => enable ? (function () {
                setGamePlaying("");
                setScore({ team: 0, rival: 0 })
                generateTeam();
            }()) : null}>Generate rival team</button>
        </div>
    )
}
