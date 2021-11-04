import React, { useEffect, useState } from 'react'
import LeagueTr from "./LeagueTr"
import { Table, } from 'react-bootstrap'
import { getUsers } from '../../api'
export default function League() {
    const [allUsers, setAllUsers] = useState("")
    useEffect(() => {
        (async function (){
            setAllUsers((await getUsers()).data)
        }())
    }, [])

    return (
        <div className="table-container">
            {!allUsers ? <div className="loader-shop"><h1>Loading Data</h1>
                <div id="loading"></div> </div> : null}
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
                    {allUsers ? allUsers.map(val => <LeagueTr key={val.id} user={val}></LeagueTr>) :null}
                </tbody>
                
            </Table>
        </div>
    )
}
