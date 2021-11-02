import React from 'react'

export default function TrainCard({ player, handelUpgradeCB, pos }) {
    return (
        <div className="train-card">
            <p>{player.position}</p>
            <img alt="cactus" src={player.image} height="40%" />
            {player.position === "GK" ?
                <>
                    <h4>Goal keeping <i className="fas fa-plus-square " onClick={() => handelUpgradeCB(player, "goalKeeping", pos, ((player.goalKeeping / 7).toFixed(1)))}></i> <span>{(player.goalKeeping / 7).toFixed(1)}K</span></h4>
                    <div>
                        <p>{player.goalKeeping}</p>
                        <div><div style={{ width: `${player.goalKeeping}%` }}></div></div>
                        <p>99</p>
                    </div>
                </>
                :
                <>
                    <h4>Defense <i className="fas fa-plus-square " onClick={() => handelUpgradeCB(player, "defense", pos, ((player.defense / 9).toFixed(1)))}></i> <span>{(player.defense / 9).toFixed(1)}K</span></h4>
                    <div>
                        <p>{player.defense}</p>

                        <div><div style={{ width: `${player.defense}%` }}></div></div>
                        <p>99</p>
                    </div>
                    <h4>Game vision <i className="fas fa-plus-square " onClick={() => handelUpgradeCB(player, "gameVision", pos, ((player.gameVision / 9).toFixed(1)))}></i> <span>{(player.gameVision / 9).toFixed(1)}K</span></h4>
                    <div>
                        <p>{player.gameVision}</p>
                        <div><div style={{ width: `${player.gameVision}%` }}></div></div>
                        <p>99</p>
                    </div>
                    <h4>Attack <i className="fas fa-plus-square " onClick={() => handelUpgradeCB(player, "attack", pos, ((player.attack / 9).toFixed(1)))}></i> <span>{(player.attack / 9).toFixed(1)}K</span></h4>
                    <div>
                        <p>{player.attack}</p>
                        <div><div style={{ width: `${player.attack}%` }}></div></div>
                        <p>99</p>
                    </div>
                </>}

        </div>
    )
}
