import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

export default function LoginForm({ user,users, setLoggedUserCB }) {
    const [input, setInput] = useState({
        username: "",
        password: ""
    })
    const [message, setMessage] = useState("")

    const handelChange = (e) => {
        const temp = { ...input }
        temp[e.target.name] = e.target.value
        setInput(temp)
    }

    let history = useHistory()

    const handelSignIn = () => {
        const temp = users.find(({ username, password }) => username === input.username && password === input.password);
        if (temp) {
            setLoggedUserCB(temp);
            sessionStorage.setItem("user", JSON.stringify(temp))
            history.push('/');
        } else setMessage('Wrong username/password');
    }

    if (Object.keys(user).length!==0){
        history.push("/")
        return <React.Fragment/>
    }
    
    return (
        <div className="login-card-form">
            <h4>Team Manager</h4>
            <div className="login-input">
                <input type="text" name="username" placeholder="username" onChange={handelChange} />
                <input type="password" name="password" placeholder="password" onChange={handelChange} />
            </div>
            <input className="submit" type="button" value="Login" onClick={handelSignIn} />
            <div>
                Dont have an account? <Link to="/signup" className="register">Sign Up</Link>
            </div>
            <h2>{message}</h2>
        </div>
    );
}
