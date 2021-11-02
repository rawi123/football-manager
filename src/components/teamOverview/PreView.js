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
    const [teamLite, setTeamLite] = useState([])//stright array for all players to use - lite
    const [teamFormation, setTeamFormation] = useState({})//team formation
    const [teamFormationCopy, setTeamFormationCopy] = useState({})//keep a safe copy for reset
    const [transform, setTransform] = useState("")//only for clicking on player - animation
    const [enable, setEnable] = useState(false)//enable for save and reset
    const [enableSell, setEnableSell] = useState(true)//enable sell players so not making alot of request at once only after each request finishes
    const [saved, setSaved] = useState({//on player click save this data
        id: "",
        img: "",
        position: "",
        player: ""
    })

    useEffect(() => {//set teams formation and make a team lite on every father render
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

    if (Object.keys(user).length === 0) {//if user not logged in redirect to login
        return <Redirect to="/login" />
    }

    const handelClick = (player, position) => {//click on div if there is no player save his data and give him animation
        //if clicking on empty then set as empty  - the player object will be empty and if he is the second dont do anything
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

    const returnPlayers = () => {//return array of players as divs and add handlers 
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

    const border = (player, position) => {//return border to give player
        return player.position === position || player.position + "1" === position || player.position + "2" === position ? "3px solid green" : "3px solid red";
    }

    const handelSave = async () => {//save formation add to api
        await putFormation(user.id, { "formation": teamFormation })
        setFormation(teamFormation)
    }

    const handelCopy = () => {//reset to the copy
        setFormation(teamFormationCopy)
    }

    const sellPlayer = async (player) => {//get a player and handel selling it for 80% of its price - change in all relevant places- formation team money and send to parent to update
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

    const removePlayerFromTeam = (player) => {//remove player from team in the position that needs tobe changed
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
