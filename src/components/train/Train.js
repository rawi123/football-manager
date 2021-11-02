import React, { useState } from 'react'
import { Card, CardGroup } from 'react-bootstrap'
import { Redirect } from 'react-router'
export default function Train({ team, user }) {
    if (Object.keys(user).length === 0) {
        return <Redirect to="/login" />
    }
    // const returnTeam = () => {
    //     for (const position in team) {
    //         temp.push(
    //             <div className="position-row" data-position={position}>
    //                 {team[position].map((val, i) => {
    //                     return (<div key={val.id} className="card" data-player-position={returnPosition(i)} style={{ background: `url(${val.image})no-repeat center center/cover` }}></div>)
    //                 })}
    //             </div>
    //         )
    //     }
    // }
    return (
        <CardGroup>
            <Card>
                <Card.Img variant="top"  />
                <Card.Body>
                    <Card.Title>Card title</Card.Title>
                    <Card.Text>
                    </Card.Text>
                </Card.Body>
            </Card>
        </CardGroup>
    )
}
