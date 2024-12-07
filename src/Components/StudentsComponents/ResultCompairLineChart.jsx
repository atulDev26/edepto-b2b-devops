import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";


const ResultCompairLineChart = ({calendarData}) => {
    const [selectedBtn, setSelectedBtn] = useState("TESTS");
    const [series, setSeries] = useState([{
        name: 'Attempt Rate',
        type: 'line',
        data: []
    }, {
        name: 'Accuracy',
        type: 'line',
        data: []
    }]);

    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
            toolbar: { show: false },
        },
        stroke: {
            width: [2, 2],
            curve: 'smooth'
        },
        colors: ['#2E88FA', '#DF5E50'],
        fill: {
            colors: ['#2E88FA', '#DF5E50'],
            radius: 10,
            opacity: 1
        },
        labels: [],
        markers: {
            radius: 10,
            shape: "square",
            colors: ['#2E88FA', '#DF5E50']
        },
        xaxis: {
            type: 'text',
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
                }
            },
        },
        legend: {
            show: true,
            position: 'top',
            floating: false,
            fontSize: '12px',
            horizontalAlign: 'left',
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
    }
    );

    function getChartData() {
        let tempArr = [];
        let tempArrX = [];
        let tempArrAccuracy = [];
        if (calendarData?.daily?.length > 0) {
            for (const item of calendarData?.daily) {
                if (selectedBtn == "TESTS") {
                    tempArr.push(item?.attemptedRateTest);
                    tempArrAccuracy.push(item?.accuracyTest);
                }
                if (selectedBtn == "LIVE_TEST") {
                    tempArr.push(item?.attemptedRateLiveTest);
                    tempArrAccuracy.push(item?.accuracyLiveTest);
                }
                if (selectedBtn == "CURR_AFF") {
                    tempArr.push(item?.attemptedRateCurrentAffairs);
                    tempArrAccuracy.push(item?.accuracyCurrentAffairs);
                }
                tempArrX.push((item?.day + " " + new Date().toLocaleString('default', { month: 'short' })))
            }
        }
        setSeries(
            [{
                name: 'Attempt Rate',
                type: 'line',
                data: tempArr
            }, {
                name: 'Accuracy',
                type: 'line',
                data: tempArrAccuracy
            }]
        );
        setOptions(
            {
                chart: {
                    height: 350,
                    type: 'line',
                    stacked: false,
                    toolbar: { show: false },
                },
                stroke: {
                    width: [2, 2],
                    curve: 'smooth'
                },
                colors: ['#2E88FA', '#DF5E50'],
                fill: {
                    colors: ['#2E88FA', '#DF5E50'],
                    radius: 10,
                    opacity: 1
                },
                labels: tempArrX,
                markers: {
                    radius: 10,
                    shape: "square",
                    colors: ['#2E88FA', '#DF5E50']
                },
                xaxis: {
                    type: 'text',
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
                            return val.toFixed();
                        },
                    },
                },
                legend: {
                    show: true,
                    position: 'top',
                    floating: false,
                    fontSize: '12px',
                    horizontalAlign: 'left',
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
            }
        )
    }


    useEffect(() => {
        getChartData();
    }, [selectedBtn, calendarData]);


    return (
        <>
            <div className="bg-white-color shadow-xl rounded-xl mb-3 p-2">
                <div className="d-flex justify-content-between align-items-center">
                    <p className="total-study-hour"> Strength & Weakness</p>
                </div>
                <div className="buttons-group mt-1">
                    <button className={`bg-inherit text-primary-blue font-semibold py-2 shadow-sm px-4 rounded-xl subject-btn ${selectedBtn == "TESTS" && "active"}`} onClick={() => setSelectedBtn("TESTS")} style={{
                         border: '1px solid var(--primary-blue)'
                    }}>{("Tests")}</button>
                </div>
                <Chart options={options} series={series} height={"300px"} type="line" />
            </div>
        </>
    )
}

export default ResultCompairLineChart