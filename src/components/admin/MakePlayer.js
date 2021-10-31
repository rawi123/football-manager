import React, { useState } from 'react';
import { postPlayer } from '../../api';
export default function MakePlayer() {
    const [input, setInput] = useState({
        name: "",
        defense: "",
        gameVision: "",
        position: "",
        attack: "",
        price: "",
    })
    const [message, setMessage] = useState("refresh to update data")

    const handelChange = (e) => {
        const temp = { ...input }
        temp[e.target.name] = e.target.value
        setInput(temp)
    }

    const handelSignIn = async (e) => {
        e.preventDefault();
        console.log(input.name);
        console.log(123);
        const obj = {
            name: input.name.trim(),
            defense: parseInt(input.defense),
            gameVision: parseInt(input.gameVision),
            position: input.position.trim(),
            attack: parseInt(input.attack),
            price: parseInt(input.price)
        }
        const temp = await postPlayer(obj)
        setInput({
            name: "",
            defense: "",
            gameVision: "",
            position: "",
            attack: "",
            price: "",
        })
        // console.log(temp.data);
    }
    return (
        <div className="login-card-form">
            <h4>Team Manager</h4>
            <form className="login-input" onSubmit={(e)=>handelSignIn(e)}>
                <input type="text" name="name" placeholder="name" value={input.name} onChange={handelChange} />
                <input type="text" name="defense" placeholder="defense" value={input.defense} onChange={handelChange} />
                <input type="text" name="gameVision" placeholder="gameVision" value={input.gameVision} onChange={handelChange} />
                <input type="text" name="position" placeholder="position" value={input.position} onChange={handelChange} />
                <input type="text" name="attack" placeholder="attack" value={input.attack} onChange={handelChange} />
                <input type="text" name="price" placeholder="price" value={input.price} onChange={handelChange} />
            </form>
            <input className="submit" type="submit" value="Login" onClick={handelSignIn} />
            <h2>{message}</h2>
        </div>
    );
}
