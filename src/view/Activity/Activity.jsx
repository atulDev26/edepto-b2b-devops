import React, { useEffect, useState } from 'react'
import Layout from '../../Layout/Layout'
import { IconDeviceLaptop, IconDeviceMobile, IconDeviceTablet, IconDots } from '@tabler/icons-react'
import Table from '../../Components/DataTable/Table'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { toast } from 'sonner'
import Pagination from '../../Components/Pagination/Pagination'
import { convertIPv6toIPv4, formatDateString } from '../../utils/commonFunction/dateTimeConverter'

const Activity = () => {
  const [activity, setActivity] = useState({
    data: [],
    count: 0
  })
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    activityData();
  }, [currentPage])


  async function activityData() {
    loadingShow();
    let resp = await getApi(urlApi.getActivity + "?page=" + currentPage + "&limit=" + itemPerPage);
    loadingHide();
    if (resp.responseCode === 200) {
      setActivity({
        data: resp.data.value,
        count: resp.data.count
      })
    }
    else {
      toast.error(resp.message);
    }
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  function capitalizeFirstLetter(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const columns = [
    {
      name:
        <div className='font-semibold'>
          Event
        </div>,
      selector: row => row.eventString,
      cell: row =>
        <div className='flex items-center gap-2 p-[10px]'>
          <p className=''>{capitalizeFirstLetter(row?.eventString) ?? "--"}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Details
        </div>,
      selector: row => row.type,
      center: true,
      cell: row =>
        <div className='flex items-center gap-2 p-[10px]'>
          {
            row?.device === "Desktop" ? <p className=''>Your Are Login From {row?.device}</p> :
              <p className=''>Your Are Login From {row?.device}</p>
          }
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          IP Address
        </div>,
      selector: row => row.ip,
      center: true,
      cell: row =>
        <div className='flex items-center gap-2 p-[10px]'>
          <p className=''>{convertIPv6toIPv4(row.ip) ?? "--"}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Date & Time
        </div>,
      selector: row => row.dateTime,
      center: true,
      cell: row =>
        <div className='flex items-center gap-2 p-[10px]'>
          <p className=''>{formatDateString(row.dateTime) ?? "--"}</p>
        </div>
    },
    {
      name:
        <div className='font-semibold'>
          Device
        </div>,
      selector: row => row.device,
      cell: row =>
        <div className='flex items-center gap-2 p-[10px]'>
          {
            row?.device === "Desktop" ? <IconDeviceLaptop /> : <IconDeviceMobile />
          }
        </div>
    }

  ]
  return (
    <Layout>
      <div className='h-auto mt-4 w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
        <div className='font-semibold text-base sm:w-auto order-[1]'>
          Activity Events
        </div>
        <div className='flex filter-container items-center gap-3 order-[2] sm:order-[3]'>
          <IconDots size={24} cursor={"pointer"} />
        </div>
      </div>
      <Table
        columns={columns}
        data={activity?.data}
      />
      <Pagination onPageChanges={onPageChange}
        totalItems={activity?.count}
        itemPerPage={itemPerPage}
        currentPage={currentPage} />
    </Layout>
  )
}

export default Activity