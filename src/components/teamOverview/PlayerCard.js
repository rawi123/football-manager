import React from 'react'
import { Card, Button } from 'react-bootstrap'
export default function PlayerCard({noSell, player,sellPlayer,enableSell }) {
    if(!player.id){
        return <></>
    }
    return (
        <Card style={{ width: '18rem' }} className="player-info">
            <Card.Img variant="top" src={player.image} style={{ width: '4rem' }} />
            <Card.Body>
                <Card.Title>{player.name}</Card.Title>
                {player.position === "GK" ?
                    <Card.Text>
                        Goal Keeping: {player.goalKeeping}
                    </Card.Text> :
                    <React.Fragment>
                        <Card.Text>
                            Attack: {player.attack}
                        </Card.Text>
                        <Card.Text>
                            Defense: {player.defense}
                        </Card.Text>
                        <Card.Text>
                            Game Vision: {player.gameVision}
                        </Card.Text>
                    </React.Fragment>
                }
            {!noSell?<Button variant="primary" onClick={()=>enableSell?sellPlayer(player):null}>Sell-{(80/100)*parseInt(player.price)}</Button>:null}
            
            </Card.Body>
            <Card.Footer className="">{player.position}</Card.Footer>
        </Card>
    )
}
