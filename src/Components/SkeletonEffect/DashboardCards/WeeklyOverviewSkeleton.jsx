import React from 'react'

const WeeklyOverviewSkeleton = () => {
    return (
        <div role="status" className="w-full p-4 border border-[#DEE2E6] rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            <div className="h-2.5 bg-[#DEE2E6] rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
            <div className="w-48 h-2 mb-10 bg-[#DEE2E6] rounded-full dark:bg-gray-700"></div>
            <div className="flex items-baseline mt-4">
                <div className="w-full bg-[#DEE2E6] rounded-t-lg h-72 dark:bg-gray-700"></div>
                <div className="w-full h-56 ms-6 bg-[#DEE2E6] rounded-t-lg dark:bg-gray-700"></div>
                <div className="w-full bg-[#DEE2E6] rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
                <div className="w-full h-64 ms-6 bg-[#DEE2E6] rounded-t-lg dark:bg-gray-700"></div>
                <div className="w-full bg-[#DEE2E6] rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
                <div className="w-full bg-[#DEE2E6] rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
                <div className="w-full bg-[#DEE2E6] rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default WeeklyOverviewSkeleton