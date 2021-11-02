import FormStructure from "./components/sign-up-in/FormStructure";
import LoginForm from "./components/sign-up-in/LoginForm";
import SignupForm from "./components/sign-up-in/SignupForm";
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { getUsers, getPlayers, getTeam } from "./api"
import MakePlayer from "./components/admin/MakePlayer";
import Home from "./components/home/Home";
import NavBar from "./components/header/Nav";
import "bootstrap/dist/css/bootstrap.css"
import Shop from "./components/shop/Shop";
import PreView from "./components/teamOverview/PreView";
import Train from "./components/train/Train";


function App() {
  const [loggedUser, setLoggedUser] = useState(JSON.parse(sessionStorage.getItem("user")) || {});
  const [users, setUsers] = useState([])
  const [players, setPlayers] = useState([])
  const [team, setTeam] = useState([])
  const [formation,setFormation]=useState([])

  useEffect(() => {
    (async function () {
      setUsers((await getUsers()).data)
      setPlayers((await getPlayers()).data)
      if(Object.keys(loggedUser).length!==0){
        const team = (await getTeam(loggedUser.id)).data[0]
        setTeam(team.team)
        setFormation(team.formation)
      }
    }())
  }, [])


  const handelSignIn = async (user) => {
    setLoggedUser(user)
    sessionStorage.setItem("user", JSON.stringify(user))
    const team = (await getTeam(user.id)).data[0]
    setTeam(team.team)
    setFormation(team.formation)
  }


  const updateBuy = (user, team,formation) => {
    setLoggedUser(user);
    setTeam(team);
    setFormation(formation);
    sessionStorage.setItem("user", JSON.stringify(user))
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
            <Shop formation={formation} userTeam={team} userProp={loggedUser} players={players} updateUserFather={updateBuy} />
          </Route>
          <Route exact path="/preview">
            <PreView user={loggedUser} setFormation={setFormation} team={team} formation={formation}/>
          </Route>
          <Route exact path="/train">
            <Train user={loggedUser}  formationProp={formation} team={team}/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>

  );
}

export default App;
