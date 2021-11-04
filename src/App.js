import FormStructure from "./components/sign-up-in/FormStructure";
import LoginForm from "./components/sign-up-in/LoginForm";
import SignupForm from "./components/sign-up-in/SignupForm";
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { getUsers, getPlayers, getTeam, putUser } from "./api"
import MakePlayer from "./components/admin/MakePlayer";
import Home from "./components/home/Home";
import NavBar from "./components/header/Nav";
import "bootstrap/dist/css/bootstrap.css"
import Shop from "./components/shop/Shop";
import PreView from "./components/teamOverview/PreView";
import Train from "./components/train/Train";
import Game from "./components/game/Game";
import League from "./components/league/League";

function App() {
  const [loggedUser, setLoggedUser] = useState(JSON.parse(sessionStorage.getItem("user")) || {});//logged user
  const [users, setUsers] = useState([])//all users
  const [players, setPlayers] = useState([])//all avilable players
  const [team, setTeam] = useState([])//player team
  const [formation, setFormation] = useState([])//user team
  const [onlineRival, setOnlineRival] = useState(JSON.parse(sessionStorage.getItem("rival")) || {})
  useEffect(() => {//on mount fetch data and set in states
    (async function () {
      const allUsersTemp = (await getUsers()).data
      setUsers(allUsersTemp)
      setPlayers((await getPlayers()).data)
      if (Object.keys(loggedUser).length !== 0) {
        const team = (await getTeam(loggedUser.id)).data[0]
        setTeam(team.team)
        setFormation(team.formation)
        if (!JSON.parse(sessionStorage.getItem("rival")))
          generateOnlineRival(allUsersTemp, loggedUser)
      }
    }())
    //eslint-disable-next-line
  }, [])


  const generateOnlineRival = async (allUsers, userTemp) => {
    if (allUsers.length > 1) {
      let num = Math.floor(Math.random() * (allUsers.length))+1;
      while (parseInt(num) === parseInt(userTemp.id)) {
        console.log(num,"123");
        num = Math.floor(Math.random() * (allUsers.length))+1;
      }
      const rival = (await getTeam(num)).data[0]
      setOnlineRival(rival)
      sessionStorage.setItem("rival", JSON.stringify(rival))
    }
  }

  const handelSignIn = async (user) => {//sign in user 
    const userTemp = { ...user }
    user.gamesDate.map(val => {//add energy if 3 hours pased
      if (parseInt((new Date() - new Date(val)) / 1000 / 60 / 60) >= 3) {
        userTemp.gamesDate.splice(userTemp.gamesDate.indexOf(val), 1);
        userTemp["energy"] += 10;
      };
      return 1;
    })
    if (user.energy !== userTemp.energy) {//update user if something changed
      await putUser(userTemp.id, userTemp)
    }
    setLoggedUser(userTemp)
    sessionStorage.setItem("user", JSON.stringify(userTemp))
    const team = (await getTeam(userTemp.id)).data[0]
    setTeam(team.team)
    setFormation(team.formation)
    if (!JSON.parse(sessionStorage.getItem("rival")))
      generateOnlineRival(users, userTemp)
  }


  const update = (user, team, formation) => {//name update buy but it is  update after sell or buy update user team and formation
    //in addition just updates user team formation
    setLoggedUser(user);
    setTeam(team);
    setFormation(formation);
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  const updateUser = (user) => {//update the user
    setLoggedUser(user);
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  return (
    <div className="content-container">
      <BrowserRouter>
        <NavBar user={loggedUser} setLoggedUser={setLoggedUser} />
        <Switch>
          <Route path="/login">
            <FormStructure Children={<LoginForm user={loggedUser} users={users} setLoggedUserCB={handelSignIn} />} />
          </Route>
          <Route path="/signup">
            <FormStructure Children={<SignupForm user={loggedUser} users={users} addUser={setUsers} />} />
          </Route>
          <Route path="/admin-make-player">
            {loggedUser.isAdmin ? <FormStructure Children={<MakePlayer user={loggedUser} />} /> : null}
          </Route>
          <Route exact path="/">
            <Home players={players} ></Home>
          </Route>
          <Route exact path="/shop">
            <Shop formation={formation} userTeam={team} userProp={loggedUser} players={players} updateUserFather={update} />
          </Route>
          <Route exact path="/preview">
            <PreView user={loggedUser} updateBuy={update} setFormation={setFormation} team={team} formation={formation} />
          </Route>
          <Route exact path="/train">
            <Train user={loggedUser} handelUpgradeCB={update} formationProp={formation} team={team} />
          </Route>
          <Route exact path="/game">
            <Game onlineRival={onlineRival} user={loggedUser} players={players} updateUserCB={updateUser} formationProp={formation} team={team} />
          </Route>
          <Route exact path="/leagueTable">
            <League/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>

  );
}

export default App;
