import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router';
import { Table, Button } from 'react-bootstrap';
import { getTeam,putUser } from '../../api';
import Tr from './Tr';
export default function Shop({ user, players }) {
    const [playerToBuy, setPlayerToBuy] = useState([])
    const [start, setStart] = useState(10)
    const [cheapToExpensive, setCheapToExpensive] = useState(false)
    const [message, setMessage] = useState("")
    const [loggedTeam, setLoggedTeam] = useState({});

    useEffect(() => {
        if (Object.keys(user).length !== 0 && players.length) {
            let temp = [...players];
            (async function () {
                const team = (await getTeam(user.id)).data[0].team
                for (const position in team) {
                    team[position].map(({ id }) => {
                        temp = temp.filter(player => player.id !== id)
                    });
                };
                setPlayerToBuy(temp)
                setLoggedTeam(team)
            }());
        }
    }, [players, user])

    if (Object.keys(user).length === 0) {
        return <Redirect to="/login" />
    }
    const sortByPrice = (str) => {
        const temp = [...playerToBuy]

        if (str === "name")
            setPlayerToBuy(temp.sort((a, b) => cheapToExpensive ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))

        else
            setPlayerToBuy(temp.sort((a, b) => cheapToExpensive ? a[str] - b[str] : b[str] - a[str]))

        setCheapToExpensive(!cheapToExpensive)
    }

    const handelBuy = async (player) => {
        // if (player.price > user.money) {
        //     setMessage("not enough money")
        //     setTimeout(() => {
        //         setMessage("")
        //     }, 2000);
        //     return
        // }
        if (player.position === "CB" || player.position === "LB" || player.position === "RB") {
            
            if (loggedTeam.back.length === 4) {
                setMessage("Cannot buy any more defensive players")
                setTimeout(() => {
                    setMessage("")
                }, 2000);
                return
            }
            else{
                console.log("buy");
            }
        }
        if (player.position === "CM" || player.position === "LM" || player.position === "RM") {
            if (loggedTeam.mid.length === 3) {
                setMessage("Cannot buy any more mid players")
                setTimeout(() => {
                    setMessage("")
                }, 2000);
                return
            }
            else{
                console.log("buy");
            }
        }
        if (player.position === "ST" || player.position === "LW" || player.position === "RW") {
            console.log("front");
            if (loggedTeam.front.length === 3) {
                setMessage("Cannot buy any more attacking players")
                setTimeout(() => {
                    setMessage("")
                }, 2000);
                return
            }
            else{

                console.log("buy");
            }
        }

    }

    return (
        <div className="table-container">
            <h3 className={"error-message"}>{message}</h3>
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
                    {playerToBuy.slice(0, start).map(val => <Tr key={val.id} handelBuy={handelBuy} player={val}></Tr>)}
                </tbody>
            </Table>
            {start < 70 ? <Button color="secondary" size="lg" className="seeMoreBtn" onClick={() => setStart(start + 10)}>See More</Button> : null}

        </div>
    )
}
