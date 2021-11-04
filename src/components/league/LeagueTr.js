import React from 'react'

export default function TableTr({user,num}) {
    return (
        <tr className="table-row">
            <td>{num+1}</td>
            <td>{user.teamName}</td>
            <td>{user.points}</td>
            <td>{user.games}</td>
        </tr>
    )
}
