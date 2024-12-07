import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { dateTimeConverter } from '../../utils/commonFunction/dateTimeConverter';
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import ToggleSwitch from '../Buttons/ToggleSwitch';
import ConformationModal from '../ConformationModal/ConformationModal';
import Table from '../DataTable/Table';
import Pagination from '../Pagination/Pagination';
import EditPopup from './EditPopup';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';

const Popup = ({ popUpData, callback, itemPerPage, currentPage, onPageChange }) => {
  const [accesses] = [{
    editPopup: hasAccess(accessKeys?.editPopup),
    statusToggle: hasAccess(accessKeys?.activatePopupStatus) && hasAccess(accessKeys?.deactivatePopupStatus),
  }]

  const handlePopUp = async (popUpId, action) => {
    loadingShow();
    const url = action === 'activate' ? urlApi.activePopup + popUpId : urlApi.deactivePopUp + popUpId;
    const resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      if (callback) {
        callback();
      }
    } else {
      toast.error(resp.message);
    }
  };

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
              Content
            </div>,
          center: true,
          grow: 1.5,
          selector: row => row.image,
          cell: row =>

            <div className='flex items-center gap-2 p-[10px]'>
              {row?.content?.type === 1 ? <img className='max-w-[85px] w-[85px] h-[50px] rounded-md' src={row?.content?.value} alt={row?.content?.value} onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
              }} /> :
                <div className='font-semibold text-[#3D9D70] rounded-md w-fit px-2 py-1 bg-[#D8FFED] cursor-pointer'>Text</div>
              }
            </div >
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
              <Link to={row.route?.value} >
                <div className='font-medium text-primary-blue'>{row.route?.type === 1 ?
                  <Link to={row.route?.value} target='blank'>
                    <i class="fa fa-link" aria-hidden="true"></i>
                  </Link>
                  : "--"}</div>
              </Link>
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
          selector: row => row.route?.status,
          cell: row => (
            (hasAccess(accessKeys?.activatePopupStatus) && hasAccess(accessKeys?.deactivatePopupStatus)) && <>
              <ConformationModal bodyText={row?.status ? "Are You Sure to Deactive PopUp" : "Are You Sure to Active PopUp"} components={<ToggleSwitch defaultChecked={row?.status} />}
                handleOperation={() => handlePopUp(row?._id, row?.status ? 'deactivate' : 'activate')} />
            </>

          )
        },
        {
          name:
            <div className='font-semibold'>
              Action
            </div>,
          center: true,
          omit: !(accesses?.editPopup),
          cell: row =>
            <div className='flex items-center gap-2 cursor-pointer'>
              {hasAccess(accessKeys?.editPopup) && <EditPopup data={row} callback={() => callback()} />}
            </div>,
        },
      ])
  }, [popUpData, accesses])

  return (
    <div>
      <Table
        columns={columns}
        data={popUpData?.data}
      />
      <Pagination onPageChanges={onPageChange}
        totalItems={popUpData?.count}
        itemPerPage={itemPerPage}
        currentPage={currentPage} />
    </div>
  )
}

export default Popup