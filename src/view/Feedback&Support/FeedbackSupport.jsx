import React, { useEffect, useMemo, useState } from 'react'
import Table from '../../Components/DataTable/Table'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import Layout from '../../Layout/Layout'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { toast } from 'sonner'
import Pagination from '../../Components/Pagination/Pagination'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import RemarksModal from '../../Components/FeedBackAndSupport/RemarksModal'
import { IconCircleCheck } from '@tabler/icons-react'
import _ from "lodash"
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import { Link } from 'react-router-dom'

const FeedbackSupport = () => {
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState(null)
  const [sortData, setSortData] = useState(null);
  const [resetFilter, setResetFilter] = useState(false);
  const [submittedIssues, setSubmittedIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [accesses] = useState({
    updateIssues: hasAccess(accessKeys?.updateIssueStatus)
  })

  useEffect(() => {
    if (hasAccess(accessKeys?.getIssues)) {
      getAllSubmittedIssues();
    }
  }, [currentPage, filter, sortData, search, resetFilter])


  async function getAllSubmittedIssues() {
    loadingShow();
    let url = urlApi.getSubmittedIssues + "?page=" + currentPage + "&limit=" + itemPerPage;
    if (filter) {
      url = url + "&filter=" + filter;
    } if (sortData) {
      url = url + "&sort=" + sortData;
    }
    if (search) {
      url = url + "&search=" + search;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setSubmittedIssues(resp?.data?.value);
      setTotalCount(resp?.data?.count);
    } else {
      toast.error(resp.message);
    }
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  function onSearch(searchData) {
    if (searchData.length === 0) {
      setSearch(null);
      setCurrentPage(1);
    }
    if (searchData) {
      setCurrentPage(1);
      setSearch(searchData);
    }
    return;
  }

  function statusDropDown(event) {
    if (event === "All") {
      setFilter(null);
      setSortData(null);
    } if (event === "CreatedAt ASC") {
      setSortData("createdAt,ASC");
      setFilter(null);
    } if (event === "CreatedAt DESC") {
      setSortData("createdAt,DESC");
      setFilter(null);
    } if (event === "Pending") {
      setFilter("pending");
      setSortData(null);
    } if (event === "Resolved") {
      setFilter("resolved");
      setSortData(null);
    }
    setResetFilter(false);
    return;
  }

  function resetFilters() {
    setResetFilter(true);
    setCurrentPage(1);
    setSearch(null);
    setFilter(null);
    setSortData(null);
    document.getElementById("feedback-support-search-field").value = null;
    return;
  }
  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("feedback-support-search-field")?.value.trim()), 500);

  const columns = useMemo(() => {
    return (
      [
        {
          name:
            <div className='font-semibold'>
              SL No
            </div>,
          center: true,
          width: "80px",
          cell: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage),
        },
        {
          name:
            <div className='font-semibold'>
              Student
            </div>,
          wrap: true,
          center: true,
          width: "200px",
          selector: row => row.name,
          cell: row =>
            <div className='flex items-center gap-2 p-[10px]'>
              <Link to={`/students/student-profile/${row?.student_Id}`}>
                <img className='min-w-[40px] w-[40px] h-[40px] rounded-full' src={row.studentProfilePic} alt='sc' onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
                }} />
              </Link>
              <Link to={`/students/student-profile/${row?.student_Id}`} >
                <p className=''>{row.studentName}</p>
              </Link>
            </div>
        },
        {
          name: 'Student Phone Number',
          center: true,
          selector: row => row.studentMobileNumber,
          cell: row => (
            <div>
              <p>{row.studentMobileNumber}</p>
            </div>
          )
        },
        {
          name:
            <div className='font-semibold'>
              status
            </div>,
          center: true,
          wrap: true,
          width: "120px",
          selector: row => row.status,
          cell: row =>
            <div className={`w-fit ${row.status == "resolved" ? "bg-primary-blue" : "bg-primary-red"} rounded-xl flex justify-center p-2 text-white-color font-normal cursor-default text-wrap`}>
              {
                row.status == "resolved" ? <p>Resolved</p> : <p>Pending</p>
              }
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Title
            </div>,
          center: true,
          selector: row => row.title,
          cell: row =>
            <div>
              <p>{row.title}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Description
            </div>,
          center: true,
          selector: row => row.description,
          cell: row =>
            <div>
              <p>{row.description ?? "--"}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Remarks
            </div>,
          center: true,
          selector: row => row.remarks,
          cell: row =>
            <div>
              <p>{row.remarks ?? "--"}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Teachers
            </div>,
          grow: 1.5,
          selector: row => row.name,
          cell: row =>
            <div className='flex items-center gap-2 p-[10px]'>
              {row.teacherName ? <img className='min-w-[40px] w-[40px] h-[40px] rounded-full' src={row.teacherProfilePic} alt='sc' onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
              }} /> : null}
              <p className=''>{row.teacherName ?? "---"}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Action
            </div>,
          center: true,
          omit: !accesses?.updateIssues,
          cell: row =>
            <div className='flex items-center gap-2 cursor-pointer'>
              {
                row.status === "pending" ? <RemarksModal callback={() => getAllSubmittedIssues()} data={row} /> : <IconCircleCheck size={20} className='text-lime-600' />
              }

            </div>,
        },
      ]
    )
  }, [accesses, submittedIssues, totalCount])
  return (
    <Layout>
      <div className='h-auto w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
        <div className='font-semibold text-base sm:w-auto order-[1]'>
          Feedback and Support
        </div>
        <div className='search-container mt-1 sm:mt-2 md:m-0 xl:m-0 w-full sm:w-full md:w-1/2 order-[3] sm:order-[2] my-2'>
          <SearchInputField width={"100%"} bgColor={"#ffffff"} inputId={"feedback-support-search-field"} onClick={() => onSearch(document.getElementById("feedback-support-search-field")?.value.trim())
          } onChange={(e) => functionDebounce(e)} placeholder={"User Name"} />
        </div>
        <div className='flex min-w-[200px] filter-container justify-start sm:justify-start md:justify-start lg:justify-center items-center mb-[10px] gap-3 order-[2] sm:order-[3] mx-2 my-2'>
          <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
            options={["All", "CreatedAt ASC", "CreatedAt DESC", "Pending", "Resolved"]}
            defaultOption={"Filter"} reset={resetFilter} />
          <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
        </div>
      </div>
      <div className='shadow-md w-full ease-in duration-200'>
        <Table
          columns={columns}
          data={submittedIssues}
        />
        <Pagination onPageChanges={onPageChange}
          totalItems={totalCount}
          itemPerPage={itemPerPage}
          currentPage={currentPage}
        />
      </div>
    </Layout>
  )
}

export default FeedbackSupport