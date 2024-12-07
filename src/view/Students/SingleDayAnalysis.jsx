import React, { useEffect, useState } from 'react'
import Layout from '../../Layout/Layout'
import { useLocation, useParams } from 'react-router-dom';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { preparationCalenderSecondToHourMinSec } from '../../utils/getDataFromId';
import "./SingleDayAnalysis.css"
import { preparationCalenderSecondToHourMinSecForFraction } from '../../utils/commonFunction/dateTimeConverter';
import SummaryCard from '../../Components/StudentsComponents/PreparationCalenderComponents/SummaryCard';
import QuestionStatusCard from '../../Components/StudentsComponents/PreparationCalenderComponents/QuestionStatusCard';

const SingleDayAnalysis = () => {
    const param = useParams();
    const { state } = useLocation();
    const [dateMap, setDateMap] = useState([]);
    const [singleDayData, setSingleDayData] = useState({});
    const [compareData, setCompareData] = useState(null);

    useEffect(() => {
        get7DaysData(new Date(param.date).getDate());
    }, [state?.daily]);

    function get7DaysData(date) {
        let tempData = [];
        let singleDayData = {};
        let first = date - 3;
        let last = date + 3;
        if (first < 1) {
            first = 1;
        }
        if (last < 7) {
            last = 7;
        }
        if (last >= new Date(new Date(param.date).getFullYear(), new Date(param.date).getMonth() + 1, 0).getDate()) {
            last = new Date(new Date(param.date).getFullYear(), new Date(param.date).getMonth() + 1, 0).getDate();
            first = last - 6;
        }
        for (let index = first; index <= last; index++) {
            let singleObject = {};
            singleObject.text = `${index} ${new Date(param.date).toLocaleString('default', { month: 'short' })}`;
            singleObject.dayValue = index;
            singleObject.index = date;
            if (state?.daily?.length > 0) {
                for (const item of state?.daily) {
                    if (item?.day == index) {
                        singleObject.studyTime = item.tStudyTime ?? 0;
                        singleObject.dailyTarget = item.dailyTarget ?? 0;
                    }
                }
            }
            tempData.push(singleObject);
        }
        if (state?.daily?.length > 0) {
            for (const data of state?.daily) {
                if (data.day == date) {
                    singleDayData = data;
                }
            }
        }
        setSingleDayData(singleDayData);
        setDateMap(tempData);
    }

    useEffect(() => {
        getCompareData(new Date(param.date).getDate());
    }, []);

    async function getCompareData(date) {
        loadingShow();
        let postData = {
            "month": new Date(param.date).getMonth() + 1,
            "year": new Date(param.date).getFullYear(),
            "studentId": param.studentId
        }
        let resp = await postApi(urlApi.compairData, postData);
        loadingHide();
        if (resp.responseCode === 200) {
            setCompareData(resp.data);
        } else {
            setCompareData(null)
        }
    }
    return (
        <Layout>
            <div className="row px-3 mt-1">
                <div className="col-md">
                    <div className="single-day-progress shadow-sm">
                        {dateMap.length && <div className="week-days">
                            {
                                dateMap?.map((item, index) => {
                                    return (
                                        <div style={{ cursor: 'pointer' }} key={index} onClick={() => { get7DaysData(item?.dayValue); getCompareData(item?.dayValue) }}>
                                            <CircularProgressbar className='calendar-progress-bar'
                                                maxValue={item?.dailyTarget ? (item?.dailyTarget * 3600) : (6 * 3600)}
                                                value={item?.studyTime ? item?.studyTime : 0}
                                                text={item?.text}
                                                styles={{
                                                    text: {
                                                        fontSize: '25px', fontWeight: item?.dayValue == item?.index ? '600' : '400',
                                                        fill: item?.dayValue == item?.index ? '#3E98C7' : 'var(--black)'
                                                    }
                                                }}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>}
                        <div className="single-progress-bar mt-3">
                            <CircularProgressbar className='single-day-progress-bar'
                                maxValue={singleDayData?.dailyTarget ? (singleDayData?.dailyTarget * 3600) : (6 * 3600)}
                                value={singleDayData?.tStudyTime ? singleDayData?.tStudyTime : 0}
                                strokeWidth={20}
                                styles={buildStyles({
                                    trailColor: "#FFF",
                                    textSize: 8,
                                })}
                            />
                            <div className="centered-text">
                                <p className="mb-0">{("Time spent on goal")}</p>
                                <p className="mb-0"> {singleDayData?.tStudyTime ? (preparationCalenderSecondToHourMinSec(singleDayData?.tStudyTime)) : "00:00h"} <span className='out-off-time'>/ {preparationCalenderSecondToHourMinSec(singleDayData?.dailyTarget ? (singleDayData?.dailyTarget * 3600) : (6 * 3600))}</span></p>
                                <p className="mb-0" style={{ fontSize: 12, fontWeight: 400 }}>
                                    <span className={`span-text ${compareData?.studyTimeVsLastDay > 0 ? "positive" : "negative"}`} > {compareData?.studyTimeVsLastDay > 0 ? "+" : "-"}{preparationCalenderSecondToHourMinSec(compareData?.studyTimeVsLastDay)} </span> <span>{("vs yesterday")}</span></p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row px-3 mt-2 mb-3">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md"><SummaryCard icon={process.env.PUBLIC_URL + "/Assets/Images/test-attempted-icon.svg"} score={singleDayData?.tTestAttempted} title={("Test Attempted")} /></div>
                            <div className="col-md"><SummaryCard icon={process.env.PUBLIC_URL + "/Assets/Images/live-test-attempted-icon.svg"} score={"(Coming Soon)"} title={("Live Test")} /></div>
                            <div className="col-md"><SummaryCard icon={process.env.PUBLIC_URL + "/Assets/Images/current-affairs-attempted-icon.svg"} score={"(Coming Soon)"} title={("Current Affairs")} /></div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="study-hour-bar-chart shadow-sm" style={{ backgroundColor: "#f2f2f2", padding: '15px', borderRadius: '10px' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="total-study-hour"> {("Total questions attempted")}<br /><span className="compare-hour" > <span className={`span-text ${compareData?.questionAttemptedVsLastDAy >= 0 ? "positive" : "negative"}`} > {compareData?.questionAttemptedVsLastDAy >= 0 ? "+" : ""} {(compareData?.questionAttemptedVsLastDAy || "0")} </span> {("vs yesterday")}</span> </p>
                                <p className="mb-0 final-total-hour">{singleDayData?.tQuestionAttempted || 0}</p>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6 mb-2">
                                <QuestionStatusCard value={singleDayData?.tQuestionCorrect} icon={process.env.PUBLIC_URL + "/icons/checked.svg"} status={("Correct")} />
                            </div>
                            <div className="col-md-6">
                                <QuestionStatusCard value={singleDayData?.tQuestionIncorrect} icon={process.env.PUBLIC_URL + "/icons/close.svg"} status={("Incorrect")} />
                            </div>
                            <div className="col-md-6">
                                <QuestionStatusCard value={isNaN((((singleDayData?.tQuestionAttempted - singleDayData?.tQuestionIncorrect) / singleDayData?.tQuestionAttempted) * 100).toFixed(0)) ? "0" : (((singleDayData?.tQuestionAttempted - singleDayData?.tQuestionIncorrect) / singleDayData?.tQuestionAttempted) * 100).toFixed(0)} icon={process.env.PUBLIC_URL + "/icons/accuracy.svg"} status={("Accuracy")} />
                            </div>
                            <div className="col-md-6">
                                <QuestionStatusCard value={singleDayData?.tQuestionAttempted != 0 ? preparationCalenderSecondToHourMinSecForFraction((singleDayData?.tAttemptedTime / singleDayData?.tQuestionAttempted)?.toFixed(2)) + "/Q" : 0} icon={process.env.PUBLIC_URL + "/icons/speed.svg"} status={("Speed")} />
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </Layout>
    )
}

export default SingleDayAnalysis