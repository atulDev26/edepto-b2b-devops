import React, { useEffect, useState } from 'react'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import Table from '../../Components/DataTable/Table'
import ViewInvoice from '../../Components/Invoice/ViewInvoice'
import Pagination from '../../Components/Pagination/Pagination'
import Layout from '../../Layout/Layout'
import { dateTimeConverter } from '../../utils/commonFunction/dateTimeConverter'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'

const Invoices = () => {
  const [filter, setFilter] = useState("");
  const [resetFilter, setResetFilter] = useState(false);
  const [data, setData] = useState({
    data: [],
    count: 0,
  });
  const [currentGstInfo, setCurrentGstInfo] = useState({});
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getInvoice();
    getGstInfo();
  }, [currentPage])



  function statusDropDown(event) {
    setFilter(event);
    setResetFilter(false);
    return;
  }
  function resetFilters() {
    setResetFilter(true);
    return;
  }

  async function getInvoice() {
    loadingShow();
    let resp = await getApi(urlApi.getInvoice + "?page=" + currentPage + "&limit=" + itemPerPage);
    loadingHide();
    if (resp.responseCode === 200) {
      setData({
        data: resp?.data?.value,
        count: resp?.data?.count,
      });
    } else {
      setData([]);
    }
    return;
  }


  async function getGstInfo() {
    loadingShow();
    let resp = await getApi(urlApi.getGst);
    loadingHide();
    if (resp.responseCode === 200) {
      setCurrentGstInfo(resp.data);
    } else {
      setCurrentGstInfo({});
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
      cell: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage),
    },
    {
      name:
        <div className='font-semibold'>
          Invoice
        </div>,
      selector: row => <p className='text-primary-blue'>{row?.invoiceId ?? "--"}</p>,
      cell: row => (
        <div className=''>
          {
            row?.invoiceId ?? "--"
          }
        </div>
      )
    },
    {
      name:
        <div className='font-semibold'>
          Invoice
        </div>,
      width: "80px",
      selector: row => <p className='text-primary-blue'>{row?.planName}</p>,
      cell: row => (
        <div className=''>
          {
            row?.planName
          }
        </div>
      )
    },
    {
      name:
        <div className='font-semibold'>
          Billing Date
        </div>,
      center: true,
      selector: row => row?.createdAt,
      cell: row => (
        <div className=''>
          {dateTimeConverter(row?.createdAt) ?? "---"}
        </div>
      )
    },
    {
      name:
        <div className='font-semibold'>
          Price
        </div>,
      center: true,
      selector: row => row?.price,
      cell: row => (
        <div className=''>
          ₹{row?.price ?? "---"}
        </div>
      )
    },
    {
      name:
        <div className='font-semibold'>
          Tax
        </div>,
      center: true,
      selector: row => row?.tax,
      cell: row => (
        <div className=''>
          ₹{row?.tax ?? "---"}
        </div>
      )
    },
    {
      name:
        <div className='font-semibold'>
          Total
        </div>,
      center: true,
      selector: row => row?.totalPrice,
      cell: row => (
        <div className=''>
          ₹{row?.totalPrice ?? "---"}
        </div>
      )
    },
    {
      name:
        <div className='font-semibold'>
          Status
        </div>,
      width: "100px",
      selector: row => <p className='text-primary-blue'>{row?.statusString}</p>,
      cell: row => (
        <div className='flex flex-wrap'>
          {
            <p className={row?.status === 1 ? "text-primary-green" : "text-primary-red"}>{row?.statusString}</p>
          }
        </div>
      )
    },
    {
      name:
        <div className='font-semibold'>
          Action
        </div>,
      center: true,
      cell: row =>
        <div className='flex items-center gap-2 cursor-pointer'>
          <ViewInvoice invoiceData={row} />
        </div>,
    }
  ]


  return (
    <Layout>
      <div className='bg-white-color rounded-2xl p-4 shadow-sm mb-3'>
        <div className='grid grid-cols-2'>
          <p className='font-semibold text-base'>GST Details</p>
        </div>
        {currentGstInfo?.gst?.status == 1 ? <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-6 gap-2'>
          <div className='col-span-1 sm:col-span-1 md:col-span-1 flex justify-center items-center'>
            <img className='w-[40px] h-[40px]' src={currentGstInfo?.logo} alt="" />
          </div>
          <div className='col-span-1 sm:col-span-1 md:col-span-1'>
            <div className="flex flex-col ">
              <>
                <p className='font-semibold text-sm'>Company Name</p>
                <p className='text-[#475569] p-1'>{currentGstInfo?.gst?.organizationName}</p>
              </>
              <>
                <p className='font-semibold text-sm mt-2'>GST Number</p>
                <p className='text-[#475569] text-wrap p-1'>{currentGstInfo?.gst?.gstNumber}</p>
              </>
            </div>

          </div>
          <div className='col-span-1 sm:col-span-1 md:col-span-2'>
            <p className='font-semibold text-sm'>Registered Address</p>
            <p className='text-[#475569]'>{currentGstInfo?.gst?.address}</p>
          </div>
          <div className='col-span-1 sm:col-span-1 md:col-span-1 flex flex-col justify-start      items-start lg:items-center'>
            <p className='font-semibold text-sm'>Status</p>
            <div className={`w-[90px] ${currentGstInfo?.gst?.status == 1 ? "bg-primary-blue" : currentGstInfo?.gst?.status == 2 ? "bg-primary-red" : "bg-primary-yellow"} rounded-xl flex justify-center p-2 text-white-color font-normal cursor-default`}>
              {
                currentGstInfo?.gst?.status == 1 ? <p>Active</p> : currentGstInfo?.gst?.status == 2 ? <p>Inactive</p> : <p>Pending</p>
              }
            </div>
          </div>
          <div className='col-span-1 sm:col-span-1 md:col-span-1 '>
            <p className='font-semibold text-sm'> EDWID TECHNOLOGIES GST Number</p>
            <p className='text-[#475569] p-1'>19AAHCE8310M1ZA</p>
            <p className='font-semibold text-sm mt-2'> PAN Number</p>
            <p className='text-[#475569] p-1'>AAHCE8310M</p>
          </div>
        </div> : <p className='text-primary-red text-center font-medium'>GST Not Registered Yet</p>}
      </div>


      <div className='h-auto w-full bg-white-color rounded-tr-3xl rounded-tl-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
        <div className='font-semibold text-base sm:w-auto order-[1]'>
          Billing List
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

export default Invoices