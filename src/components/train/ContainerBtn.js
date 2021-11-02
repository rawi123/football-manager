import React from 'react'

export default function ContainerBtn({callBack}) {

    return (
        <div className="button-train-container">
            <button onClick={()=>{callBack("GK")}}>GK</button>
            <button onClick={()=>{callBack("back")}}>Back</button>
            <button onClick={()=>{callBack("mid")}}>Mid</button>
            <button onClick={()=>{callBack("front")}}>Front</button>
        </div>
    )
}
