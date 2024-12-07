import React, { useEffect, useMemo, useState } from 'react'
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { getApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';
import { convertSecondIntoDayHourMinSec } from '../../../utils/commonFunction/dateTimeConverter';
import Table from '../../DataTable/Table';
import DropDown from '../../DropDown/DropDown';
import { CircularProgressbar } from 'react-circular-progressbar';
import { IconChecks } from '@tabler/icons-react';

const StudentTestRank = ({ testId, studentId }) => {
    const [filterData, setFilterData] = useState({});
    const [filterBtnValue, setFilterBtnValue] = useState("General");
    var serialNo = 1;

    async function getRankers() {
        let url = urlApi.getRankers + testId;
        if (filterBtnValue) {
            url += '?category=' + filterBtnValue;
        }
        loadingShow();
        let resp = await getApi(url);
        loadingHide();
        if (resp.responseCode === 200) {
            for (const item of resp.data?.testId?.examCutOffs) {
                if (item?.category == filterBtnValue) {
                    setFilterData(item)
                }
            }
        } else {
            setFilterData({});
        }
    }

    useEffect(() => {
        getRankers();
        return () => { };
    }, [filterBtnValue]);

    const onDropDownClick = (filter) => {
        setFilterBtnValue(filter);
    }

    const columns = [
        {
            name: "S.No",
            width: "60px",
            selector: row => serialNo++
        },
        {
            name: "Student",
            selector: row => row?.name,
            grow: 1.5,
            cell: row => (
                <div className='d-flex align-items-center flex-column py-2'>
                    <img src={row?.studentId?.profilePic} style={{ height: 50, borderRadius: '100%', width: 50, objectFit: 'contain' }} alt="" />
                    <p className="mb-0">{row?.studentId?.name}</p>
                </div>
            )
        },
        {
            name: "Rank",
            wrap: true,
            selector: row => (
                <p>#{row?.rank + 1}</p>
            )
        },
        {
            name: "Score",
            wrap: true,
            selector: row => (
                <CircularProgressbar className='calendar-progress-bar'
                    maxValue={100}
                    value={(row.score)?.toFixed(2)}
                    text={`${(row.score).toFixed(2)}%`}
                    styles={{
                        text: { fontSize: '22px', fontWeight: "600" },
                        path: {
                            stroke: (row.score)?.toFixed(2) < 50 ? 'red' : 'green',
                            strokeWidth: 8,
                        },
                        trail: {
                            strokeWidth: 10,
                        },
                    }}
                />
            )
        },
        {
            name: "Accuracy",
            wrap: true,
            selector: row => (
                <>
                    <CircularProgressbar className='calendar-progress-bar'
                        maxValue={100}
                        value={(row.accuracy)?.toFixed(2)}
                        text={`${(row.accuracy).toFixed(2)}%`}
                        styles={{
                            text: { fontSize: '22px', fontWeight: "600" },
                            path: {
                                stroke: (row.accuracy)?.toFixed(2) < 50 ? 'red' : 'green',
                                strokeWidth: 8,
                            },
                            trail: {
                                strokeWidth: 10,
                            },
                        }}
                    />
                </>
            )
        },
        {
            name: "Percentile",
            wrap: true,
            selector: row => (
                <p>{!isNaN(((filterData?.analysis?.totalCompleted - row?.rank) / filterData?.analysis?.totalCompleted * 100).toFixed(2)) ? (((filterData?.analysis?.totalCompleted - row?.rank) / filterData?.analysis?.totalCompleted * 100).toFixed(2)) : "--"}</p>
            )
        },
        {
            name: "Time",
            wrap: true,
            selector: row => (
                <p>{convertSecondIntoDayHourMinSec(row?.timeSpent)}</p>
                // TODO
            )
        },
        {
            name:"Attempt Question",
            wrap: true,
            center: true,
            grow: 1,
            selector: row => (
                <>
                 <div className='bg-[#D9FFED] flex-warp gap-2 px-2 py-1 flex justify-between items-center rounded-md' style={{
                    border: '2px solid #49A57A'
                }}>
                    <div className='flex gap-2 items-center'>
                        <p className='text-[#49A57A] font-bold text-xs'>Attempt</p>
                    </div>
                    <p className='text-[#49A57A] font-bold text-sm'>{row?.attemptedQuestions||0}</p>
                </div>  
                <div className='bg-[#FFF2F8] flex-warp gap-2 px-2 py-1 flex justify-between items-center rounded-md mt-2 mb-2' style={{
                    border: '2px solid #D888AB'
                }}>
                    <div className='flex gap-2 items-center'>
                        <p className='text-[#D888AB] font-bold text-xs'>Unattempted</p>
                    </div>
                    <p className='text-[#D888AB] font-bold text-xs'>{row?.unattemptedQuestions||0}</p>
                </div> 
                </>
                

            )
        },
        {
            name:"Status",
            wrap: true,
            center: true,
            grow: 1,
            selector: row => (
                <>
                 <div className='bg-[#D9FFED] mt-2 flex-warp gap-2 px-2 py-1 flex justify-between items-center rounded-md' style={{
                    border: '2px solid #49A57A'
                }}>
                    <div className='flex gap-2 items-center'>
                        <p className='text-[#49A57A] font-bold text-xs'>Correct</p>
                    </div>
                    <p className='text-[#49A57A] font-bold text-xs'>{row?.correctQuestions||0}</p>
                </div> 
                <div className='bg-[#FFF2F8] flex-warp gap-2 px-2 py-1 flex justify-between items-center rounded-md mt-2 mb-2' style={{
                    border: '2px solid #D888AB'
                }}>
                    <div className='flex gap-2 items-center'>
                        <p className='text-[#D888AB] font-bold text-xs'>Correct</p>
                    </div>
                    <p className='text-[#D888AB] font-bold text-xs'>{row?.incorrectQuestions||0}</p>
                </div>  
                </>
                

            )
        }

    ]

    return (
        <>
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-md-2 ms-auto">
                        <DropDown options={["General", "SC", "ST", "OBC", "EWS"]} onclick={(e) => { onDropDownClick(e); }} defaultOption={"Category"} />
                    </div>
                </div>
                <div className="bg-container">
                    <Table
                        columns={columns} data={filterData?.analysis?.rank} isPagination={false}
                    />
                </div>
            </div>
        </>
    )
}

export default StudentTestRank