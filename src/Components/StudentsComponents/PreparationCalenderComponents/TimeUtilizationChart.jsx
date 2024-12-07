import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";

const TimeUtilizationChart = ({chartData}) => {
    const [series, setSeries] = useState([0, 0, 0]);
    useEffect(() => {
        setSeries([chartData?.timeSpentInUnattempted || 0, chartData?.timeSpentInCorrect || 0, chartData?.timeSpentInIncorrect || 0])
    }, [chartData]);
    const options = {
        chart: {
            height: 250,
            type: 'radialBar',
        },
        series: [90, 70, 20],
        labels: ['Skipped','Attempted','Incorrect'],
        plotOptions: {
            radialBar: {
                track: {
                    background: '#DDE6F2',
                },
            }
        },
        fill: {
            colors: ["#024cc7","#96C237", "#d94230"]
        },
        stroke: {
            lineCap: 'round'
        },
        legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: true,
            showForZeroSeries: true,
            position: 'bottom',
            horizontalAlign: 'center', 
            floating: false,
            fontSize: '14px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: 400,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: ["Time spent on skipped questions", "Time spent on correctly attempted questions ", "Time spent on incorrectly attempted questions"],
            offsetX: 0,
            offsetY: 0,
            labels: {
                colors: undefined,
                useSeriesColors: false
            },
            markers: {
                width: 12,
                height: 12,
                strokeWidth: 0,
                strokeColor: '#fff',
                fillColors: undefined,
                radius: 12,
                customHTML: undefined,
                onClick: undefined,
                offsetX: 0,
                offsetY: 0
            },
            itemMargin: {
                horizontal: 5,
                vertical: 0
            },
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
        }
    };
    return (
        <>
            <div className='min-w-fit w-full h-full bg-white-color shadow-sm rounded border-slate-400 border border-2 flex-wrap'>
                <p className='p-2 font-semibold text-sm'>Time Utilization</p>
                <div className='border border-b-background-color' />
                <div className=''>
                    <Chart options={options} series={series} height={"350px"} type="radialBar" />
                </div>
            </div>
        </>
    )
}

export default TimeUtilizationChart