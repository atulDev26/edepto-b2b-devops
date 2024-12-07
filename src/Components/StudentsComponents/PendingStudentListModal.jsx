import React, { useEffect, useState } from 'react'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { getApi } from '../../api/callApi';
import { toast } from 'sonner';
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber';
import { urlApi } from '../../api/urlApi';
import { Modal } from 'react-bootstrap';
import Table from '../DataTable/Table';
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import { IconCertificate, IconCirclePlus, IconFolderCog } from '@tabler/icons-react';
import Pagination from '../Pagination/Pagination';
import { dateReturn } from '../../utils/commonFunction/dateTimeConverter';

const PendingStudentListModal = () => {
    const [show, setShow] = useState(false);
    const [pendingList, setPendingList] = useState({
        data: [],
        count: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);

    const handleClose = () => { setShow(false); setCurrentPage(1) };
    const handleShow = () => { setShow(true) };

    const onPageChange = (page) => {
        setCurrentPage(page);
        return;
    };

    useEffect(() => {
        if (show) {
            getPendingList();
        }
    }, [show, currentPage])

    async function getPendingList() {
        loadingShow();
        let resp = await getApi(urlApi?.pendingList + "?page=" + currentPage + "&limit=" + itemPerPage);
        loadingHide();
        if (resp.responseCode === 200) {
            setPendingList({
                data: resp?.data?.pendingStudents,
                count: resp?.data?.count,
            });
        } else {
            setPendingList(
                {
                    data: resp?.data?.pendingStudents,
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
                    Mobile Number
                </div>,
            grow: 1,
            center: true,
            selector: row => row?.mobileNumber,
        },
        {
            name:
                <div className='font-semibold'>
                    Batch
                </div>,
            grow: 1,
            center: true,
            selector: row => row?.batch,
        },
        {
            name:
                <div className='font-semibold'>
                    ID
                </div>,
            grow: 1,
            center: true,
            selector: row => row?.ID,
        },
        {
            name:
                <div className='font-semibold'>
                    Join Date
                </div>,
            grow: 1,
            center: true,
            selector: row => dateReturn(row?.joinDate),
        },
        {
            name:
                <div className='font-semibold'>
                    User Note
                </div>,
            grow: 1,
            center: true,
            selector: row => <p>{row?.userNote}</p>

        },
    ];

    return (
        <>
            <MultiIconButtonUI
                text={<p className='font-semibold text-xs'>Student Pending List</p>}
                prefixIcon={<IconFolderCog size={20} />}
                variant='transparent'
                color='var(--primary-blue)'
                textColor='#FFFFFF'
                onClick={() => handleShow()}
            />

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
                            Pending Student List
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
                            data={pendingList?.data}
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
                        totalItems={pendingList?.count}
                        itemPerPage={itemPerPage}
                        currentPage={currentPage} />
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PendingStudentListModal