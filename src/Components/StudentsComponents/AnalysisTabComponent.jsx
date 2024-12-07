import React, { useEffect, useState } from 'react'
import AnalysisCards from './AnalysisCards'
import TestStatusComponent from './TestStatusComponent'
import AnalysisCompairChart from './AnalysisCompairChart'
import TimeUtilizationChart from './PreparationCalenderComponents/TimeUtilizationChart'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { toast } from 'sonner'
import DropDown from '../DropDown/DropDown'

const AnalysisTabComponent = ({ testId,studentId }) => {
    const [analysisData, setAnalysisData] = useState({});
    const [filterData, setFilterData] = useState({});
    const [filterCategoryOption, setFilterCategoryOption] = useState("General");

    useEffect(() => {
        getStudentAnalysis();
    }, [])

    async function getStudentAnalysis() {
        loadingShow();
        let resp = await getApi(urlApi.getAnalysis + testId);
        loadingHide();
        if (resp.responseCode === 200) {
            setAnalysisData(resp.data);
        } else {
            setAnalysisData({});
            toast.error(resp.message);
        }
        return;
    }

    function handleAnalysisDropDown(filter) {
        setFilterCategoryOption(filter);
        // let fillterData = analysisData?.testId?.examCutOffs?.find(item => {if(item?.category === filter) return item})
        for (const item of analysisData?.testId?.examCutOffs) {
            if (item?.category == filter) {
              setFilterData(item)
            }
          }
            // setFilterData(fillterData);
        return;
    }


    return (
        <>
            <div className='w-[120px] mb-3'>
                <DropDown options={["General", "SC", "ST", "OBC", "EWS"]} onclick={(e) => { handleAnalysisDropDown(e) }} defaultOption={"Category  "}/>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-5'>
                {analysisData?.finalRank &&<AnalysisCards
                    cardName={"Rank"}
                    cardNumber={analysisData?.finalRank[filterCategoryOption.toLowerCase()]}
                    cardIcon={process.env.PUBLIC_URL + "/Assets/Images/rank.svg"}
                    cardColor={'#FFF2E5'}
                />}
                {analysisData&&<AnalysisCards
                    cardName={"Score"}
                    cardNumber={analysisData?.analysis?.yourScore + "/" + analysisData?.analysis?.totalMarks}
                    cardIcon={process.env.PUBLIC_URL + "/Assets/Images/score.svg"}
                    cardColor={'#FFE3EF'}
                />}
               { filterData&&<AnalysisCards
                    cardName={"Accuracy"}
                    cardNumber={filterData?.analysis?.avgAccuracy?.toFixed(2)|| 0}
                    cardIcon={process.env.PUBLIC_URL + "/Assets/Images/accuracy.svg"}
                    cardColor={'#EAE7FF'}
                />}
                {analysisData?.finalRank &&<AnalysisCards
                    cardName={"Percentile"}
                    cardNumber={!isNaN(((filterData?.analysis?.totalCompleted - analysisData?.finalRank[filterCategoryOption?.toLocaleLowerCase()]) / filterData?.analysis?.totalCompleted * 100).toFixed(2)) && (((filterData?.analysis?.totalCompleted - analysisData?.finalRank[filterCategoryOption?.toLocaleLowerCase()]) / filterData?.analysis?.totalCompleted * 100).toFixed(2)) || 0}
                    cardIcon={process.env.PUBLIC_URL + "/Assets/Images/percentile.svg"}
                    cardColor={'#F9FFEC'}
                />}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 xl:grid-cols-4 gap-4'>
                <div className='col-span-1'>
                    <TestStatusComponent correct={analysisData?.analysis?.correctAnswers} incorrect={analysisData?.analysis?.incorrectAnswers} unattempted={analysisData?.analysis?.unattemptedQuestions}/>
                </div>
                <div className='col-span-2'>
                    <AnalysisCompairChart chartData={filterData?.analysis} studentId={studentId} filterData={filterCategoryOption}/>
                </div>
                <div className='col-span-1'>
                    <TimeUtilizationChart  chartData={analysisData?.analysis}/>
                </div>
            </div>
        </>

    )
}

export default AnalysisTabComponent