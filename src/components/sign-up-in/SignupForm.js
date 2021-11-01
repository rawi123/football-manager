import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { postUser, postTeam } from '../../api';
export default function SignupForm({ users, addUser }) {
	const [input, setInput] = useState({
		name: "",
		username: "",
		password: "",
		confirmPassword: "",
		teamName: ""
	})
	const [message, setMessage] = useState("")
	const [disableInput, setDisableInput] = useState(false)

	const handelInputChange = (e) => {
		const temp = { ...input }
		temp[e.target.name] = e.target.value
		setInput(temp)
		setMessage("")
	}
	let history = useHistory()
	const handelSignUp = async () => {
		if (!input.name || !input.password || !input.username || !input.confirmPassword) {
			setMessage("Please fill in all the fields")
			return
		}
		if (input.password !== input.confirmPassword) {
			setMessage("Passwords does not match")
			return
		}
		// if (input.password.length < 8) {
		// 	setMessage("Passwords must be at least 8 charecters")
		// 	return
		// }
		// if (!/[1-9]/g.test(input.password)) {
		// 	setMessage("Passwords must have at least a number")
		// 	return
		// }
		if (users.some(({ username }) => input.username === username)) {
			setMessage("Username alreday exist")
			return
		}
		setDisableInput(true)
		const userObj = {
			name: input.name,
			money: 100000,
			password: input.password,
			username: input.username,
			teamName: input.teamName
		}
		const temp = (await postUser(userObj)).data
		const obj = {
			team: {
				back: [],
				mid: [],
				front: [],
				GK:[]
			}
		}
		await postTeam(temp.id, obj)
		addUser([...users, temp])
		setDisableInput(false)
		history.push("/")
	}

	return (
		<div className="login-card-form register-form">

			<h4>Team Manager</h4>
			<div className="login-input">
				<input type="text" name="name" placeholder="name" onChange={handelInputChange} />
				<input type="text" name="username" placeholder="username" onChange={handelInputChange} />
				<input type="text" name="teamName" placeholder="team name" onChange={handelInputChange} />
				<input type="password" name="password" placeholder="password" onChange={handelInputChange} />
				<input type="password" name="confirmPassword" placeholder="confirm password" onChange={handelInputChange} />
			</div>
			<input className="submit" type="button" value="register" disabled={disableInput} onClick={handelSignUp} />
			<div>
				Alreday have an account? <Link to="/login" className="register">Sign In</Link>
			</div>
			<h2>{message}</h2>

		</div>
	);
}
