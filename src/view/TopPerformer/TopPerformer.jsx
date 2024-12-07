import _ from "lodash"
import React, { useEffect, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { toast } from 'sonner'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import Table from '../../Components/DataTable/Table'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import Pagination from '../../Components/Pagination/Pagination'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import Layout from '../../Layout/Layout'
import { accessKeys } from '../../utils/accessKeys.utils'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { hasAccess } from '../../utils/StaticData/accessList'

const TopPerformer = () => {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState(null);
  const [data, setData] = useState({
    data: [],
    count: 0,
  })
  const [resetFilter, setResetFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  useEffect(() => {
    if (hasAccess(accessKeys?.getTopPerformer)) {
      getTopPerformer();
    }
    return () => {
      setData({
        data: [],
        count: 0,
      });
    };
  }, [filter, currentPage, search, resetFilter])

  async function getTopPerformer() {
    loadingShow();
    let url = urlApi.topPerformer + "?page=" + currentPage + "&limit=" + itemPerPage;
    if (search) {
      url = url + "&search=" + search;
    }
    if (filter) {
      url = url + "&sort=" + filter;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setData({
        data: resp?.data?.value,
        count: resp.data?.count,
      })
    } else {
      toast.error(resp.message)
    }
    return;
  }

  function statusDropDown(event) {
    if (event === "All") {
      setFilter(null);
    } if (event === "Accuracy DESC") {
      setFilter("accuracy,DESC");
    } if (event === "Accuracy ASC") {
      setFilter("accuracy,ASC");
    } if (event === "AttemptRate DESC") {
      setFilter("attemptRate,DESC");
    } if (event === "AttemptRate ASC") {
      setFilter("attemptRate,ASC");
    }
    setResetFilter(false);
    return;
  }

  function resetFilters() {
    setFilter(null);
    setResetFilter(true);
    return;
  }
  function onSearch(searchData) {
    if (searchData.length === 0) {
      setSearch(null);
      setCurrentPage(1);
      getTopPerformer();
      return;
    }
    if (searchData) {
      setCurrentPage(1);
      setSearch(searchData);
      getTopPerformer();
    } else {
      toast.error("Invalid Search!!!")
    }
    return;
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const columns = [
    {
      name:
        <div className='font-semibold'>
          SL No
        </div>,
      center: true,
      width: "80px",
      selector: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage),
      cell: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage)
    },
    {
      name:
        <div className='font-semibold'>
          Name
        </div>,
      selector: row => row?.studentId?.name,
      center: true,
      wrap: true,
      width: "200px",
      cell: row =>
        <div className='flex items-center gap-2  p-[10px]'>
          <img className='max-w-[40px] max-h-[40px] w-[40px] h-[40px] rounded-full object-fill' src={row?.studentId?.profilePic} alt='sc' onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
          }} />
          <p className=''>{row?.studentId?.name ?? "--"}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Avg Daily Hrs
        </div>,
      selector: row => row.avgDaily,
      cell: row =>
        <div className='flex items-center gap-2 p-[10px]'>
          {/* <p>{convertSecondsToHours(row?.avgDaily ?? 0)}</p> */}
          <p>{row?.avgDaily.toFixed(2) ?? 0}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Weekly Hrs
        </div>,
      center: true,
      selector: row => row.avgWeekly,
      cell: row =>
        <div>
          {/* <p>{convertSecondsToHours(row.avgWeekly ?? 0)}</p> */}
          <p>{row?.avgWeekly.toFixed(2) ?? 0}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Total Test Attempts
        </div>,
      center: true,
      selector: row => row.totalTestAttempt,
      cell: row =>
        <div>
          <p>{row.totalTestAttempt}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Total Question
        </div>,
      center: true,
      selector: row => row.totalQuestion,
      cell: row =>
        <div>
          <p>{row.totalQuestion ?? "--"}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Correct
        </div>,
      center: true,
      selector: row => row.correctAnswer,
      cell: row =>
        <div>
          <p>{row.correctAnswer ?? "--"}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Incorrect
        </div>,
      center: true,
      selector: row => row.incorrectAnswer
      ,
      cell: row =>
        <div>
          <p>{row.incorrectAnswer ?? "--"}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Accuracy
        </div>,
      center: true,
      selector: row => (row.accuracy)?.toFixed(2),
      cell: row =>
        <div>
          <CircularProgressbar className='calendar-progress-bar'
            maxValue={100}
            value={(row.accuracy)?.toFixed(0)}
            text={`${(row.accuracy).toFixed(0)}%`}
            styles={{
              text: { fontSize: '22px', fontWeight: "600" },
              path: {
                stroke: row?.accuracy < 40 ? 'red' : row?.accuracy < 70 ? 'goldenrod' : 'green',
                strokeWidth: 8,
              },
              trail: {
                strokeWidth: 10,
              },
            }}
          />
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Attempt Rate
        </div>,
      center: true,
      grow: 1.8,
      selector: row => row.attempts_rate,
      cell: row =>
        <div className='p-2'>
          <CircularProgressbar className='calendar-progress-bar'
            maxValue={100}
            value={(row.attemptRate)?.toFixed(0)}
            text={`${(row.attemptRate)?.toFixed(0)}%`}
            styles={
              {
                text: { fontSize: '22px', fontWeight: "600" },
                path: {
                  stroke: row?.attemptRate < 40 ? 'red' : row?.attempts_rate < 70 ? 'goldenrod' : 'green',
                  strokeWidth: 8,
                },
                trail: {
                  strokeWidth: 10,
                },
              }}
          />
        </div>
    }
  ]


  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("topPerFormer-search-field")?.value.trim()), 500);

  return (
    <Layout>
      <div className='h-auto w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
        <div className='font-semibold text-base sm:w-auto order-[1]'>
          Performer Listing
        </div>
        <div className='search-container mt-1 sm:mt-2 md:m-0 xl:m-0 w-full sm:w-full md:w-1/2 order-[3] sm:order-[2] my-2'>
          <SearchInputField onChange={(e) => functionDebounce(e)} width={"100%"} bgColor={"#ffffff"} inputId={"topPerFormer-search-field"} onClick={() => onSearch(document.getElementById("topPerFormer-search-field")?.value.trim())} />
        </div>
        <div className='flex min-w-[200px] filter-container items-center mb-[10px] gap-3 order-[2] sm:order-[3]'>
          <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
            options={["All", "Accuracy DESC", "Accuracy ASC", "AttemptRate DESC", "AttemptRate ASC"]}
            defaultOption={"Filter"} reset={resetFilter} />
          <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
        </div>
      </div>
      <div className='shadow-md w-full ease-in duration-200'>
        <Table
          columns={columns}
          data={data?.data}
        />
        <Pagination onPageChanges={onPageChange}
          totalItems={data?.count}
          itemPerPage={itemPerPage}
          currentPage={currentPage}
        />
      </div>

    </Layout>

  )
}

export default TopPerformer 