import _ from "lodash"
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import ConformationModal from '../../Components/ConformationModal/ConformationModal'
import Table from '../../Components/DataTable/Table'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import UpdateNotification from '../../Components/Notification/EditComponent/UpdateNotification'
import ScheduledNotification from '../../Components/Notification/ScheduledNotification'
import SendNotificationModal from '../../Components/Notification/SendNotificationModal'
import Pagination from '../../Components/Pagination/Pagination'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import Layout from '../../Layout/Layout'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import { dateTimeConverter } from '../../utils/commonFunction/dateTimeConverter'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'

const Notification = () => {
  const [filter, setFilter] = useState(null);

  const [search, setSearch] = useState(null);
  const [resetFilter, setResetFilter] = useState(false);
  const [notificationData, setNotificationData] = useState({
    data: [],
    count: 0,
  })
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(null);

  useEffect(() => {
    if (hasAccess(accessKeys?.getNotifications)) {
      getNotifications();
    }
  }, [currentPage, search, filter, resetFilter, sort])

  function statusDropDown(event) {
    setCurrentPage(1);
    if (event === "Normal") {
      setSort(null);
      setFilter("normal");
    } else if (event === "Popup") {
      setSort(null);
      setFilter("popup");
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
    setResetFilter(false);
    return;
  }

  function resetFilters() {
    setResetFilter(true);
    setSearch(null);
    setFilter(null);
    setCurrentPage(1);
    setSort(null);
    document.getElementById("notification-search-field").value = null;
    return;
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  async function getNotifications() {
    loadingShow();
    let url = urlApi.getNotification + "?page=" + currentPage + "&limit=" + itemPerPage;
    if (search) {
      url = url + "&search=" + search;
    }
    if (filter) {
      url = url + "&filter=" + filter;
    }
    if (sort) {
      url = url + "&sort=" + sort;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setNotificationData({
        data: resp.data?.value,
        count: resp.data?.count,
      })
    } else {
      toast.error(resp.message)
    }
    return;
  }

  async function handleDelete(notificationId) {
    loadingShow();
    let resp = await getApi(urlApi.deleteNotification + "/" + notificationId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      getNotifications();
    } else {
      toast.error(resp.message);
    }
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
              Type
            </div>,
          selector: row => row.type,
          cell: row =>
            <div className='flex items-center gap-2 p-[10px]'>
              <p className=''>{row.type ?? "--"}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Title
            </div>,
          selector: row => row.title,
          cell: row =>
            <div className='flex items-center gap-2 p-[10px]'>
              <p className=''>{row.title ?? "--"}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Image
            </div>,
          grow: 1.5,
          selector: row => row.imageUrl,
          cell: row =>
            <div className='flex items-center gap-2 p-[10px]'>
              <img className='min-w-[85px] h-[50px] rounded-lg' src={row?.imageUrl} alt='sc' onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
              }} />
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Message
            </div>,
          center: true,
          selector: row => row.text,
          cell: row =>
            <div>
              <p>{row.text ?? "--"}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Scheduled
            </div>,
          center: true,
          selector: row => dateTimeConverter(row?.scheduled),
          cell: row =>
            <div>
              <p>{dateTimeConverter(row?.scheduleDate)}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Action
            </div>,
          center: true,
          cell: row =>
            <div className='flex items-center gap-2 cursor-pointer'>
              {hasAccess(accessKeys?.notificationScheduleUpdate) && <ScheduledNotification date={row?.scheduleDate} notificationID={row?._id} callback={() => getNotifications()} />}

              {(hasAccess(accessKeys?.sendNotification) && hasAccess(accessKeys?.editNotification)) && <UpdateNotification data={row} />}

              {hasAccess(accessKeys?.deleteNotification) && <ConformationModal bodyText={"Are You Sure Delete This Notification"} components={<i className="fa fa-trash-o fa-lg text-primary-red" aria-hidden="true"></i>}
                handleOperation={() => handleDelete(row?._id)} />}
            </div>,
        }
      ]
    )
  }, [notificationData])


  function onSearch(searchData) {
    if (searchData.length === 0) {
      setSearch(null);
      setCurrentPage(1);
      return;
    }
    if (searchData) {
      setCurrentPage(1);
      setSearch(searchData);
    } else {
      toast.error("Invalid Search!!!")
    }
    return;
  }

  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("notification-search-field")?.value.trim()), 500);

  return (
    <Layout>
      <div className='h-auto w-full bg-white-color rounded-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
        <div className='font-semibold text-base sm:w-auto order-[1]'>
          {hasAccess(accessKeys?.createNotification) && <SendNotificationModal callback={() => getNotifications()} />}
        </div>
        <div className='search-container mt-1 sm:mt-2 md:m-0 xl:m-0 w-full sm:w-full md:w-1/2 order-[3] sm:order-[2] my-2'>
          <SearchInputField width={"100%"} bgColor={"#ffffff"} onChange={(e) => functionDebounce(e)} inputId={"notification-search-field"} onClick={() => onSearch(document.getElementById("notification-search-field")?.value.trim())} />
        </div>
        <div className='flex justify-start sm:justify-start md:justify-start lg:justify-center min-w-[190px] filter-container items-center gap-3 order-[2] sm:order-[3] my-2'>
          <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
            options={["All", "Normal", "Popup", "Time ASC", "Time DESC"]}
            defaultOption={"Filter"} reset={resetFilter} />
          <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
        </div>
      </div>

      <div className='h-auto mt-4 w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
        <div className='font-semibold text-base sm:w-auto order-[1]'>
          Notification Listing
        </div>
        <div className='flex filter-container items-center gap-3 order-[2] sm:order-[3]'>
          {/* <IconDots size={24} cursor={"pointer"} /> */}
        </div>
      </div>
      <Table
        columns={columns}
        data={notificationData?.data}
      />
      <div className='shadow-md w-full ease-in duration-200'>
        <Pagination onPageChanges={onPageChange}
          totalItems={notificationData?.count}
          itemPerPage={itemPerPage}
          currentPage={currentPage}
        />
      </div>
    </Layout>
  )
}

export default Notification