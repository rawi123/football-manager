import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { putFormation } from '../../api'
import { Card, Spinner } from "react-bootstrap"
import "./style.css"
import PlayerCard from './PlayerCard'

export default function PreView({ user, team, formation, setFormation }) {
    const [teamLite, setTeamLite] = useState([])
    const [teamFormation, setTeamFormation] = useState({})
    const [teamFormationCopy, setTeamFormationCopy] = useState({})
    const [transform, setTransform] = useState("")
    const [enable, setEnable] = useState(false)
    const [saved, setSaved] = useState({
        id: "",
        img: "",
        position: "",
        player:""
    })

    useEffect(() => {
        setEnable(false)
        const teamLite = [];
        for (const positionRow in team) {
            team[positionRow].map(val => {
                teamLite.push(val)
            });
        }
        setTeamLite(teamLite)
        setTeamFormation(formation)
        setTeamFormationCopy({ ...formation })
    }, [user, formation])

    if (Object.keys(user).length === 0) {
        return <Redirect to="/login" />
    }

    const handelClick = (player,position) => {
        if (saved.id) {
            const formationTemp = { ...teamFormation }
            formationTemp[position] = parseInt(saved.id);
            formationTemp[saved.position] = parseInt(player.id);
            setTeamFormation(formationTemp)
            setSaved({ id: "", img: "", position: "",player:"" })
            setTransform("")
        }
        else {
            setSaved({ id: player.id, img: player.img, position: position,player:player })
            setTransform("card-up")
        }
    }

    const returnPlayers = () => {
        let temp = [],
            arr = [],
            counter = 0;
        for (const position in teamFormation) {
            const player = (teamLite.find(val => teamFormation[position] === parseInt(val.id)))
            arr.push(<div
                key={position}
                onClick={() => { handelClick(player,position) }}
                style={{
                    border: border(player, position),
                    background: player.image ? `url(${player.image})no-repeat center center/cover` : "white"
                }}
                className={`card ${saved.id === player.id ? transform : null}`} data-player-position={position.slice(0, 2)}>
                </div>)

            if (counter === 2 || counter === 5 || counter === 9 || counter === 10) {
                temp.push(<div key={position} className="position-row">{arr.map(val => val)}</div>)
                arr = []
            }
            counter++;
        }
        if (Object.keys(teamFormation).length > 0 && !enable) {
            setEnable(true)
        }
        return temp
    }

    const border = (player, position) => {
        return player.position === position || player.position + "1" === position || player.position + "2" === position ? "3px solid green" : "3px solid red";
    }

    const handelSave = async () => {
        await putFormation(user.id, { "formation": teamFormation })
        setFormation(teamFormation)
    }

    const handelCopy = () => {
        setFormation(teamFormationCopy)
    }

    return (
        <div className="preview-container">
            <div className="preview-background">
                {returnPlayers()}
                {!enable ? <Spinner className="loader-pre-view" variant="primary" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : null}
                <button className="save-formation" color="primary" onClick={() => enable ? handelSave() : null}>Save</button>{' '}
                <button className="reset-formation" color="primary" onClick={() => enable ? handelCopy() : null}>reset</button>{' '}
            </div>
            {saved.player?<PlayerCard player={saved.player}/>:null}

        </div>
    )
}
