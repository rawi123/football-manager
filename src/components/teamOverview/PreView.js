import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import "./style.css"
export default function PreView({ user, team }) {
    if (Object.keys(user).length === 0) {
        return <Redirect to="/loing" />
    }
    const returnPlayers = () => {
        let temp = [];
        for (const position in team) {
            temp.push(
                <div className="position-row">
                    {team[position].map(val => {
                        return (<div key={val.id} className={`card ${val.position}`} style={{ background: `url(${val.image})no-repeat center center/cover` }}></div>)
                    })}
                </div>

            )


        }
        return temp
    }
    return (
        <div className="preview-container">
            <div className="preview-background">
                {returnPlayers()}
            </div>
        </div>
    )
}
