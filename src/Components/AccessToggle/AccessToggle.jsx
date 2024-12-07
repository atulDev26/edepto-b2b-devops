import React, { useState } from 'react'
import "./AccessToggle.css"

const AccessToggle = ({ defaultChecked, toggleId }) => {

    return (
        <>
            <label className="switch">
                <input id={"toggler-" + toggleId} name="toggler-1" type="checkbox" checked={defaultChecked} />
                <span className="slider"></span>
            </label>
        </>
    )
}

export default AccessToggle