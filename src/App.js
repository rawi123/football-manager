import FormStructure from "./components/sign-up-in/FormStructure";
import LoginForm from "./components/sign-up-in/LoginForm";
import SignupForm from "./components/sign-up-in/SignupForm";
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React,{useState,useEffect} from 'react';
import {getUsers} from "./api"
import MakePlayer from "./components/admin/MakePlayer";
function App() {
  const [loggedUser,setLoggedUser]=useState(JSON.parse(sessionStorage.getItem("user"))||"");
  const [users,setUsers]=useState([])

  useEffect(() => {
    (async function(){
      setUsers((await getUsers()).data)
    }())
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <FormStructure Children={<LoginForm user={loggedUser} users={users} setLoggedUserCB={setLoggedUser}/>} />
        </Route>
        <Route path="/signup">
          <FormStructure Children={<SignupForm user={loggedUser} users={users} addUser={setUsers}/>} />
        </Route>
        <Route path="/admin-make-player">
          {loggedUser.isAdmin?<FormStructure Children={<MakePlayer user={loggedUser}/>} />:null}
        </Route>
        <Route exact path="/">
            <Home></Home>
        </Route>
      </Switch>
    </BrowserRouter>

  );
}

export default App;
