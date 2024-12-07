import { IconPointFilled } from '@tabler/icons-react';
import React from 'react';
import Chart from "react-apexcharts";
import AddStudents from '../StudentsComponents/AddStudents';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';

const StudentActivityGraph = ({ activeStudent, totalStudent }) => {
    const percentage = ((activeStudent / totalStudent) * 100) || 0;

    const series = [percentage];
    const options = {
        chart: {
            height: 350,
            type: 'radialBar',
        },
        labels: ['Progress'],
        plotOptions: {
            radialBar: {
                track: {
                    background: '#d94230',
                },
                dataLabels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: '16px',
                        fontFamily: undefined,
                        fontWeight: 600,
                        color: undefined,
                        offsetY: -15
                    },
                    value: {
                        show: true,
                        fontSize: '14px',
                        fontFamily: undefined,
                        fontWeight: 400,
                        color: undefined,
                        offsetY: 0,
                        formatter: function (val) {
                            return val?.toFixed(0) + '%'
                        }
                    }
                }
            }
        },
        fill: {
            colors: ["#024cc7"]
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: function (val) {
                    return val.toFixed(2) + '%';
                }
            },
            style: {
                fontSize: '12px',
                fontFamily: undefined
            }
        },
    };

    return (
        <div>
            <div className='flex justify-between shadow-sm py-4 px-3'>
                <p className='font-semibold text-base'>Student Activities</p>
                {hasAccess(accessKeys?.addStudent) && <AddStudents />}
            </div>
            <div className='grid grid-cols-2 items-center pl-6'>
                <Chart options={options} series={series} height={"300px"} type="radialBar" />
                <div className='flex flex-col gap-3'>
                    <p className='flex'><IconPointFilled size={30} className='text-primary-blue' /> Active Student: {activeStudent}</p>
                    <p className='flex'><IconPointFilled size={30} className='text-primary-red' /> Total Student: {totalStudent}</p>
                </div>
            </div>
        </div>
    );
}

export default StudentActivityGraph