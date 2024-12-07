import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';
import { dateTimeConverter } from '../../utils/commonFunction/dateTimeConverter';
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import ToggleSwitch from '../Buttons/ToggleSwitch';
import ConformationModal from '../ConformationModal/ConformationModal';
import Table from '../DataTable/Table';
import Pagination from '../Pagination/Pagination';
import EditBanner from './EditBanner';

const Banner = ({ bannerData, callback, itemPerPage, currentPage, onPageChange }) => {
  const [accesses] = [{
    editBanner: hasAccess(accessKeys?.editBanner),
    statusToggle: hasAccess(accessKeys?.activateBannerStatus) && hasAccess(accessKeys?.deactivateBannerStatus),
  }]

  async function handleActiveBanner(bannerId) {
    loadingShow();
    let resp = await getApi(urlApi.activeStatus + bannerId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      if (callback) {
        callback();
      }
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function handleDeactiveBanner(bannerId) {
    loadingShow();
    let resp = await getApi(urlApi.deactiveStatus + bannerId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      if (callback) {
        callback();
      }
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
              Name
            </div>,
          selector: row => row.name,
          cell: row =>
            <div className='flex items-center gap-2 p-[10px]'>
              <p className='font-semibold'>{row.name ?? "--"}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Image
            </div>,
          center: true,
          grow: 1.5,
          selector: row => row.image,
          cell: row =>
            <div className='flex items-center gap-2 p-[10px]'>
              <img className='max-w-[85px] w-[85px] h-[50px] object-contain  rounded-md' src={row?.image} alt='sc' onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
              }} />
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Route
            </div>,
          center: true,
          selector: row => row.route?.pageName,
          cell: row =>
            <div>
              <Link to={row.route?.value} target='_blank' >
                <p className='font-medium text-primary-blue'>{row.route?.pageName ?? "--"}</p>
              </Link>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Order
            </div>,
          center: true,
          width: "80px",
          selector: row => row.order,
          cell: row =>
            <div>
              <p>{row.order ?? "--"}</p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Date & Time
            </div>,
          center: true,
          selector: row => row.date_time,
          cell: row =>
            <div className='py-2'>
              <p className="m-0 text-primary-blue" style={{ fontWeight: "600" }}>Created At:&nbsp;<span className='text-blue-950' style={{ fontWeight: "500" }}>{dateTimeConverter(row.createdAt || "---")}</span></p>
              <br />
              <p className="m-0 text-primary-blue" style={{ fontWeight: "600" }}>Updated At:&nbsp;<span className='text-blue-950' style={{ fontWeight: "500" }}>{dateTimeConverter(row.updatedAt || "---")}</span></p>
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Status
            </div>,
          center: true,
          omit: !(accesses?.statusToggle),
          selector: row => row.route?.status,
          cell: row => (
            hasAccess(accessKeys?.activateBannerStatus) && hasAccess(accessKeys?.deactivateBannerStatus) &&
            <>
              <ConformationModal bodyText={row?.status ? "Are You Sure to Deactive Banner" : "Are You Sure to Active Banner"} components={<ToggleSwitch defaultChecked={row?.status} />}
                handleOperation={row?.status ? () => handleDeactiveBanner(row?._id) : () => handleActiveBanner(row?._id)} />
            </>
          )
        },
        {
          name:
            <div className='font-semibold'>
              Action
            </div>,
          omit: !(accesses?.editBanner),
          center: true,
          cell: row =>
            <div className='flex items-center gap-2 cursor-pointer'>
              {(hasAccess(accessKeys?.editBanner) && hasAccess(accessKeys?.getBannerById)) && <EditBanner data={row} callback={() => callback()} />}
            </div>,
        },
      ])
  }, [bannerData, accesses])

  return (
    <div>
      <Table
        columns={columns}
        data={bannerData?.data}
      />
      <Pagination onPageChanges={onPageChange}
        totalItems={bannerData?.count}
        itemPerPage={itemPerPage}
        currentPage={currentPage} />
    </div>
  )
}

export default Banner