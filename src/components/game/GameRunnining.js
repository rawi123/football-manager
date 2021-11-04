import React, { useState, useEffect } from 'react'
import goal from "../../img/goal.png"
import football from "../../img/football.png"
import Result from './Result'
export default function GameRunnining({ user, score, stadium, goalClass, leftTop }) {

    const [time, setTime] = useState(0)
    useEffect(() => {
        let timeTemp = 0;
        const interv = setInterval(() => {
            timeTemp += 100;
            setTime(timeTemp);
        }, 100);
        setTimeout(() => {
            clearInterval(interv);
        }, 15000);//15000 now but changes with num- this is temporary
    }, [])
    function msToTime(duration) {
        let milliseconds = (duration % 1000) / 100,
            seconds = Math.floor((duration / 1000) % 60);
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return seconds + ":0" + milliseconds;
    }
    return (
        <div className="pitch-result">
            <Result myTeam={user.teamName} myScore={score.team} rivalScore={score.rival} />
            <h1>Game time:15</h1>
            <h1>{msToTime(time)}</h1>
            <div className="pitch" style={{ background: `url(${stadium})no-repeat center center/cover` }}>
                <img src={goal} alt="goal" className={goalClass} />
                <img alt="ball" src={football} className="football" style={{ left: leftTop.left, top: leftTop.top }}></img>
            </div>
        </div>
    )
}
