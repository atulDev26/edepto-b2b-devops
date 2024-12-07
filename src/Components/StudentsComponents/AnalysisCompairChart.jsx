import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import { toast } from 'sonner';

const AnalysisCompairChart = ({ chartData, studentId,filterData}) => {
    const [series, setSeries] = useState([]);
    const [filterValue, setFilterValue] = useState("Score");
    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
            toolbar: { show: false },
        },
        markers: {
            size: 4,
            colors: undefined,
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            shape: "circle",
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            onClick: undefined,
            onDblClick: undefined,
            showNullDataPoints: true,
            hover: {
                size: undefined,
                sizeOffset: 3
            }
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
            width: 2
        },
        colors: ['#D94230', '#FFE083', '#024CC7',"#D3789F"],
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
        // labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        xaxis: {
            type: 'category',
            labels: {
                show: false
            }
        },

        legend: {
            show: true,
            position: 'bottom',
            floating: false,
            fontSize: '12px',
            horizontalAlign: 'center',
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
        yaxis: {
            lines: {
                show: true,
                borderColor: '#000000',
                strokeDashArray: 2,
            },
            labels: {
                formatter: (value) => (value?.toFixed(2))
            }
        }
    },
    );
    useEffect(() => {
        if (chartData?.rank?.length > 0) {
            const tempSeries = [
                {
                    name: 'Score',
                    data: chartData?.rank?.map(item => item?.studentId?._id === studentId ? item?.score : null)
                },
                {
                    name: 'Time',
                    data: chartData?.rank?.map(item => item?.studentId?._id === studentId ? item?.timeSpent : null)
                },
                {
                    name: 'Accuracy',
                    data: chartData?.rank?.map(item => item?.studentId?._id === studentId ? item?.accuracy : null)
                },
                {
                    name: 'QAttempt',
                    data: chartData?.rank?.map(item => item?.studentId?._id === studentId ? item?.attemptedQuestions : null)
                }
            ];
            tempSeries[0]?.data?.push(chartData.rank[0]?.score, chartData.avgScore?.toFixed(2));
            tempSeries[1]?.data?.push(chartData.rank[0]?.timeSpent, chartData?.avgTimeSpent);
            tempSeries[2]?.data?.push(chartData.rank[0]?.accuracy, chartData?.avgAccuracy);
            tempSeries[3]?.data?.push(chartData.rank[0]?.attemptedQuestions, chartData?.avgAttemptedQuestions);
            setSeries(tempSeries);
        } else {
            toast.error(`No Data Available`);
        }
    }, [chartData, studentId]);

    return (
        <div className='min-w-fit w-full bg-white-color shadow-sm rounded border-slate-400 border border-2 flex-wrap'>
            <div className='flex items-center gap-3  p-2 font-semibold text-sm'>Compare <p className='rounded-xl p-2 bg-lime-500 w-fit text-white-color text-sm font-bold'>{filterData}</p></div>
            <div className='border border-b-background-color' />
            
            <div>
                <Chart options={options} series={series} height={"300px"} type="line" />
            </div>
        </div>
    )
}

export default AnalysisCompairChart