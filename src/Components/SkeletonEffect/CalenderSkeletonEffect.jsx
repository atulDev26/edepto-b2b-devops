import React from 'react'

const CalenderSkeletonEffect = () => {
    return (
        <div role="status" className="w-full p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            <div className='flex justify-around'>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-10 mb-2.5"></div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-8 mb-2.5"></div>
                <div className="w-10 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className="grid grid-cols-7 gap-4 mt-4">
                {Array.from({ length: 28 }).map((_, index) => (
                    <div key={index} className="w-[55px] bg-gray-200 rounded-full h-[55px] dark:bg-gray-700" style={{ visibility: (index == 0 || index == 1 || index == 26 || index == 27) && "hidden" }} ></div>
                ))}
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default CalenderSkeletonEffect