import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import TrainCard from './TrainCard'
import "./style.css"
import ContainerBtn from './ContainerBtn'
export default function Train({ team, user }) {
    const [teamState, setTeamState] = useState(team);
    const [view, setView] = useState([]);
    const [enable, setEnable] = useState(false);
    const [money, setMoney] = useState(0);
    const [cost, setCost] = useState(0)
    useEffect(() => {
        setTeamState(team)
        if (!Array.isArray(team))
            setEnable(true)
    }, [team, user]);

    useEffect(() => {
        setMoney(money + cost)
        console.log(money,"useeffect");
        //eslint-disable-next-line
    }, [cost])

    if (Object.keys(user).length === 0) {
        return <Redirect to="/login" />
    };

    const handelUpgrade = (player, str, pos, cost) => {
        console.log(money);
        if (parseFloat(cost) * 1000 + money < parseFloat(user.money)&&teamState[pos][teamState[pos].indexOf(player)][str]<99) {
            console.log(parseFloat(cost)*1000);
            // setMoney(parseFloat(cost) * 1000+money);
            setCost(parseFloat(cost) * 1000)
            const teamTemp = { ...teamState };
            teamTemp[pos][teamTemp[pos].indexOf(player)][str]++;
            setTeamState(teamTemp);
            returnTeam(pos);
        }
    }

    const returnTeam = (pos) => {
        if (!enable)
            return;
        const temp = (team[pos].map(player => {
            return (
                <TrainCard pos={pos} handelUpgradeCB={handelUpgrade} key={player.id} player={player} />
            );
        }))
        setView(temp);
    }


    return (
        <div className="train-container">
            {console.log(money,"money")}
            <div className="money-left">{money} <i className="fas fa-coins"></i></div>
            <div className="triangle"></div>
            <ContainerBtn callBack={returnTeam} />
            <div className="card-container">{view}</div>
            {view.length === 0 ? null : <button>Save</button>}
        </div>
    )
}
