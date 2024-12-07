import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../Layout/Layout'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import _ from "lodash"
import Table from '../../Components/DataTable/Table'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { urlApi } from '../../api/urlApi'
import { getApi } from '../../api/callApi'
import { toast } from 'sonner'
import { Link, useParams } from 'react-router-dom'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import { convertSecondIntoDayHourMinSec, convertSecondsToHours, dateTimeConverter } from '../../utils/commonFunction/dateTimeConverter'
import StudentEnrolledTestLanguagePopover from '../../Components/PopOver/StudentEnrolledTestLanguagePopover'

const StudentEnrolledTest = () => {
    const { studentId } = useParams();
    const [studentEnrolledTestData, setStudentEnrolledTestData] = useState({
        data: [],
        count: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [accesses] = useState({
        analysis: hasAccess(accessKeys?.getEnrolledTestAnalysisById)
    })
    const [search, setSearch] = useState(null);
    const [filter, setFilter] = useState(null);
    const [resetFilter, setResetFilter] = useState(false);
    const [itemPerPage, setItemPerPage] = useState(10);

    useEffect(() => {
        getStudentEnrolled();
    }, [filter, search, resetFilter])

    console.log(studentId);


    async function getStudentEnrolled() {
        loadingShow();
        let url = urlApi.getEnrolledTest + studentId;
        if (search) {
            url = url + "?searchByTestName=" + search;
        }
        // if (filter) {
        //     if (filter == "Completed") {
        //         url = url + "?filterByIsCompleted=" + true;
        //     }
        //     else if (filter == "Paused") {
        //         url = url + "?filterByIsStarted=" + true + "&filterByIsCompleted=" + false;
        //     }
        //     else if (filter == "Not Started") {
        //         url = url + "?filterByIsStarted=" + false;
        //     }
        //     else {
        //         url = urlApi.getTestListOfStudent + studentId;
        //         // + "?page=" + current_page + "&limit=" + itemPerPage;
        //     }
        // }
        let resp = await getApi(url);
        console.log(resp);

        loadingHide();
        if (resp.responseCode === 200) {
            setStudentEnrolledTestData({
                data: resp.data,
                count: resp.data.count
            })
        } else {
            toast.error(resp.message);
        }
        return;
    }

    function onSearch(searchData) {
        if (searchData.length === 0) {
            setSearch(null);
            setCurrentPage(1);
            getStudentEnrolled();
            return;
        }
        if (searchData) {
            setCurrentPage(1);
            setSearch(searchData);
            getStudentEnrolled();
        } else {
            toast.error("Invalid Search!!!")
        }
        return;
    }

    const functionDebounce = _.debounce((e) => onSearch(document.getElementById("category-search-field")?.value.trim()), 500);

    // function statusDropDown(filterData) {
    //     if (filterData == "ALL") {
    //         setFilter(null)
    //     } else if (filterData == "Completed") {
    //         setFilter("Completed")
    //     } else if (filterData == "Paused") {
    //         setFilter("Paused")
    //     } else if (filterData == "Not Started") {
    //         setFilter("Not Started")
    //     }
    //     getStudentEnrolled();
    //     setResetFilter(false);
    // }

    function resetFilters() {
        setResetFilter(true);
        setSearch(null);
        // setCurrentPage(1);
        // setFilter(null)
        document.getElementById("category-search-field").value = "";
        getStudentEnrolled();
        return;
    }


    const columns = useMemo(() => {
        return ([
            // {
            //     name:
            //         <div className='font-semibold'>
            //             SL No
            //         </div>,
            //     center: true,
            //     grow: 0.2,
            //     cell: row => 1
            //     // cell: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage),
            // },
            {
                name:
                    <div className='font-semibold'>
                        Test Name
                    </div>,
                grow: 1,
                cell: row => row?.testName
            },
            // {
            //     name:
            //         <div className='font-semibold'>
            //             Category
            //         </div>,
            //     width: "100px",
            // },
            {
                name:
                    <div className='font-semibold'>
                        Duration
                    </div>,
                width: "100px",
                cell: row => (
                    <div>
                        {convertSecondIntoDayHourMinSec(row?.duration)}
                    </div>
                )

            },
            {
                name:
                    <div className='font-semibold'>
                        Analysis
                    </div>,
                width: "100px",
                cell: row => (
                    <div>
                        {row?.analysis?.accuracy}
                    </div>
                )

            },
            {
                name:
                    <div className='font-semibold'>
                        Language
                    </div>,
                center: true,
                cell: row => (
                    <div>
                        <StudentEnrolledTestLanguagePopover data={row?.languages} />
                    </div>
                )
            },
            {
                name:
                    <div className='font-semibold'>
                        Date & Time
                    </div>,
                selector: (row) => dateTimeConverter(row?.enrolledDate),
                cell: (row) => (
                    <div className="py-2">
                        <p className="font-semibold text-sm">Enrolled</p>
                        <p className="py-1">
                            &nbsp;&nbsp;[{dateTimeConverter(row?.enrolledDate)}]
                        </p>
                        <p className="font-semibold text-sm">Started</p>
                        <p className="py-1">
                            &nbsp;&nbsp;[
                            {row?.isStarted
                                ? dateTimeConverter(row?.testStartDate)
                                : "Not Started Yet !!"}
                            ]
                        </p>
                    </div>
                ),
            },
            {
                name:
                    <div className='font-semibold'>
                        Action
                    </div>,
                omit: !(accesses?.analysis),
                width: "120px",
                cell: (row) => (
                    <div className="d-flex flex-wrap gap-2 my-2">
                        {row?.isStarted ? (
                            row?.isAnalysis ? (
                                <Link
                                    to={"/students/student-report/" + studentId + "/" + row?._id}
                                >
                                    <button className='text-white-color bg-primary-blue font-semibold py-2 shadow-sm px-3 rounded-xl flex-wrap m-auto'>Analysis</button>
                                </Link>
                            ) : (
                                <button>Paused</button>
                            )
                        ) : (
                            "Not Started"
                        )}
                    </div>
                ),
            }
        ])
    }, [accesses?.analysis])

    // 64fa7ef64b62c1564d0b938a

    return (
        <Layout>
            <div className='h-auto w-full bg-white-color rounded-2xl mt-3 p-3 flex flex-wrap shadow-sm justify-between items-center mb-3'>
                {/* <div className='font-semibold text-base sm:w-auto mb-[10px] order-[1]'>
                    <AddCategoryModal callback={() => getCategory()} />
                </div> */}
                <div className='search-container w-full sm:w-full md:w-1/2 order-[3] sm:order-[2]'>
                    <SearchInputField width={"100%"} bgColor={"#ffffff"} onChange={(e) => functionDebounce(e)} inputId={"category-search-field"} onClick={() => onSearch(document.getElementById("category-search-field")?.value.trim())} />
                </div>
                {/* <div className='flex filter-container items-center mb-[10px] gap-3 order-[2] sm:order-[3]'>
                    <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
                        options={["All", "Completed", "Paused", "Not Started"]}
                        defaultOption={"Filter"}
                    />
                    <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
                </div> */}
            </div>

            <Table
                columns={columns}
                data={studentEnrolledTestData?.data}
            />
            <div className='shadow-md w-full ease-in duration-200'>
                {/* <Pagination onPageChanges={onPageChange}
                        totalItems={testList?.count}
                        itemPerPage={itemPerPage}
                        currentPage={currentPage} /> */}
            </div>
        </Layout>
    )
}

export default StudentEnrolledTest