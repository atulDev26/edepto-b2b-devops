import React, { useEffect, useState } from 'react'

const AllAccessToggle = ({ defaultChecked, toggleId,handleFunctionState }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);

    useEffect(() => {
        if (isChecked) {
            handleFunctionState(true);
        } else {
            handleFunctionState(false);
        }
    }, [isChecked, handleFunctionState]);


    const handleToggleChange = () => {
        setIsChecked(!isChecked);

    }
    return (
        <>
            <div className="cl-toggle-switch">
                <label className="cl-switch">
                    <input id={"toggler-" + toggleId} type="checkbox" checked={isChecked} onChange={handleToggleChange}/>
                        <span></span>
                </label>
            </div>
        </>
    )
}

export default AllAccessToggle