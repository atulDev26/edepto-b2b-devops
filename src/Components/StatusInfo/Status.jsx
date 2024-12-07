import React from 'react'

const Status = ({status}) => {
    return (
        <div className={`w-[73px] ${status==="Active" ? "bg-primary-blue": "bg-primary-red"}  rounded-xl`}>
            <p className='text-center text-white-color font-semibold'>{status}</p>
        </div>
    )
}

export default Status