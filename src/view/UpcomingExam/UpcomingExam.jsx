import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../Layout/Layout'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import { toast } from 'sonner';
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter';
import ResetFilter from '../../Components/DropDown/ResetFilter';
import Table from '../../Components/DataTable/Table';
import Pagination from '../../Components/Pagination/Pagination';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { getApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import UpComingExamAdd from '../../Components/UpComingExamComponents/UpComingExamAdd';
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber';
import { dateTimeConverter, extractDate } from '../../utils/commonFunction/dateTimeConverter';
import { Link } from 'react-router-dom';
import UpComingExamEdit from '../../Components/UpComingExamComponents/UpComingExamEdit';
import { IconTrash } from '@tabler/icons-react';
import ConformationModal from '../../Components/ConformationModal/ConformationModal';
import _ from "lodash"
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';


const UpcomingExam = () => {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState(null);
  const [resetFilter, setResetFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(5);
  const [upComingData, setUpComingData] = useState({
    data: [],
    count: 0
  })
  const [accesses] = [{
    edit: hasAccess(accessKeys?.editUpcomingTest),
    delete: hasAccess(accessKeys?.deleteUpcomingTest),
  }]

  useEffect(() => {
    if (hasAccess(accessKeys?.getUpcomingTests)) {
      getUpcomingExam()
    }
  }, [filter, search, currentPage])

  async function getUpcomingExam() {
    loadingShow();
    let url = urlApi.getUpComingTest + "?page=" + currentPage + "&limit=" + itemPerPage;
    if (search) {
      url = url + "&search=" + search;
    } if (filter) {
      url = url + "&sort=" + filter;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setUpComingData({
        data: resp?.data?.value,
        count: resp?.data?.count
      })
    } else {
      toast.error(resp.message);
    }
    return;
  }
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  async function handleDelete(UpcomingExamId) {
    loadingShow();
    let url = urlApi.deleteUpComingTest + UpcomingExamId;
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      getUpcomingExam();
    }
    else {
      toast.error(resp.message)
    }
    return;
  }

  let columns = useMemo(() => {
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
              Exam Name
            </div>,
          selector: row => row?.exam,
          cell: row => (
            <p className='font-semibold text-primary-blue'>{row?.exam ?? "--"}</p>
          )
        },
        {
          name:
            <div className='font-semibold'>
              Conducting Authority
            </div>,
          selector: row => row?.conductingAuthority,
          cell: row => (
            <p className='font-semibold text-slate-600'>{row?.conductingAuthority ?? "--"}</p>
          )
        },
        {
          name:
            <div className='font-semibold'>
              Post Name
            </div>,
          selector: row => row?.postName,
          cell: row => (
            <div className='font-semibold text-[#E3A4BF] rounded-md outline outline-2  w-fit px-2 py-1 bg-[#FFEFF6]'>{row?.postName ?? "--"}</div>
          )
        },
        {
          name:
            <div className='font-semibold'>
              Vacancy
            </div>,
          selector: row => row?.vacancy,
          cell: row => (
            <div className='font-semibold text-[#3D9D70] rounded-md w-fit px-2 py-1 bg-[#D8FFED]'>{row?.vacancy ?? "--"}</div>
          )
        },
        {
          name:
            <div className='font-semibold'>
              Post Date
            </div>,
          selector: row => row?.postDate,
          sortable: true,
          sortField: 'Post Date',
          cell: row => (
            <div className='font-semibold text-[#3D9D70] rounded-md w-fit px-2 py-1'>{extractDate(row?.postDate) ?? "--"}</div>
          )
        },
        {
          name:
            <div className='font-semibold'>
              Last Apply Date
            </div>,
          selector: row => row?.lastApplyDate,
          cell: row => (
            <div className='font-semibold text-[#E3A4BF] rounded-md w-fit px-2 py-1'>{extractDate(row?.lastApplyDate) ?? "--"}</div>
          )
        },
        {
          name:
            <div className='font-semibold'>
              Admit Card Date
            </div>,
          selector: row => row?.admitCardDate,
          cell: row => (
            <div className='font-semibold text-slate-600 rounded-md w-fit px-2 py-1'>{extractDate(row?.admitCardDate) ?? "TBA"}</div>
          )
        },
        {
          name: <p className='font-semibold'>ExamDate</p>,
          wrap: true,
          selector: row => (
            <div>
              <p className='font-semibold text-slate-600'>{row?.examDate ? extractDate(row?.examDate) : <p className='font-semibold text-slate-600'>TBA</p>}</p>
            </div>
          )
        },
        {
          name: <p className='font-semibold'>Result Date</p>,
          wrap: true,
          selector: row => (
            <div>
              <p className='font-semibold text-slate-600'>{row?.resultDate ? extractDate(row?.resultDate) : <p className='font-semibold text-slate-600'>TBA</p>}</p>
            </div>
          )
        },
        {
          name: <p className='font-semibold'>Blog URL</p>,
          wrap: true,
          center: true,
          selector: row => (
            <>
              {row?.blogLink ? <Link to={row?.blogLink} target='blank'>
                <i className="fa fa-link fa-lg text-[#3D9D70]" aria-hidden="true"></i>
              </Link> : <p className='font-semibold text-slate-600'>TBA</p>}
            </>

          )
        },
        {
          name: <p className='font-semibold'>Job URL</p>,
          wrap: true,
          center: true,
          selector: row => (
            <>
              {row?.jobNotificationLink ? <Link to={row?.jobNotificationLink} target='blank'>
                <i className="fa fa-link fa-lg text-[#3D9D70]" aria-hidden="true"></i>
              </Link> : <p className='font-semibold text-slate-600'>TBA</p>}
            </>

          )
        },
        {
          name: <p className='font-semibold'>Eligibility</p>,
          wrap: true,
          selector: row => (
            <div className='font-semibold text-slate-600 rounded-md w-fit px-2 py-1'>{row?.eligibility ?? "---"}</div>
          )
        },
        {
          name: <p className='font-semibold'>Created & Updated At</p>,
          wrap: true,
          width: "140px",
          selector: row => row?.createdAt,
          cell: row => (
            <div>
              <p className='font-semibold text-sm text-slate-600 rounded-md w-fit px-2 py-1'>{dateTimeConverter(row?.createdAt) ?? "---"}</p>
              <p className='font-semibold text-sm text-slate-600 rounded-md w-fit px-2 py-1'>{dateTimeConverter(row?.updatedAt) ?? "---"}</p>
            </div>
          )
        },
        {
          name: <p className='font-semibold'>Action</p>,
          wrap: true,
          omit: !(accesses?.edit || accesses?.delete),
          cell: row => (
            <div className='flex gap-2 items-center justify-center '>
              {accesses?.edit && <UpComingExamEdit callback={() => getUpcomingExam()} data={row} />}
              <ConformationModal components={<IconTrash size={20} className='text-primary-red' />} handleOperation={() => handleDelete(row?._id)} />
            </div>
          )
        },
      ])
  }, [upComingData, accesses])

  function onSearch(searchData) {
    if (searchData?.length === 0) {
      setCurrentPage(1);
      setSearch(null);
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
    } if (event === "Application Deadline(⬆)")
      setFilter("lastApplyDate,DESC");
    if (event === "Admit Card Issue Date(⬆)") {
      setFilter("admitCardDate,DESC");
    } if (event === "Create At(⬆)") {
      setFilter("createdAt,ASC");
    } if (event === "Create At(⬇)") {
      setFilter("createdAt,DESC");
    } if (event === "Result Announcement Date(⬆)") {
      setFilter("resultDate,ASC");
    } if (event === "Result Announcement Date(⬇)") {
      setFilter("resultDate,DESC");
    } if (event === "Post Date(⬆)") {
      setFilter("postDate,ASC");
    } if (event === "Post Date(⬇)") {
      setFilter("postDate,DESC");
    }
    return;
  }

  function resetFilters() {
    setResetFilter(true);
    setCurrentPage(1);
    setSearch(null);
    setFilter(null);
    document.getElementById("upComing-search-field").value = null;
    // getUpcomingExam();
    return;
  }

  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("upComing-search-field")?.value.trim()), 500);

  return (
    <Layout>
      <div className='flex mb-[25px] sm:flex-wrap justify-between sm:justify-between gap-4 sm:gap-4'>
        {hasAccess(accessKeys?.addUpcomingTest) && <div>
          <UpComingExamAdd callback={() => getUpcomingExam()} />
        </div>}
      </div>
      <div className='shadow-md w-full ease-in duration-200'>
        <div className="flex items-start">
          <div className=' shadow-md w-full ease-in duration-200'>
            <div className='h-auto w-full bg-white-color rounded-t-2xl p-3 flex flex-wrap justify-between items-center'>
              <div className='font-semibold text-base sm:w-auto  order-[1]'>
                UpComing Exam
              </div>
              <div className='search-container w-full sm:w-full md:w-1/2 order-[3] sm:order-[2] my-2'>
                <SearchInputField width={"100%"} bgColor={"#ffffff"} inputId={"upComing-search-field"} onClick={() => onSearch(document.getElementById("upComing-search-field")?.value.trim())}
                  onChange={(e) => functionDebounce(e)} />
              </div>
              <div className='flex min-w-[400px] filter-container justify-start sm:justify-start md:justify-start lg:justify-center items-center gap-3 order-[3] sm:order-[3] my-2'>
                <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
                  options={
                    [
                      "All",
                      "Application Deadline(⬆)",
                      "Admit Card Issue Date(⬆)",
                      "Create At(⬆)",
                      "Create At(⬇)",
                      // "Result Announcement Date(⬆)",
                      // "Result Announcement Date(⬇)",
                      "Post Date(⬆)",
                      "Post Date(⬇)"
                    ]
                  }
                  defaultOption={"Sort By"} reset={resetFilter} />
                <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
              </div>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <Table
            columns={columns}
            data={upComingData?.data}
          // customPagination={<div></div>}
          />
          <Pagination onPageChanges={onPageChange} totalItems={upComingData?.count}
            itemPerPage={itemPerPage} currentPage={currentPage} />
        </div>
      </div>
    </Layout>
  )
}

export default UpcomingExam