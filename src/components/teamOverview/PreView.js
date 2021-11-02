import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { putFormation } from '../../api'
import { Spinner } from "react-bootstrap"
import { putUser, putUserTeam } from '../../api'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import "./style.css"
import PlayerCard from './PlayerCard'
export default function PreView({ user, team, formation, setFormation, updateBuy }) {
    const [teamLite, setTeamLite] = useState([])
    const [teamFormation, setTeamFormation] = useState({})
    const [teamFormationCopy, setTeamFormationCopy] = useState({})
    const [transform, setTransform] = useState("")
    const [enable, setEnable] = useState(false)
    const [enableSell, setEnableSell] = useState(true)
    const [saved, setSaved] = useState({
        id: "",
        img: "",
        position: "",
        player: ""
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

    const notify = (name) => toast.success(name, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    const notifyWait = (name) => toast.info(name, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
    });
    const notifyFail = () => toast.error(" Could not complete sale", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    if (Object.keys(user).length === 0) {
        return <Redirect to="/login" />
    }

    const handelClick = (player, position) => {
        if (saved.id) {
            if (player.id) {
                const formationTemp = { ...teamFormation }
                formationTemp[position] = parseInt(saved.id);
                formationTemp[saved.position] = parseInt(player.id);
                setTeamFormation(formationTemp)
                setSaved({ id: "", img: "", position: "", player: "" })
                setTransform("")
            }
        }
        else {
            setSaved({ id: player.id, img: player.img, position: position, player: player })
            setTransform("card-up")
        }
    }

    const returnPlayers = () => {
        let temp = [],
            arr = [],
            counter = 0;
        for (const position in teamFormation) {
            const player = (teamLite.find(val => teamFormation[position] === parseInt(val.id))) || {}
            arr.push(<div
                key={position}
                onClick={() => player.image ? handelClick(player, position) : ""}
                style={{
                    border: border(player, position),
                    background: player.image ? `url(${player.image})no-repeat center center/cover` :
                        "url(https://github.com/rawi123/football-manager/blob/main/src/img/players/fifa%20card.png?raw=true)no-repeat center center/cover"
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

    const sellPlayer = async (player) => {
        setEnableSell(false);
        try {
            notifyWait("pending");
            const teamFormationTemp = { ...teamFormation },
                team = removePlayerFromTeam(player),
                userTemp = { ...user },
                updateMoney = { "money": userTemp.money + ((80 / 100) * parseInt(player.price)) };
            userTemp.money = userTemp.money + ((80 / 100) * parseInt(player.price));
            teamFormationTemp[saved.position] = "";
            setSaved({ id: "", img: "", position: "", player: "" });
            await putFormation(user.id, { "formation": teamFormation });
            await putUser(user.id, updateMoney)
            await putUserTeam(user.id, { "team": team })
            setTeamFormation({ ...teamFormationTemp });
            setTeamFormationCopy({ ...teamFormationTemp });
            updateBuy(userTemp, team, teamFormationTemp);
            notify(player.name + " Sold Successfully");
        }
        catch {
            notifyFail();
        }
        setEnableSell(true)
    }

    const removePlayerFromTeam = (player) => {
        let teamTemp = { ...team }
        if (player.position === "GK") {
            teamTemp.GK = teamTemp.GK.slice(0, 0);
        }
        else if (player.position === "CB" || player.position === "LB" || player.position === "RB") {
            teamTemp["back"].splice(teamTemp["back"].indexOf(player), 1);
        }
        else if (player.position === "CM" || player.position === "LM" || player.position === "RM") {
            teamTemp["mid"].splice(teamTemp["mid"].indexOf(player), 1);
        }
        else if (player.position === "ST" || player.position === "LW" || player.position === "RW") {
            teamTemp["front"].splice(teamTemp["front"].indexOf(player), 1);
        }
        return teamTemp
    }

    return (
        <div className="preview-container">
            <ToastContainer />
            <div className="preview-background">
                {returnPlayers()}
                {!enable ? <Spinner className="loader-pre-view" variant="primary" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : null}
                <button className="save-formation" color="primary" onClick={() => enable ? handelSave() : null}>Save</button>
                <button className="reset-formation" color="primary" onClick={() => enable ? handelCopy() : null}>reset</button>
            </div>
            {saved.player ? <PlayerCard player={saved.player} enableSell={enableSell} sellPlayer={sellPlayer} /> : null}

        </div>
    )
}
