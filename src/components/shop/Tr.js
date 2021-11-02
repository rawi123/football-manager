import React from 'react'

export default function Tr({player, handelBuy,isBuying}) {
    return (
        <tr className="table-row">
            <td>{player.id}</td>
            <td style={{width:"20vw"}}>{player.name}</td>
            <td>{player.defense}</td>
            <td>{player.gameVision}</td>
            <td>{player.attack}</td>
            <td>{player.goalKeeping?player.goalKeeping:0}</td>
            <td>{player.position}</td>
            <td >{player.price}$</td>
            <td>{player.nationality}</td>
            <td><img src={player.image} alt="player" style={{width:"80px", height:"100px"}}></img></td>
            <td ><i className="cart fas fa-shopping-cart" onClick={()=>!isBuying?handelBuy(player):null}></i></td>
        </tr>
    )
}
