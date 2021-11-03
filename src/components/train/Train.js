import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { putUserTeam, putUser } from '../../api'
import TrainCard from './TrainCard'
import ContainerBtn from './ContainerBtn'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css"
export default function Train({ team, user, handelUpgradeCB, formationProp }) {
    const [teamState, setTeamState] = useState(team);
    const [position, setPosition] = useState("back")
    const [enable, setEnable] = useState(false);
    const [money, setMoney] = useState(0);

    useEffect(() => {//set team with every parent update
        setTeamState(team)
        if (!Array.isArray(team))
            setEnable(true)
    }, [team, user]);


    if (Object.keys(user).length === 0) {//redirect if no logged in
        return <Redirect to="/login" />
    };

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
    const notifyFail = () => toast.error(" Could not complete Update", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const handelUpgrade = (player, str, pos, cost) => {//update only in this component how much the price will be and save the new prices of players and their power
        if (parseFloat(cost) * 1000 + money < parseFloat(user.money) && teamState[pos][teamState[pos].indexOf(player)][str] < 99) {
            setMoney(parseFloat(cost) * 1000 + money);
            const teamTemp = { ...teamState };
            teamTemp[pos][teamTemp[pos].indexOf(player)][str]++;
            teamTemp[pos][teamTemp[pos].indexOf(player)]["price"]+=(cost*100);
            setTeamState(teamTemp);
            returnTeam(pos);
        }
    }

    const returnTeam = (pos) => {// set pos as the pos from the button to display team[back/front]... and enable clicks
        if (!enable)
            return;
        setPosition(pos)
    }

    const handelSave = async () => {//update api and parent after clicking save
        notifyWait("Pending...")
        try {
            setEnable(false);
            const num=Math.floor(Math.random()*500)
            const userTemp = { ...user }
            userTemp.money = userTemp.money - money;
            if(num===250){userTemp.money = userTemp.money +10000;};
            await putUser(user.id, { "money": userTemp.money })
            await putUserTeam(user.id, { "team": teamState })
            handelUpgradeCB(userTemp, teamState, formationProp);
            setMoney(0)
            notify("Update Successfull")
            if(num===500){notify("Congrats you just won 10k coins!");};
        }
        catch {
            notifyFail()
        }
    }

    return (
        <div className="train-container">
            <ToastContainer />
            <div className="money-left">{money} <i className="fas fa-coins"></i></div>
            <div className="triangle"></div>
            <ContainerBtn callBack={returnTeam} />
            <div className="card-container">
                {
                    team[position] ? team[position].map(player => {
                        return (
                            <TrainCard pos={position} handelUpgradeCB={handelUpgrade} key={player.id} player={player} />
                        );
                    }) : null
                }
            </div>
            <div>
            <button onClick={handelSave}>Purchase</button>
            <button onClick={handelSave}>Purchase</button>
            </div>
        </div>
    )
}
