import React from 'react'

export default function Result({rivalName,myTeam,myScore,rivalScore}) {
    return (
        <div className="results">
            {myTeam} {myScore} - {rivalScore} {rivalName?rivalName:"rival team"}
        </div>
    )
}
