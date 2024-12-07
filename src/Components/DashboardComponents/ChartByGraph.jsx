import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";

const ChartByGraph = ({ data }) => {
    const [series, setSeries] = useState([{
        name: 'Active Student',
        type: 'column',
        data: [0]
    },
    //  {
    //     name: 'Enrolled Tests',
    //     type: 'line',
    //     data: [0]
    // },
    {
        name: 'Enrolled Tests',
        type: 'column',
        data: [0]
    }
    ],
    )
    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
            toolbar: { show: false },
        },

        plotOptions: {
            bar: {
                borderRadius: 5,
                columnWidth: '10',
                barPadding: 20,
            },
            line: {
                markers: {
                    size: 8,
                    style: 'circle'
                }
            }
        },
        stroke: {
            color: ["transparent"],
            width: 1
        },
        colors: ['#D94230', '#024CC7'],

        // title: {
        //     text: 'Chart By',
        // },
        dataLabels: {
            enabled: true,
            enabledOnSeries: [1]
        },
        grid: {
            borderColor: '#f2f2f2',
            row: {
                opacity: 0.5
            },
            column: {
                opacity: 0.5
            },
            xaxis: {
                lines: {
                    show: true,
                    borderColor: '#000000',
                    strokeDashArray: 2,

                }
            },
            yaxis: {
                lines: {
                    show: true,
                    borderColor: '#000000',
                    strokeDashArray: 2,
                }
            }
        },
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        xaxis: {
            type: 'category'
        },
        legend: {
            show: true,
            position: 'top',
            floating: false,
            fontSize: '12px',
            horizontalAlign: 'right',
            customLegendItems: [],
            labels: {
                colors: '#6B6B6B',
                useSeriesColors: false,
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 5,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (y) {
                    if (typeof y !== "undefined") {
                        return y.toFixed(0);
                    }
                    return y;
                }
            }
        }
    },
    );
    function getShortWeekNames(weekNames) {
        return weekNames?.map(name => name?.slice(0, 3));
    }


    function chartByData() {
        let tempActiveStudentsCount = [];
        let tempEnrolledTestsCount = [];
        let date = [];

        if (data?.length > 0) {
            for (const item of data) {
                tempActiveStudentsCount.push(item?.activeStudentsCount);
                tempEnrolledTestsCount.push(item?.enrolledTestsCount);
                date.push(item?.date);
            }
        }
        setSeries([{
            name: 'Active Student',
            type: 'column',
            data: tempActiveStudentsCount
        },
        //  {
        //     name: 'Enrolled Tests',
        //     type: 'line',
        //     data: [0]
        // },
        {
            name: 'Enrolled Tests',
            type: 'column',
            data: tempEnrolledTestsCount
        }])
        setOptions(prevOptions => ({
            ...prevOptions,
            labels: date
        }));
    }

    useEffect(() => {
        chartByData();
    }, [data])
    return (
        <div className='mb-3'>
            <Chart options={options} series={series} height={"400px"} type="line" />
        </div>
    )
}

export default ChartByGraph