import React from 'react'

export default function Tr({player, handelBuy}) {
    return (
        <tr className="table-row">
            <td>{player.id}</td>
            <td style={{width:"20vw"}}>{player.name}</td>
            <td>{player.defense}</td>
            <td>{player.gameVision}</td>
            <td>{player.attack}</td>
            <td>{player.position}</td>
            <td >{player.price}$</td>
            <td>{player.nationality}</td>
            <td><img src={player.image} style={{width:"80px", height:"100px"}}></img></td>
            <td ><i className="cart fas fa-shopping-cart" onClick={()=>handelBuy(player)}></i></td>
        </tr>
    )
}
