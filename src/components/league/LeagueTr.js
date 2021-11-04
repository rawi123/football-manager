import React from 'react'

export default function TableTr({user}) {
    return (
        <tr className="table-row">
            <td>{user.id}</td>
            <td>{user.teamName}</td>
            <td>{user.points}</td>
            <td>{user.games}</td>
        </tr>
    )
}
