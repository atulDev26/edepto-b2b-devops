import React, { useEffect, useState } from 'react'
import ResultCompare from './ResultCompare'
import Chart from "react-apexcharts";

const StrengthWeakness = ({ calendarData }) => {
    const [series, setSeries] = useState([0, 0, 0]);
    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'radialBar',
        },
        labels: ['Test Question Correct', 'Test Question Incorrect', 'Test Question Attempted'],
        plotOptions: {
            radialBar: {
                track: {
                    background: '#DDE6F2',
                },
                dataLabels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: '10px',
                        fontFamily: undefined,
                        fontWeight: 400,
                        color: undefined,
                        offsetY: -15
                    },
                    value: {
                        show: true,
                        fontSize: '12px',
                        fontFamily: undefined,
                        fontWeight: 400,
                        color: undefined,
                        offsetY: 0,
                        formatter: function (val) {
                            if (typeof val === "number") {
                                return val?.toFixed(0) + '%'
                            } else {
                                return parseInt(val) + '%'
                            }
                        }
                    },
                }
            },
        },
        fill: {
            colors: ["#024cc7", "#d94230", "#FF7F11"]
        },
        stroke: {
            lineCap: 'round'
        },
    })

    useEffect(() => {
        if (calendarData) {
            setSeries([calendarData?.tQuestionCorrect ?? 0, calendarData?.tQuestionIncorrect ?? 0, calendarData?.tQuestionAttempted ?? 0])
        }
    }, [calendarData])

    return (
        <div className='bg-white-color shadow-xl rounded-xl mb-3 p-2'>
            <p className='font-semibold text-base mb-2'>Strength Weakness</p>

            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-2 p-3'>
                <div className='bg-[#FFF1E5] flex gap-2 p-2 rounded-xl'>
                    <img src={process.env.PUBLIC_URL + "/Assets/Images/StudentProfile/testAttempt.svg"} className='' alt="" />
                    <div className=''>
                        <p className='font-normal text-sm min-w-fit'>Test Attempt</p>
                        <p className='font-extrabold text-sm '>{calendarData?.tTestAttempted}</p>
                    </div>
                </div>
                <div className='bg-[#EAE7FF] flex gap-2 p-2 rounded-xl'>
                    <img src={process.env.PUBLIC_URL + "/Assets/Images/StudentProfile/liveTest.svg"} className='' alt="" />
                    <div className=''>
                        <p className='font-normal text-sm break-words'>Live Test</p>
                        <p className='font-extrabold text-sm '>(Coming Soon)</p>
                    </div>
                </div>
                <div className='bg-[#F9FFEC] flex gap-2 p-2 rounded-xl'>
                    <img src={process.env.PUBLIC_URL + "/Assets/Images/StudentProfile/currentAffairs.svg"} className='' alt="" />
                    <div className=''>
                        <p className='font-normal text-sm break-words'>Current Affairs</p>
                        <p className='font-extrabold text-sm '>(Coming Soon)</p>
                    </div>
                </div>
            </div>
            <ResultCompare calendarData={calendarData} />
            <div className=''>
                <p className='w-full text-center p-2 font-medium'>Monthly Question Data</p>
                <p className='font-semibold text-sm text-[#FF7F11] w-full text-center'>(Test Question Correct,Test Question Incorrect,Test Question Attempted)</p>
                <Chart options={options} series={series} height={"250px"} type="radialBar" />
            </div>
        </div>
    )
}

export default StrengthWeakness