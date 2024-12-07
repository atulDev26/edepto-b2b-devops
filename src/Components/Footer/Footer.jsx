import React from 'react'

const Footer = () => {
    return (
        <div className='footer-container flex justify-center items-center text-menu-text-color font-normal text-sm'>
            <p>© All rights reserved to Edepto / {(new Date().getFullYear())} </p>
        </div>
    )
}

export default Footer