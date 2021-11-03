import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postUser, postTeam } from '../../api';
import { Redirect } from 'react-router';
export default function SignupForm({ users, addUser }) {
	const [input, setInput] = useState({
		name: "",
		username: "",
		password: "",
		confirmPassword: "",
		teamName: ""
	});
	const [message, setMessage] = useState("");
	const [disableInput, setDisableInput] = useState(false);
	const [redirect, setRedirect] = useState(false)

	const handelInputChange = (e) => {//controlled input
		const temp = { ...input }
		temp[e.target.name] = e.target.value
		setInput(temp)
		setMessage("")
	}

	const handelSignUp = async () => {//check for avilable fields and create account 
		if (!input.name || !input.password || !input.username || !input.confirmPassword) {
			setMessage("Please fill in all the fields")
			return
		}
		if (input.password !== input.confirmPassword) {
			setMessage("Passwords does not match")
			return
		}
		if (input.password.length < 8) {
			setMessage("Passwords must be at least 8 charecters")
			return
		}
		if (!/[1-9]/g.test(input.password)) {
			setMessage("Passwords must have at least a number")
			return
		}
		if (!/^[a-zA-Z]/.match(input.teamName)
			||/[1-9]/g.match(input.teamName)) {
			setMessage("team name should start with a letter and can't contain numbers")
			return
		}
		if (users.some(({ username }) => input.username === username)) {
			setMessage("Username alreday exist")
			return
		}
		setDisableInput(true)
		const userObj = {
			name: input.name,
			money: 150000,
			password: input.password,
			username: input.username,
			teamName: input.teamName
		}
		const temp = (await postUser(userObj)).data
		const obj = {
			team: {
				front: [
					{
						attack: 30,
						defense: 20,
						gameVision: 20,
						goalKeeping: 0,
						id: "76",
						image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/76.png?raw=true",
						name: "JÉRÉMIE BOGA",
						nationality: "AR",
						position: "LW",
						price: 6500
					},
					{
						attack: 55,
						defense: 20,
						gameVision: 35,
						goalKeeping: 0,
						id: "75",
						image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/75.png?raw=true",
						name: "VINÍCIUS",
						nationality: "DE",
						position: "ST",
						price: 8000
					},
					{
						attack: 40,
						defense: 20,
						gameVision: 12,
						goalKeeping: 0,
						id: "77",
						image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/77.png?raw=true",
						name: "AYOZE PÉREZ",
						nationality: "ES",
						position: "RW",
						price: 2300
					}
				],
				mid: [{
					attack: 30,
					defense: 30,
					gameVision: 20,
					goalKeeping: 0,
					id: "72",
					image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/72.png?raw=true",
					name: "EXEQUIEL PALACIOS",
					nationality: "CO",
					position: "CM",
					price: 2000
				},
				{
					attack: 30,
					defense: 45,
					gameVision: 30,
					goalKeeping: 0,
					id: "73",
					image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/73.png?raw=true",
					name: "FÁBIO MARTINS",
					nationality: "HR",
					position: "LM",
					price: 3500
				},
				{
					attack: 20,
					defense: 30,
					gameVision: 45,
					goalKeeping: 0,
					id: "74",
					image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/74.png?raw=true",
					name: "PABLO PIATTI",
					nationality: "AR",
					position: "RM",
					price: 5000
				}
				],
				back: [
					{
						attack: 30,
						defense: 40,
						gameVision: 25,
						goalKeeping: 0,
						id: "71",
						image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/71.png?raw=true",
						name: "ELSEID HYSAJ",
						nationality: "CO",
						position: "LB",
						price: 5000
					},
					{
						attack: 30,
						defense: 48,
						gameVision: 15,
						goalKeeping: 0,
						id: "68",
						image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/68.png?raw=true",
						name: "MASON HOLGATE",
						nationality: "ES",
						position: "CB",
						price: 5000
					},
					{
						attack: 20,
						defense: 40,
						gameVision: 18,
						goalKeeping: 0,
						id: "70",
						image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/70.png?raw=true",
						name: "VÍCTOR DÍAZ",
						nationality: "BR",
						position: "RB",
						price: 4500
					},
					{
						attack: 20,
						defense: 40,
						gameVision: 20,
						goalKeeping: 0,
						id: "69",
						image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/69.png?raw=true",
						name: "GEORGIY DZHIKIYA",
						nationality: "CO",
						position: "CB",
						price: 4000
					}
				],
				GK: [
					{
						attack: 0,
						defense: 0,
						gameVision: 0,
						goalKeeping: 60,
						id: "67",
						image: "https://github.com/rawi123/football-manager/blob/main/src/img/players/67.png?raw=true",
						name: "CAMILO VARGAS",
						nationality: "CO",
						position: "GK",
						price: 25000
					}
				]
			},
			"formation": {
				"LW": 76,
				"ST": 75,
				"RW": 77,
				"LM": 73,
				"CM": 72,
				"RM": 74,
				"LB": 71,
				"CB1": 68,
				"CB2": 69,
				"RB": 70,
				"GK": 67
			}
		}
		await postTeam(temp.id, obj)
		addUser([...users, temp])
		setDisableInput(false)
		setRedirect(false)
	}
	if (redirect)
		return <Redirect to="/" />
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
