import React from 'react'
import "./ToggleSwitch.css"

const ToggleSwitch = ({ defaultChecked, toggleId }) => {
    return (
        <>
             <label className="switch">
                <input id={"toggler-" + toggleId} name="toggler-1" type="checkbox" checked={defaultChecked} />
                <span className="slider"></span>
            </label>
        </>
    )
}

export default ToggleSwitch