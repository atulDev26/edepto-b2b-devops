import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { getApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';
import { addDefaultImg } from '../../utils/commonFunction/defaultImage';
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber';
import Table from '../DataTable/Table';
import Pagination from '../Pagination/Pagination';
import { calculateDuration, convertIPv6toIPv4, formatDateString } from '../../utils/commonFunction/dateTimeConverter';


const LoginHistory = ({ current_id, data, clearCallBack, callBack }) => {
    const [show, setShow] = useState(false);
    const [loginData, setLoginData] = useState({
        data: [],
        count: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);

    const handleClose = () => { setShow(false); clearCallBack(); setCurrentPage(1) };
    const handleShow = () => { setShow(true); callBack() };

    const onPageChange = (page) => {
        setCurrentPage(page);
        return;
    };

    useEffect(() => {
        if (show) {
            getTeacherLoginHistoryById();
        }
    }, [show, currentPage])

    async function getTeacherLoginHistoryById() {
        loadingShow();
        let resp = await getApi(urlApi?.teacherLoginHistory + data?._id + "?page=" + currentPage + "&limit=" + itemPerPage);
        loadingHide();
        if (resp.responseCode === 200) {
            setLoginData({
                data: resp?.data?.value,
                count: resp?.data?.count,
            });
        } else {
            setLoginData(
                {
                    data: resp?.data?.value,
                    count: resp?.data?.count,
                }
            );
            toast.error(resp.message);
        }
        return;
    }
    const columns = [
        {
            name:
                <div className='font-semibold'>
                    SL No
                </div>,
            center: true,
            width: "70px",
            cell: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage),
        },
        {
            name:
                <div className='font-semibold'>
                    IP Address
                </div>,
            grow: 1,
            center: true,
            selector: row => convertIPv6toIPv4(row?.ipAddress) ?? <p className='text-primary-red'>No Data found</p>,
        },
        {
            name:
                <div className='font-semibold'>
                    login Time
                </div>,
            grow: 1,
            center: true,
            selector: row => formatDateString(row?.loginTime) ?? <p className='text-primary-red'>No Data found</p>,
        },
        {
            name:
                <div className='font-semibold'>
                    logout Time
                </div>,
            grow: 1,
            center: true,
            selector: row => formatDateString(row?.logoutTime) ?? <p className='text-primary-red'>No Data found</p>,
        },
        {
            name:
                <div className='font-semibold'>
                    Duration
                </div>,
            grow: 1,
            center: true,
            selector: row => {
                let duration = calculateDuration(formatDateString(row?.loginTime), formatDateString(row?.logoutTime));
                return <p>{`${duration.hours} hours, ${duration.minutes} minutes, ${duration.seconds} seconds`}</p> ?? <p className='text-primary-red'>No Data found</p>;
            }
        },
    ];



    return (
        <>
            <i title='LogIn History' className={`fa fa-eye fa-lg ${current_id === data._id ? "text-white" : "text-table-buttons-color"}`} aria-hidden="true" onClick={() => handleShow()}></i>

            <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                aria-labelledby="Add Teachers"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Login History<span className='bg-[#EAEFF7] text-primary-blue ml-2 px-2 py-1 rounded-lg font-semibold '>{data?.teacherName}</span>
                        </p>
                        <div>
                            <img
                                src={process.env.PUBLIC_URL + "/Assets/Images/closeIcon.svg"}
                                alt="close"
                                className="cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                }}
                            />
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-4 flex flex-col items-end justify-center">
                        <Table
                            columns={columns}
                            data={loginData?.data}
                            handlePageChange={onPageChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        backgroundColor: "#F5F7FB",
                        borderRadius: "0px 0px 20px 20px",
                        margin: "none !important"
                    }}
                >
                    <Pagination onPageChanges={onPageChange}
                        totalItems={loginData?.count}
                        itemPerPage={itemPerPage}
                        currentPage={currentPage} />
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LoginHistory