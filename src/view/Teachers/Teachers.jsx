import { IconFileExport } from '@tabler/icons-react'
import _ from "lodash"
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import AccessToggle from '../../Components/AccessToggle/AccessToggle'
import MultiIconButtonUI from '../../Components/Buttons/MultiIconButtonUI'
import ConformationModal from '../../Components/ConformationModal/ConformationModal'
import Table from '../../Components/DataTable/Table'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import Pagination from '../../Components/Pagination/Pagination'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import AccessDetailsModal from '../../Components/TeachersComponents/AccessDetailsModal'
import AddTeachers from '../../Components/TeachersComponents/AddTeachers'
import EditTeacherForm from '../../Components/TeachersComponents/EditTeacherForm'
import ImportTeachersModal from '../../Components/TeachersComponents/ImportTeachersModal'
import LoginHistory from '../../Components/TeachersComponents/LoginHistory'
import TeachersEditModal from '../../Components/TeachersComponents/TeachersEditModal'
import Layout from '../../Layout/Layout'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import { addDefaultImg } from '../../utils/commonFunction/defaultImage'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { CSVLink } from 'react-csv'


const Teachers = () => {
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState(null);
  const [teachersList, setTeachersList] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [resetFilter, setResetFilter] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState(null);
  const [exportData, setSetExportData] = useState([]);
  const [accesses] = useState({
    loginHistory: hasAccess(accessKeys?.loginHistory),
    editProfileById: hasAccess(accessKeys?.editProfileById),
    updateAccess: hasAccess(accessKeys?.updateAccess),
    deactivateTeacher: hasAccess(accessKeys?.deactivateTeacher),
    activateTeacher: hasAccess(accessKeys?.activateTeacher),
    getTeachers: hasAccess(accessKeys?.getTeachers)
  })

  useEffect(() => {
    if (accesses?.getTeachers) {
      getTeachersList();
    }
  }, [currentPage, filter, sort, search, resetFilter])

  async function getTeachersList() {
    loadingShow();
    let url = urlApi.getTeachers + "?page=" + currentPage + "&limit=" + itemPerPage;
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
      setTeachersList(resp?.data?.value);
      setTotalCount(resp?.data?.count);
    } else {
      toast.error(resp.message);
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
    setCurrentId(null);
    setOpenEditModal(false);
    setSetExportData([]);
    setResetFilter(false);
    setCurrentPage(1);
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
    setOpenEditModal(false);
    setCurrentId(null);
  };

  function handleEditTeachers() {
    setOpenEditModal(true);
    return;
  }

  function handleClick(row) {
    setSelectedRowData(row);
    setCurrentId(row?._id);
    setCurrentId(null);
    return;
  }


  function resetFilters() {
    setOpenEditModal(false);
    setResetFilter(true);
    setCurrentPage(1);
    setFilter(null);
    setSort(null);
    setSearch(null);
    setSetExportData([]);
    setCurrentId(null);
    document.getElementById("teacher-search-field").value = null;
    return;
  }



  async function handleActiveTeachers(teachersId) {
    loadingShow();
    let resp = await getApi(urlApi.activeTeachers + teachersId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      getTeachersList();
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function handleInactiveTeachers(teachersId) {
    loadingShow();
    let resp = await getApi(urlApi.inactiveTeachers + teachersId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      getTeachersList();
    } else {
      toast.error(resp.message);
    }
    return;
  }

  const columns = useMemo(() => {
    return ([
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
        selector: row => row?.title,
        width: "200px",
        cell: row =>
          <div className='flex items-center gap-2 p-[10px]'>
            <img className='w-[40px] h-[40px] rounded-full object-contain' src={row?.profilePic ?? "null"} alt={row?.teacherName}
              onError={({ currentTarget }) => { addDefaultImg(currentTarget) }}
            />
            <p className='cursor-default'>{row?.teacherName}</p>
          </div>
      },
      {
        name:
          <div className='font-semibold'>
            Mobile No
          </div>,
        grow: 1,
        center: true,
        selector: row => row?.phone,
        cell: row => row?.phone,
      },
      {
        name:
          <div className='font-semibold'>
            Email ID
          </div>,
        grow: 1,
        selector: row => row?.email ?? "N/A",
        cell: row => row?.email ?? <p className='text-red-500'>N/A</p>,
      },
      {
        name:
          <div className='font-semibold'>
            Status
          </div>,
        omit: (!accesses?.deactivateTeacher && !accesses?.activateTeacher),
        center: true,
        cell: row =>
          <div>
            <ConformationModal bodyText={row?.status === 1 ? "Are You Sure to Inactive Teachers" : "Are You Sure to Active Teachers"} components={<AccessToggle defaultChecked={row?.status === 1 ? true : false} />}
              handleOperation={row?.status === 1 ? () => handleInactiveTeachers(row?._id) : () => handleActiveTeachers(row?._id)} />
          </div>,
      },
      {
        name:
          <div className='font-semibold'>
            Update Profile
          </div>,
        center: true,
        omit: !accesses?.editProfileById,
        cell: row =>
          <div className='flex items-center gap-2 cursor-pointer'>
            {accesses?.editProfileById && <i title='Edit Teacher Details' className={`fa fa-edit fa-lg ${currentId === row?._id ? "text-white" : "text-table-buttons-color"}`} aria-hidden="true" onClick={() => { handleEditTeachers(); handleClick(row) }}></i>}
          </div>,
      },
      {
        name:
          <div className='font-semibold'>
            Access
          </div>,
        center: true,
        omit: !accesses?.updateAccess,
        cell: row =>
          <div className='flex items-center gap-2 cursor-pointer'>
            {accesses?.updateAccess && <AccessDetailsModal current_id={currentId} data={row} callBack={() => handleClick(row)} clearCallBack={() => setCurrentId(null)} />}
          </div>,
      },
      {
        name:
          <div className='font-semibold'>
            Login History
          </div>,
        center: true,
        omit: !accesses?.loginHistory,
        cell: row =>
          <div className='flex items-center gap-2 cursor-pointer'>
            <LoginHistory current_id={currentId} data={row} callBack={() => handleClick(row)} clearCallBack={() => setCurrentId(null)} />
          </div>,
      }
    ])
  }, [teachersList, accesses, currentId, currentPage, handleActiveTeachers, handleInactiveTeachers, itemPerPage])


  const conditionalRowStyles = [
    {
      when: row => row?._id === currentId,
      style: {
        backgroundColor: 'var(--primary-blue)',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: 'var(--primary-blue)',
          color: 'white'
        },
      },
    },
  ];

  function onSearch(searchData) {
    setOpenEditModal(false);
    if (searchData.length === 0) {
      setSearch(null);
      setCurrentPage(1);
      getTeachersList();
      return;
    }
    if (searchData) {
      setCurrentPage(1);
      setSearch(searchData);
      getTeachersList();
    } else {
      toast.error("Invalid Search!!!")
    }
    return;
  }

  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("teacher-search-field")?.value.trim()), 500);

  async function exportTeacherList() {
    loadingShow();
    let url = urlApi.exportAllTeacher;
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

  return (
    <Layout>
      <div className='flex mb-[25px] sm:flex-wrap justify-between sm:justify-between gap-4 sm:gap-4'>
        <div>
          {hasAccess(accessKeys?.addTeacher) && <AddTeachers callback={() => { getTeachersList(); }} />}
        </div>
        <div className='flex item-center gap-2 sm:'>
          {exportData.length === 0 && hasAccess(accessKeys?.getTeachersForExport) ?
            <MultiIconButtonUI
              suffixIcon={<IconFileExport size={20} />}
              variant='fill'
              text='Export'
              color={"var(--primary-blue)"}
              onClick={() => exportTeacherList()}
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
          {hasAccess(accessKeys?.teacherAddList) && <ImportTeachersModal callback={() => getTeachersList()} />}
        </div>
      </div>

      <div className="flex items-start">
        <div className='shadow-md w-full ease-in duration-200'>
          <div className='h-auto w-full bg-white-color rounded-t-2xl p-3 flex flex-wrap justify-between items-center'>
            <div className='font-semibold text-base sm:w-auto  order-[1]'>
              Teachers Listing
            </div>
            <div className='search-container w-full sm:w-full lg:w-1/2 order-[3] sm:order-[2] my-2'>
              <SearchInputField onChange={(e) => functionDebounce(e)} width={"100%"} bgColor={"#ffffff"} inputId={"teacher-search-field"} onClick={() => onSearch(document.getElementById("teacher-search-field")?.value.trim())} />
            </div>
            <div className='flex min-w-[190px] justify-start sm:justify-start md:justify-start lg:justify-center filter-container items-center  gap-3 order-[2] sm:order-[3]'>
              <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
                options={["All", "Active", "Inactive", "Time ASC", "Time DESC"]}
                defaultOption={"Filter"} reset={resetFilter} />
              <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
            </div>
          </div>
          <div className='w-full'>
            <Table
              columns={columns}
              data={teachersList}
              conditionalRowStyles={conditionalRowStyles}
            />
            <Pagination onPageChanges={onPageChange}
              totalItems={totalCount}
              itemPerPage={itemPerPage}
              currentPage={currentPage}
            />
          </div>
        </div>

        {
          window.innerWidth <= 1500 ?
            <div>
              {hasAccess(accessKeys?.editProfileById) && <TeachersEditModal
                teacherData={selectedRowData}
                show={openEditModal}
                onHide={() => { setOpenEditModal(false); setCurrentId(null) }}
                callback={() => getTeachersList()}
              />}
            </div>
            :
            openEditModal && hasAccess(accessKeys?.editProfileById) && <EditTeacherForm teacherData={selectedRowData} onClick={() => { setOpenEditModal(false); setCurrentId(null) }} callback={() => { getTeachersList(); setOpenEditModal(false) }} />
        }
      </div>
    </Layout>
  )
}
export default Teachers