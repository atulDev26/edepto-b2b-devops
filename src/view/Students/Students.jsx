import { IconBrandWhatsapp, IconFileExport } from '@tabler/icons-react'
import _ from "lodash"
import React, { useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import MultiIconButtonUI from '../../Components/Buttons/MultiIconButtonUI'
import Table from '../../Components/DataTable/Table'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import Pagination from '../../Components/Pagination/Pagination'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import AddStudents from '../../Components/StudentsComponents/AddStudents'
import ImportStudentList from '../../Components/StudentsComponents/ImportStudentList'
import PendingStudentListModal from '../../Components/StudentsComponents/PendingStudentListModal'
import Layout from '../../Layout/Layout'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import { addDefaultImg } from '../../utils/commonFunction/defaultImage'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import ConformationModal from '../../Components/ConformationModal/ConformationModal'
import ToggleSwitch from '../../Components/Buttons/ToggleSwitch'


const Students = () => {
  const navigate = useNavigate();
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentList, setStudentList] = useState({
    data: [],
    count: 0
  });
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(null);
  const [resetFilter, setResetFilter] = useState(false);
  const [exportData, setSetExportData] = useState([]);
  const [accesses] = useState({
    editPass: hasAccess(accessKeys?.editMyPass)
  })


  useEffect(() => {
    if (hasAccess(accessKeys?.getStudentList)) {
      getStudentList();
    }
  }, [currentPage, filter, sort, search, resetFilter])


  async function getStudentList() {
    loadingShow();
    let url = urlApi?.studentList + "?page=" + currentPage + "&limit=" + itemPerPage;
    if (search) {
      url = url + "&search=" + search;
    }
    if (filter) {
      url = url + "&filterByStatus=" + filter;
    } if (sort) {
      url = url + "&sort=" + sort;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setStudentList({
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

  function onSearch(searchData) {
    if (searchData.length === 0) {
      setSearch(null);
      setCurrentPage(1);
      getStudentList();
      return;
    }
    if (searchData) {
      setCurrentPage(1);
      setSearch(searchData);
      getStudentList();
    } else {
      toast.error("Invalid Search!!!")
    }
    return;
  }
  function statusDropDown(event) {
    if (event === "Active") {
      setSort(null);
      setFilter(1);
    } else if (event === "Inactive") {
      setSort(null);
      setFilter(2);
    } else if (event === "All") {
      setSort(null);
      setFilter(null);
    } else if (event === "Time ASC") {
      setSort("createdAt,ASC");
      setFilter(null);
    } else if (event === "Time DESC") {
      setSort("createdAt,DESC");
      setFilter(null);
    }
    setSetExportData([]);
    setResetFilter(false);
    setCurrentPage(1);
    return;
  }

  function resetFilters() {
    setResetFilter(true);
    setCurrentPage(1);
    setFilter(null);
    setSort(null);
    setSearch(null);
    setSetExportData([]);
    document.getElementById("student-search-field").value = null;
    return;
  }

  function handleNavigation(studentId, studentName) {
    navigate(`/students/assign-pass/${studentName}/${studentId}`, { replace: true });
    return;
  }


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
              Name
            </div>,
          selector: row => row?.name,
          wrap: true,
          width: "200px",
          cell: row =>
          (hasAccess(accessKeys?.getStudentProfile) ?
            <Link to={`/students/student-profile/${row?._id}`} >
              <div className='flex items-center gap-2 p-[10px]'>
                <img className='w-[40px] h-[40px] rounded-full object-contain' src={row?.profilePic ?? "null"} alt={row?.teacherName}
                  onError={({ currentTarget }) => { addDefaultImg(currentTarget) }}
                />
                <p className='font-medium text-sm text-primary-blue'>{row.name}</p>
              </div>
            </Link> :
            <>
              <div className='flex items-center gap-2 p-[10px]'>
                <img className='w-[40px] h-[40px] rounded-full object-contain' src={row?.profilePic ?? "null"} alt={row?.teacherName}
                  onError={({ currentTarget }) => { addDefaultImg(currentTarget) }}
                />
                <p className='font-medium text-sm text-primary-blue'>{row.name}</p>
              </div>
            </>
          )

        },
        {
          name:
            <div className='font-semibold'>
              Status
            </div>,
          center: true,
          selector: row => row.status,
          cell: row =>
            <div className={`w-[70px] ${row.status == 1 ? "bg-primary-blue" : "bg-primary-red"} rounded-xl flex justify-center p-2 text-white-color font-normal cursor-default`}>
              {
                row?.status == 1 ? <p>{row?.statusString}</p> : <p>{row?.statusString}</p>
              }
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Mobile No
            </div>,
          center: true,
          selector: row => row?.mobileNumber,
        },
        {
          name:
            <div className='font-semibold'>
              ID No
            </div>,
          center: true,
          selector: row => row?.ID ?? "---"
        },
        {
          name:
            <div className='font-semibold'>
              Email ID
            </div>,
          selector: row => row.emailId,
        },
        {
          name:
            <div className='font-semibold'>
              Batch
            </div>,
          selector: row => row.batch,
        },
        {
          name:
            <div className='font-semibold'>
              Category
            </div>,
          center: true,
          selector: row => row.categoryString,
        },
        // {
        //   name:
        //     <div className='font-semibold'>
        //       Action
        //     </div>,
        //   center: true,
        //   omit: accesses?.editMyPass,
        //   cell: row =>
        //     <div className='flex items-center gap-2 cursor-pointer flex-wrap'>
        //       <button
        //         className="bg-inherit text-primary-blue font-semibold py-2 shadow-sm px-4 rounded-xl flex flex-wrap"
        //         style={{
        //           border: '1px solid var(--primary-blue)'
        //         }}
        //         onClick={() => handleNavigation(row?._id, row?.name)}
        //       >
        //         Pass
        //       </button>
        //     </div>,
        // },
        {
          name:
            <div className='font-semibold'>
              Pass
            </div>,
          center: true,
          omit: !accesses?.editPass,
          cell: row => (
            <>
              <ConformationModal bodyText={row?.isEnrolled == 1 ? "Are You Sure Wants to Revoke the Pass" : "Are You Sure Wants to Assign the Pass"} components={<ToggleSwitch defaultChecked={row?.isEnrolled == 1 ? true : false} />}
                handleOperation={row?.isEnrolled == 1 ? () => passStatusRevoke(row?._id) : () => passStatusAssign(row?._id)} />
            </>
          )

        },
        {
          name:
            <div className='font-semibold'>
              Whatsapp
            </div>,
          center: true,
          selector: row => row.mobileNumber,
          cell: row => <div className='cursor-pointer'>
            <Link to={`https://wa.me/+91${row?.mobileNumber}`} target="_blank">
              <IconBrandWhatsapp color={"#16622f"} />
            </Link>
          </div>
        },
      ])
  }, [accesses?.editMyPass, studentList])

  async function passStatusAssign(id) {
    loadingShow();
    let resp = await getApi(urlApi.enrolledStudent + id);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message)
      getStudentList()
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function passStatusRevoke(id) {
    loadingShow();
    let resp = await getApi(urlApi.revokeStudent + id);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message)
      getStudentList()
    } else {
      toast.error(resp.message);
    }
    return;
  }



  async function exportStudentList() {
    loadingShow();
    let url = urlApi.exportStudentList;
    if (filter) {
      url = url + "?filterByStatus=" + filter;
    } if (sort) {
      url = url + "?sort=" + sort;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setSetExportData(resp?.data)
      toast.success("Data Export Success click to Download");
    } else {
      toast.error(resp.message);
    }
    return;
  }

  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("student-search-field")?.value.trim()), 500);
  return (
    <Layout>
      <div className='flex mb-[25px] sm:flex-wrap justify-between sm:justify-between gap-4 sm:gap-4'>
        <div className='flex flex-col sm:flex-col md:flex-row lg:flex-row gap-3'>
          {(hasAccess(accessKeys?.addStudent)) && (<AddStudents callback={() => getStudentList()} />)}
          {hasAccess(accessKeys?.getPendingStudentList) && <PendingStudentListModal />}
        </div>
        <div className='flex flex-col sm:flex-col md:flex-row lg:flex-row  item-center gap-2'>
          {hasAccess(accessKeys?.getStudentExportList) &&
            exportData?.length === 0 ?
            <MultiIconButtonUI
              suffixIcon={<IconFileExport size={20} />}
              variant='fill'
              text='Export'
              color={"var(--primary-blue)"}
              onClick={() => exportStudentList()}
            /> :
            <>
              <CSVLink data={exportData}>
                <button type="button" aria-label={"Download Export"} className='flex justify-center items-center gap-2 rounded-xl text-white-color px-2 py-1 font-semibold text-xs sm:text-sm'
                  style={{
                    backgroundColor: "var(--primary-blue)",
                    border: `2px solid var(--primary-blue)`,
                    color: `white`,
                  }}
                >
                  <span className='w-full sm:w-full md:w-fit'>{"Download Export"}</span>
                  <IconFileExport size={20} />
                </button>
              </CSVLink>
            </>
          }
          {hasAccess(accessKeys?.studentAddList) &&
            <ImportStudentList callback={() => getStudentList()} />
          }
        </div>
      </div>
      <div className='shadow-md w-full ease-in duration-200'>
        <div className="flex items-start">
          <div className=' shadow-md w-full ease-in duration-200'>
            <div className='h-auto w-full bg-white-color rounded-t-2xl p-3 flex flex-wrap justify-between items-center'>
              <div className='font-semibold text-base sm:w-auto order-[1]'>
                Students Listing
              </div>
              <div className='search-container w-full sm:w-full md:w-1/2 lg:w-1/2 order-[3] sm:order-[2] my-2'>
                <SearchInputField onChange={(e) => functionDebounce(e)} width={"100%"} bgColor={"#ffffff"} inputId={"student-search-field"} onClick={() => onSearch(document.getElementById("student-search-field")?.value.trim())} />
              </div>
              <div className='flex min-w-[190px] justify-center w-fit filter-container items-center gap-3 order-[2] sm:order-[3]'>
                <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
                  options={["All", "Active", "Inactive", "Time ASC", "Time DESC"]}
                  defaultOption={"Filter"} reset={resetFilter} />
                <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
              </div>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <Table
            columns={columns}
            data={studentList?.data}
          // customPagination={<div></div>}
          />
          <Pagination onPageChanges={onPageChange} totalItems={studentList?.count}
            itemPerPage={itemPerPage} currentPage={currentPage} />
        </div>
      </div>

    </Layout>
  )
}

export default Students