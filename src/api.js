import axios from "axios"
const USERS="https://617ed3fa2ff7e600174bd915.mockapi.io/users"
const Players="https://617ed3fa2ff7e600174bd915.mockapi.io/players"

export function getUsers(){
    return axios.get(USERS)
}
export function postUser(obj){
    return axios.post(USERS,obj)
}
export function getPlayers(){
    return axios.get(Players)
}
export function postPlayer(obj){
    return axios.post(Players,obj)
}