import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";
import { preparationCalenderSecondToHourMinSec } from '../../utils/getDataFromId';

const StudyChart = ({ calendarData, compareData }) => {
    const [series, setSeries] = useState([{
        name: "Time ",
        data: []
    }]);

    useEffect(() => {
        getChartData()
    }, [calendarData]);

    const [options, setOptions] = useState({
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
                horizontal: false,
                columnWidth: '55%',

            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
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
        xaxis: {
            categories: [],
            labels: {
                style: {
                    fontSize: '10px',
                    colors: 'var(--black)',
                }
            },
        },
        yaxis: {
            title: {
                text: '',
                style: {
                    color: 'var(--black)',
                    fontSize: '10px',
                    fontFamily: 'Acumin pro',
                    fontWeight: 400,
                    cssClass: 'apexcharts-yaxis-title',
                },
            },
            labels: {
                style: {
                    fontSize: '10px',
                    colors: ['var(--black)'],
                },
                formatter: (val) => {
                    return preparationCalenderSecondToHourMinSec(val);
                },
            },

        },
        fill: {
            colors: ['#1158DF', '#D94230'],
            radius: 10,
            opacity: 1
        },
        markers: {
            radius: 50,
            shape: "circle",
            colors: ['#1158DF', '#D94230']
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return preparationCalenderSecondToHourMinSec(val);
                }
            }
        },
    });
    function getChartData() {
        let tempArr = calendarData?.daily?.length < 0 ? [0] : [];
        let tempArrX = calendarData?.daily?.length < 0 ? [0] : [];
        setSeries([{ data: [] }]);

        if (calendarData?.daily) {
            for (const item of calendarData?.daily) {
                tempArr.push(item?.tStudyTime);
                tempArrX.push(item?.day + " " + new Date().toLocaleString('default', { month: 'short' }));
            }
            setSeries([{
                data: tempArr
            }]);
            setOptions(
                {
                    chart: {
                        type: 'bar',
                        height: 350,
                        toolbar: {
                            show: false,
                        },
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            borderRadiusApplication: 'end',
                            borderRadiusWhenStacked: 'last',
                            horizontal: false,
                            columnWidth: '55%',

                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                    },
                    grid: {
                        borderColor: '#f2f2f2',
                        strokeDashArray: 10,
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
                    xaxis: {
                        categories: tempArrX,
                        labels: {
                            style: {
                                fontSize: '10px',
                                colors: 'var(--black)',
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            text: '',
                            style: {
                                color: 'var(--black)',
                                fontSize: '10px',
                                fontFamily: 'Acumin pro',
                                fontWeight: 400,
                                cssClass: 'apexcharts-yaxis-title',
                            },
                        },
                        labels: {
                            style: {
                                fontSize: '10px',
                                colors: ['var(--black)'],
                            },
                            formatter: (val) => {
                                return preparationCalenderSecondToHourMinSec(val);
                            },
                        },

                    },
                    fill: {
                        colors: [function ({ value, seriesIndex, dataPointIndex, w }) {
                            if (value <= 21600) {
                                return "#1158DF";
                            } else {
                                return "var(--primary)";
                            }
                        }],
                        radius: 10,
                        opacity: 1
                    },
                    markers: {
                        radius: 50,
                        shape: "circle",
                        colors: ['#1158DF', '#D94230'],
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return preparationCalenderSecondToHourMinSec(val);
                            }
                        }
                    },
                }
            )
        }
    }

    return (
        <>
            <div className="study-hour-bar-chart h-100" style={{ backgroundColor: "var(--white-color)", padding: '15px', borderRadius: '10px' }}>
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg ">Total Study Hours<br />
                        <span className="font-medium text-sm text-slate-800">
                            <span className={`span-text ${compareData > 0 ? "positive" : "negative"}`} > {compareData > 0 ? "+" : "-"} {preparationCalenderSecondToHourMinSec(compareData)} </span>
                            in last week
                        </span>
                    </p>
                    <p className="mb-0 final-total-hour">{preparationCalenderSecondToHourMinSec(calendarData?.tStudyTime) || "0m"}</p>
                </div>
                <Chart options={options} series={series} height={"100%"} type="bar" />
            </div>
        </>
    );
}

export default StudyChart