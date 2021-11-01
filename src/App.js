import FormStructure from "./components/sign-up-in/FormStructure";
import LoginForm from "./components/sign-up-in/LoginForm";
import SignupForm from "./components/sign-up-in/SignupForm";
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { getUsers, getPlayers } from "./api"
import MakePlayer from "./components/admin/MakePlayer";
import Home from "./components/home/Home";
import NavBar from "./components/header/Nav";
import "bootstrap/dist/css/bootstrap.css"
import Shop from "./components/shop/Shop";
function App() {
  const [loggedUser, setLoggedUser] = useState(JSON.parse(sessionStorage.getItem("user")) || {});
  const [users, setUsers] = useState([])
  const [players, setPlayers] = useState([])
  const [team,setTeam]=useState([])

  useEffect(() => {
    (async function () {
      setUsers((await getUsers()).data)
      setPlayers((await getPlayers()).data)
    }())
  }, [])


  const updateBuy=(user,team)=>{
    setLoggedUser(user)  
    setTeam(team)
    sessionStorage.setItem("user",JSON.stringify(user))
  }

  return (
    <div className="content-container">
      <BrowserRouter>
        <NavBar user={loggedUser} setLoggedUser={setLoggedUser} />
        <Switch>
          <Route path="/login">
            <FormStructure Children={<LoginForm user={loggedUser} users={users} setLoggedUserCB={setLoggedUser} />} />
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
            <Shop userProp={loggedUser} players={players} updateUserFather={updateBuy} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>

  );
}

export default App;
