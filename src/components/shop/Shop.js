import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router';
import { Table, Button } from 'react-bootstrap';
import { getTeam, putUserTeam, putUser } from '../../api';
import Tr from './Tr';

export default function Shop({ players, userTeam, userProp, updateUserFather }) {
    const [user, setUser] = useState(userProp);
    const [playerToBuy, setPlayerToBuy] = useState([]);//set players to show after filtering owned players
    const [start, setStart] = useState(10);//show first 10 then +10 each time
    const [cheapToExpensive, setCheapToExpensive] = useState(false);//set filter from top to buttom or otherwise
    const [message, setMessage] = useState("");//error message/success
    const [loggedTeam, setLoggedTeam] = useState({});//logged player team
    const [refresh, setRefresh] = useState(true);//refresh page
    const [isBuying, setIsBuying] = useState(false);//enable/unable buying till the buying finishes
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (Object.keys(user).length !== 0 && players.length) {
            setLoggedTeam(userTeam)
            setAvilablePlayers(userTeam)

        }
        setIsBuying(false)
        setLoading(false)
    }, [refresh, userTeam])

    useEffect(() => {
        setUser(userProp)
    }, [userProp])

    const setAvilablePlayers = (userTeam) => {
        let temp = [...players];
        for (const position in userTeam) {
            userTeam[position].map(({ id }) => {
                temp = temp.filter(player => player.id !== id)
                return 1
            });
        };
        setPlayerToBuy(temp)
    }

    const sortByPrice = (str) => {
        const temp = [...playerToBuy]

        if (str === "name")
            setPlayerToBuy(temp.sort((a, b) => cheapToExpensive ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))

        else
            setPlayerToBuy(temp.sort((a, b) => cheapToExpensive ? a[str] - b[str] : b[str] - a[str]))

        setCheapToExpensive(!cheapToExpensive)
    }

    const buy = async (position, player) => {
        setIsBuying(true)
        const updateMoney = { "money": user.money - player.price }
        const team = { ...loggedTeam };
        const userTemp = { ...user };
        userTemp.money = user.money - player.price;
        team[position] = [...team[position], player]
        await putUserTeam(user.id, { "team": team })
        await putUser(user.id, updateMoney)
        setUser(userTemp);
        setLoggedTeam(team)
        setRefresh(!refresh)
        updateUserFather(userTemp, team)
    }

    const errMsg = (msg) => {
        setMessage(msg)
        setTimeout(() => {
            setMessage("")
        }, 2000);
    }

    const handelBuy = async (player) => {
        if (player.price > user.money) {
            errMsg("not enough money")
            return
        }

        if (player.position === "CB" || player.position === "LB" || player.position === "RB") {

            if (loggedTeam.back.length === 4) { errMsg("Cannot buy any more defensive players") }

            else { buy("back", player) }
            return
        }

        if (player.position === "CM" || player.position === "LM" || player.position === "RM") {

            if (loggedTeam.mid.length === 3) { errMsg("Cannot buy any more mid players") }

            else { buy("mid", player) }
            return
        }

        if (player.position === "ST" || player.position === "LW" || player.position === "RW") {

            if (loggedTeam.front.length === 3) { errMsg("Cannot buy any more attacking players") }

            else { buy("front", player) }
            return
        }

        if (player.position === "GK") {

            if (loggedTeam.GK.length === 1) { errMsg("Cannot buy any more goalkeepers") }

            else { buy("GK", player) }
        }

    }

    if (Object.keys(user).length === 0) {
        return <Redirect to="/login" />
    }

    return (
        <div className="table-container">
            <h3 className={"error-message"}>{message}</h3>
            {loading ? <div className="loader-shop"><h1>Loading Data</h1>
                <div id="loading"></div> </div> : null}
            {isBuying ? <div className="spinner-border loader" role="status">
                <span className="sr-only ">Loading...</span>
            </div> : null}
            <Table striped hover responsive="sm" variant="dark" >
                <thead className="table-row">
                    <tr>
                        <th>#</th>
                        <th className="sort-by" onClick={() => sortByPrice("name")}>Name <i className="fas fa-sort-down"></i></th>
                        <th className="sort-by" onClick={() => sortByPrice("defense")}>Defense <i className="fas fa-sort-down"></i></th>
                        <th className="sort-by" onClick={() => sortByPrice("gameVision")}>Game Vision <i className="fas fa-sort-down"></i></th>
                        <th className="sort-by" onClick={() => sortByPrice("attack")}>Attack <i className="fas fa-sort-down"></i></th>
                        <th>Position</th>
                        <th className="sort-by" onClick={() => sortByPrice("price")}>Price<i className="fas fa-money-bill money-icon"></i><i className="fas fa-sort-down"></i></th>
                        <th>nationality</th>
                        <th>image</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {playerToBuy.slice(0, start).map(val => <Tr key={val.id} isBuying={isBuying} handelBuy={handelBuy} player={val}></Tr>)}
                </tbody>
            </Table>
            {start < players.length ? <Button color="secondary" size="lg" className="seeMoreBtn" onClick={() => setStart(start + 10)}>See More</Button> : null}

        </div>
    )
}
