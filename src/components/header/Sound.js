import React, { useState, useEffect } from 'react'
import sound1 from "../../soundtrack/sound1.mp3"
import sound2 from "../../soundtrack/sound2.mp3"
import sound3 from "../../soundtrack/sound3.mp3"
export default function Sound() {
    const [play, setPlay] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [soundPlaying,setSoundPlaying]=useState(0)

    useEffect(()=>{
        const music=[sound1,sound2,sound3]
        if(play){
            const num=Math.floor(Math.random()*3);
            const audio=new Audio(music[num]);
            setSoundPlaying(audio);
            audio.volume=0.3;
            audio.play();
            audio.addEventListener("ended",()=>{setRefresh(!refresh);});
        }
        else{
            if(soundPlaying)
               soundPlaying.pause()
        }
        //eslint-disable-next-line
    },[play,refresh])

    return (< >
        {play ? <i onClick={() => {  setPlay(!play) }} className="fas fa-volume-up" style={{ color: "rgba(255, 255, 255, 0.65)", marginRight: ".3rem" }}></i>
            : <i onClick={() => {  setPlay(!play) }} className="fas fa-volume-mute" style={{ color: "rgba(255, 255, 255, 0.65)", marginRight: ".3rem" }}></i>}
    </>
    )
}
