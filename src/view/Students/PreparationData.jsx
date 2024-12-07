import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { CircularProgressbar } from 'react-circular-progressbar';
import StudyChart from '../../Components/DashboardComponents/StudyChart';
import CalenderSkeletonEffect from '../../Components/SkeletonEffect/CalenderSkeletonEffect';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import BarSkeletonEffect from '../../Components/SkeletonEffect/BarSkeletonEffect';
import StrengthWeakness from '../../Components/DashboardComponents/StrengthWeakness';
import { useNavigate } from 'react-router-dom';
import ResultCompairLineChart from '../../Components/StudentsComponents/ResultCompairLineChart';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';

const PreparationData = ({ studentId }) => {
    const navigate = useNavigate();
    const [isFetch, setIsFetch] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarData, setCalendarData] = useState(null);
    const [compareData, setCompareData] = useState(null);

    useEffect(() => {
        if (studentId) {
            if (hasAccess(accessKeys?.getCalendarMonthData)) {
                getCalenderData();
            }
            if (hasAccess(accessKeys?.getCompareMonthData)) {
                getCompareData();
            }
        }
    }, [currentMonth, studentId])

    async function getCalenderData() {
        let postData = {
            "month": currentMonth?.getMonth() + 1,
            "year": currentMonth?.getFullYear(),
            "studentId": studentId
        }
        let resp = await postApi(urlApi.monthlyCalender, postData);
        setIsFetch(true);
        if (resp.responseCode === 200) {
            setCalendarData(resp?.data);
        } else {
            setCalendarData(null);
        }
        return;
    }

    function getDailyRange(day) {
        if (calendarData?.daily?.length > 0) {
            for (const item of calendarData?.daily) {
                if (item.day == day) {
                    return item
                }
            }
        }
    }

    async function getCompareData() {
        let postData = {
            "month": currentMonth.getMonth() + 1,
            "year": currentMonth.getFullYear(),
            "studentId": studentId
        }

        let resp = await postApi(urlApi.compairData, postData);
        setIsFetch(true);
        if (resp.responseCode === 200) {
            setCompareData(resp?.data);
        } else {
            setCompareData(null)
        }
    }

    return (
        <>
            {hasAccess(accessKeys?.getCompareMonthData) && <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2  xl:grid-cols-2 gap-3 mt-4">
                <div className="mb-3 w-full">
                    {isFetch ?
                        <Calendar className={"w-full calendar-custom"}
                            view='month'
                            navigationLabel={({ date, label, locale, view }) => { view = "month"; return label }}
                            onActiveStartDateChange={({ onChange, activeStartDate, value }) => { setCurrentMonth(activeStartDate) }}
                            showNeighboringMonth={false} calendarType='gregory'
                            next2Label={null} prev2Label={null}
                            onClickDay={(date) => { navigate(("/students/single-day-analysis/" + studentId + "/" + date), { state: calendarData }) }}
                            tileContent={(activeStartDate, date, view) =>
                                <>
                                    <CircularProgressbar className='calendar-progress-bar'
                                        maxValue={getDailyRange(new Date(activeStartDate.date).getDate())?.dailyTarget * 3600 || 6 * 3600}
                                        value={getDailyRange(new Date(activeStartDate.date).getDate())?.tStudyTime || 0}
                                        text={new Date(activeStartDate.date).getDate()}
                                        styles={{
                                            text: { fontSize: '32px', fontWeight: "600", color: "black" },
                                            path: {
                                                stroke: " #1158DF",
                                                strokeWidth: 8,
                                            },
                                            trail: {
                                                stroke: " #E8EFFC",
                                                strokeWidth: 8,
                                            },
                                        }}
                                    />
                                </>
                            }
                        /> : <CalenderSkeletonEffect />}
                </div>
                <div className="mb-3">
                    {isFetch ? (calendarData && <StudyChart compareData={compareData?.studyTimeVsLastMonth} calendarData={calendarData} />) : <BarSkeletonEffect />}
                </div>
            </div>}
            {hasAccess(accessKeys?.getCalendarMonthData) && <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <div className='col-span-2'>
                    <StrengthWeakness calendarData={calendarData} />
                </div>
                <div className='col-span-3'>
                    <div className='bg-white-color p-3'>
                        <p className='font-semibold text-base mb-2'>Result Compare</p>
                        {/* <div className='grid gap-2'> */}
                        <ResultCompairLineChart calendarData={calendarData} />
                        {/* </div> */}
                    </div>
                </div>
            </div>}
        </>

    )
}

export default PreparationData