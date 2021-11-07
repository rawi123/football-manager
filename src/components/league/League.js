import React, { useEffect, useState } from 'react'
import LeagueTr from "./LeagueTr"
import { Table, } from 'react-bootstrap'
import { getUsers } from '../../api'
import football from "../../img/football.png"

export default function League({ setUsers }) {
    const [allUsers, setAllUsers] = useState("")
    useEffect(() => {
        (async function () {
            let usersTemp = ((await getUsers()).data);
            usersTemp.sort((a, b) => {
                if (b.points - a.points !== 0)
                    return b.points - a.points
                return a.games - b.games
            })
            setAllUsers(usersTemp);
            setUsers(usersTemp);
        }())
       //eslint-disable-next-line
    }, [])

    return (
        <div className="table-container">
            {!allUsers ? <><img alt="ball" src={football} className="football" style={{ left: "46%", top: "20vh" }}></img><div className="loader-shop"><h1>Loading Data</h1>
                <div id="loading"></div> </div> </> : null}
            <Table striped hover responsive="sm" variant="dark" >
                <thead className="table-row">
                    <tr>
                        <th>#</th>
                        <th>Team Name</th>
                        <th>points</th>
                        <th>Games</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers ? allUsers.map((val,i) => <LeagueTr num={i} key={val.id} user={val}></LeagueTr>) : null}
                </tbody>

            </Table>
        </div>
    )
}
