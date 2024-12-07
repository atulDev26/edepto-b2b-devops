import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";

const ResultCompare = ({ calendarData }) => {
    const [series, setSeries] = useState([])
    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'radialBar',
        },
        labels: ['Attempt Rate', 'Accuracy'],
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
                        fontSize: '10px',
                        fontFamily: undefined,
                        fontWeight: 400,
                        color: undefined,
                        offsetY: -6,
                        formatter: function (val) {
                            if (typeof val === "number") {
                                return val?.toFixed(0) + '%'
                            } else {
                                return parseInt(val).toFixed(0) + '%'
                            }
                        }
                    },
                }
            },
        },
        fill: {
            colors: ["#024cc7", "#d94230"]
        },
        stroke: {
            lineCap: 'round'
        },


    });

    function getRadialBar() {
        let attemptRate = 0;
        let accuracy = 0;
        if (calendarData?.daily?.length > 0) {
            for (const item of calendarData?.daily) {
                attemptRate += item?.attemptedRateTest;
                accuracy += item?.accuracyTest;
            }
            setSeries(
                [attemptRate, accuracy]
            );
        } else {
            setSeries(
                [0, 0]
            );
        }
    }

    useEffect(() => {
        if (calendarData) {
            getRadialBar();
        }
    }, [calendarData])

    return (
        <div className='bg-background-color '>
            <p className='w-full text-center p-2 font-medium'>Monthly Accuracy & Attempt Rate</p>
            <Chart options={options} series={series} height={"180px"} type="radialBar" />
        </div>
    )
}

export default ResultCompare