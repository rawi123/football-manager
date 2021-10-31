import React, { useState } from 'react';
import { postPlayer,getPlayers,putPlyaerImage } from '../../api';
export default function MakePlayer() {
    const [input, setInput] = useState({
        name: "",
        defense: "",
        gameVision: "",
        position: "",
        attack: "",
        price: "",
        goalKeeping:""
    })
    const [message, setMessage] = useState("refresh to update data")

    const handelChange = (e) => {
        const temp = { ...input }
        temp[e.target.name] = e.target.value
        setInput(temp)
    }

    const handelSignIn = async (e) => {
        e.preventDefault();
        const obj = {
            name: input.name.trim(),
            defense: parseInt(input.defense),
            gameVision: parseInt(input.gameVision),
            position: input.position.trim(),
            attack: parseInt(input.attack),
            price: parseInt(input.price),
            goalKeeping:parseInt(input.goalKeeping),
            image:"https://github.com/rawi123/football-manager/blob/main/src/img/players/.png?raw=true"
        }
        const temp = await postPlayer(obj)
        setInput({
            name: "",
            defense: "",
            gameVision: "",
            position: "",
            attack: "",
            price: "",
            goalKeeping:""
        })
        console.log(temp.data);
        setMessage("success")
    }
    const handelSync=async ()=>{
        (await getPlayers()).data.slice(54)
        .map(async val=>{
            await putPlyaerImage(val)
        })
    }
    return (
        <div className="login-card-form">
            <h4>Team Manager</h4>
            <form className="login-input" onSubmit={(e)=>handelSignIn(e)}>
                <input type="text" name="name" placeholder="name" value={input.name} onChange={handelChange} />
                <input type="text" name="defense" placeholder="defense" value={input.defense} onChange={handelChange} />
                <input type="text" name="attack" placeholder="attack" value={input.attack} onChange={handelChange} />
                <input type="text" name="position" placeholder="position" value={input.position} onChange={handelChange} />
                <input type="text" name="goalKeeping" placeholder="GK" value={input.goalKeeping} onChange={handelChange} />
                <input type="text" name="gameVision" placeholder="gameVision" value={input.gameVision} onChange={handelChange} />
                <input type="text" name="price" placeholder="price" value={input.price} onChange={handelChange} />

            </form>
            <input className="submit" type="submit" value="Login" onClick={handelSignIn} />
            <input className="submit" type="submit" value="SYNC" onClick={handelSync} />
            <h2>{message}</h2>
        </div>
    );
}
