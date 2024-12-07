import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";

const WeeklyOverViewGraph = ({ data }) => {
    const [series, setSeries] = useState([{
        name: 'Active Users',
        week: [],
        data: [0, 0, 0, 0, 0, 0, 0]
    }]);

    const [options, setOptions] = useState({
        chart: {
            height: 400,
            type: 'bar',
            stacked: false,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: '20',

            }
        },
        colors: ['#D94230'],
        stroke: {
            color: ["transparent"],
            width: 1
        },
        title: {
            text: 'Weekly Overview (New Registration)',
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: false,
            borderColor: '#f2f2f2',
            row: {
                opacity: 0
            },
            column: {
                opacity: 0
            },
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: false,
                    borderColor: '#000000',
                    strokeDashArray: 2,
                }
            }
        },
        xaxis: {
            categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        legend: {
            show: false
        }

    });

    function getShortWeekNames(weekNames) {
        return weekNames?.map(name => name?.slice(0, 3));
    }

    function getWeeklyChartData() {
        let tempData = [];
        let tempWeek = [];
        if (data?.length > 0) {
            for (const item of data) {
                tempWeek.push(item?.day);
                tempData.push(item?.registeredStudentsCount);
            }
        }
        setSeries([{
            name: 'Active Users',
            data: tempData
        }])
        setOptions({
            chart: {
                height: 400,
                type: 'bar',
                stacked: false,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    columnWidth: '20',

                }
            },
            colors: ['#D94230'],
            stroke: {
                color: ["transparent"],
                width: 1
            },
            title: {
                text: 'Weekly Overview (New Registration)',
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: false,
                borderColor: '#f2f2f2',
                row: {
                    opacity: 0
                },
                column: {
                    opacity: 0
                },
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: false,
                        borderColor: '#000000',
                        strokeDashArray: 2,
                    }
                }
            },
            xaxis: {
                categories: getShortWeekNames(tempWeek)
            },
            yaxis: {
                labels: {
                    show: false
                }
            },
            legend: {
                show: false
            }
        })

    }

    useEffect(() => {
        getWeeklyChartData();
    }, [data])
    return (
        <div>
            <Chart options={options} series={series} height={"400px"} type="bar" />
        </div>
    )
}

export default WeeklyOverViewGraph