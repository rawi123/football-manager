import React from 'react'

export default function Result({myTeam,myScore,rivalScore}) {
    return (
        <div className="results">
            {myTeam} {myScore} - {rivalScore} rival team
        </div>
    )
}
