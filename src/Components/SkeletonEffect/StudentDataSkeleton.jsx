import React from 'react'

const StudentDataSkeleton = () => {
    const rows = [1, 2, 3, 4, 5];
    const cols = ["SL No", "Name", "Status", "Mobile No", "ID No", "Email ID", "Batch", "Category"];

    return (
        <div role="status" className="w-full p-4 border border-[#DEE2E6] rounded shadow animate-pulse mt-4 md:p-6 dark:border-gray-700" style={{ height: "450px" }}>
            <div className="overflow-x-auto">
                <table className="w-full  text-sm text-left text-[#DEE2E6] dark:text-[#DEE2E6] " style={{ height: "400px" }}>
                    <thead className="text-xs text-[#DEE2E6] uppercase bg-gray-50 ">
                        <tr>
                            {cols.map((col, index) => (
                                <th key={index} className="px-4 py-2">
                                    <div className="h-2.5 bg-gray-200 rounded-full w-full"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-[#DEE2E6] dark:border-[#DEE2E6]">
                                {cols.map((col, index) => (
                                    <td key={index} className="px-4 py-2">
                                        <div className="h-2.5 bg-[#DEE2E6] rounded-full w-full"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default StudentDataSkeleton