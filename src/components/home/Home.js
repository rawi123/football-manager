import React from 'react'

export default function Home({players}) {
    return (
        <div>asdas
            {players.map(val=>{
                console.log(val.image);
                return (<div key={val.id}>
                    {val.name}
                    < img src={val.image} alt={val.name}></img>
                </div>)
            })}
        </div>
    )
}
