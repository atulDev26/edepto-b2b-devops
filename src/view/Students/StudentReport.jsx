import React, { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AnalysisTabComponent from '../../Components/StudentsComponents/AnalysisTabComponent';
import Solution from '../../Components/StudentsComponents/StudentTestSolution/Solution';
import Layout from '../../Layout/Layout';
import StudentTestRank from '../../Components/StudentsComponents/StudentTestRank/StudentTestRank';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';

const StudentReport = () => {
    const { testId, studentId } = useParams()
    const [key, setKey] = useState('Analysis');
    const [resetFilter, setResetFilter] = useState(false);

    function resetFilters() {
        // setOpenEditModal(false);
        // setResetFilter(true);
        // setCurrentPage(1);
        // search_data = null;
        // document.getElementById("teacher-search-field").value = null;
        // getTeachersList();
        return;
    }
    function statusDropDown(event) {
        // if (event === "Active") {
        //   filter = "true";
        // } if (event === "Inactive") {
        //   filter = "false";
        // } if (event === "All") {
        //   filter = null;
        // }
        // getTeachersList();
        // filter = null;
        return;
    }
    return (
        <Layout>
            <div className='h-auto mt-4 w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
                <div className='font-semibold text-base sm:w-auto order-[1]'>
                    Analysis
                </div>
                <div className='flex filter-container items-center gap-3 order-[2] sm:order-[3]'>
                    {/* <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
                        options={["All", "Active", "Inactive", "Time ASE", "TIme DES"]}
                        defaultOption={"Filter"} reset={resetFilter} />
                    <ResetFilter options={["Reset"]} onclick={() => resetFilters()} /> */}
                </div>
            </div>
            <div className='w-full border' />
            <div className='p-2 bg-white-color'>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => {
                        setKey(k);
                    }}
                    className="mb-3"
                >
                    {hasAccess(accessKeys?.getEnrolledTestAnalysisById) && <Tab eventKey="Analysis" title="Analysis">
                        <AnalysisTabComponent testId={testId} studentId={studentId} />
                    </Tab>}
                    {hasAccess(accessKeys?.getSolutions) && <Tab eventKey="Solution" title="Solution">
                        <Solution testId={testId} studentId={studentId} />
                    </Tab>}
                    {hasAccess(accessKeys?.getEnrolledTestRankersById) && <Tab eventKey="Rank" title="Rank">
                        <StudentTestRank testId={testId} studentId={studentId} />
                    </Tab>}
                </Tabs>
            </div>
        </Layout>
    )
}

export default StudentReport