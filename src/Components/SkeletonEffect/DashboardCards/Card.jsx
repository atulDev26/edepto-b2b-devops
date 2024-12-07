import React from 'react'

const Card = ({ color }) => {
    return (
        <div className={`w-full p-3 border border-gray-200 rounded-[20px] shadow animate-pulse dark:border-gray-700 bg-[${color}]`}>
            <div className="flex items-center justify-between">
                <div className="h-14 aspect-square bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="mt-3">
                <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-16"></div>
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default Card