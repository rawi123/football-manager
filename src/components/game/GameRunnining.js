import React from 'react'
import goal from "../../img/goal.png"
import football from "../../img/football.png"
import Result from './Result'
export default function GameRunnining({user,score,stadium,goalClass,leftTop}) {
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
