import React, { useState, useRef } from 'react'
import sound1 from "../../soundtrack/sound1.mp3"
import sound2 from "../../soundtrack/sound2.mp3"
import sound3 from "../../soundtrack/sound3.mp3"
export default function Sound() {
    const [play, setPlay] = useState(false)
    const ref1 = useRef();


    return (< >
        <audio ref={ref1} id="sound">
            <source src={sound1} type="audio/mp3" />
            <source src={sound2} type="audio/mp3" />
            <source src={sound3} type="audio/mp3" />
        </audio>
        {play ? <i onClick={() => { ref1.current.pause(); setPlay(!play) }} className="fas fa-volume-up" style={{ color: "rgba(255, 255, 255, 0.65)", marginRight: ".3rem" }}></i>
            : <i onClick={() => { ref1.current.play(); setPlay(!play) }} className="fas fa-volume-mute" style={{ color: "rgba(255, 255, 255, 0.65)", marginRight: ".3rem" }}></i>}
    </>
    )
}
