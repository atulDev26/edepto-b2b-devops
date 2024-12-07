import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../Layout/Layout'
import { useParams } from 'react-router-dom';
import AssignPassToStudent from '../../../Components/StudentsComponents/AssignPassToStudent';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { getApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';
import { Badge } from 'react-bootstrap';
import { dateTimeConverter, extractDate } from '../../../utils/commonFunction/dateTimeConverter';
import Table from '../../../Components/DataTable/Table';
import Pagination from '../../../Components/Pagination/Pagination';
import EditAssignPass from '../../../Components/StudentsComponents/EditAssignPass';
import { hasAccess } from '../../../utils/StaticData/accessList';
import { accessKeys } from '../../../utils/accessKeys.utils';

const AssignPass = () => {
    const { studentId } = useParams();
    const { studentName } = useParams();
    const [assignPassList, setAssignPassList] = useState({
        data: [],
        count: 0,
    });
    const [itemPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [accesses] = useState({
        editPass: hasAccess(accessKeys?.editMyPass)
    })

    useEffect(() => {
        if (hasAccess(accessKeys?.getAllPass)) {
            getAssignPass();
        }
    }, [currentPage]);




    async function getAssignPass() {
        loadingShow();
        let resp = await getApi(urlApi.getPass + studentId + "?page=" + currentPage + "&limit=" + itemPerPage);
        loadingHide();
        if (resp.responseCode === 200) {
            setAssignPassList({
                data: resp?.data?.value,
                count: resp?.data?.count,
            });
        } else {
            toast.error(resp.message);
        }
        return;
    }
    const onPageChange = (page) => {
        setCurrentPage(page);
    };


    const columns = useMemo(() => {
        return (
            [
                {
                    name: "S.No",
                    width: "60px",
                    selector: row => 1
                },
                {
                    name: "Pass Name ",
                    width: "280px",
                    wrap: true,
                    selector: row => (
                        <div >
                            <p className='m-0'>{row?.passId?.passName}</p>
                            <p className='m-0'>
                                {
                                    row?.isActive == true ?
                                        <Badge bg="success">Active</Badge> : <Badge bg="secondary">InActive</Badge>
                                }
                            </p>
                        </div>
                    )
                },
                {
                    name: "Price",
                    width: "70px",
                    selector: row => (
                        <div className='angle'>
                            <p className='m-0' style={{ color: "green" }}>₹{row?.price}</p>
                        </div>
                    )
                },
                {
                    name: "ExpiresAt",
                    width: "200px",
                    selector: row => (
                        <div>
                            <p className='m-0'><span style={{ color: "green" }}>{extractDate(row?.expiresAt)}</span></p>
                        </div>
                    )
                },
                {
                    name: "Assign by",
                    center: true,
                    selector: row => (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ color: "green" }}>{row?.assignedBy}</span>
                            <p className='m-0' style={{ color: "black" }}>{dateTimeConverter(row?.createdAt)}</p>
                        </div>
                    )
                },
                {
                    name: "Update by",
                    center: true,
                    omit: accesses?.editMyPass,
                    selector: row => (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ color: "green" }}>{row?.updatedBy}</span>
                            <p className='m-0' style={{ color: "black" }}>{dateTimeConverter(row?.updatedAt)}</p>
                        </div>
                    )
                },
                {
                    name: "Action",
                    selector: row => (
                        <div>
                            {
                                <EditAssignPass callback={() => getAssignPass()} passData={row} />
                            }
                        </div>
                    )
                },
            ]
        )
    }, [accesses?.editPass])

    return (
        <Layout>
            <div className='h-auto w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center mb-2'>
                <div className='font-semibold text-base sm:w-auto order-[1]'>
                    Assign Pass to {studentName}
                </div>
                <div className='search-container mt-1 sm:mt-2 md:m-0 xl:m-0 w-full sm:w-full md:w-1/2 order-[3] sm:order-[2] '>
                </div>
            </div>
            {hasAccess(accessKeys?.assignPass) && <AssignPassToStudent callback={() => getAssignPass()} studentId={studentId} />}
            <div className='shadow-md w-full ease-in duration-200'>
                <Table
                    columns={columns}
                    data={assignPassList?.data}
                />
                <Pagination onPageChanges={onPageChange}
                    totalItems={assignPassList?.count}
                    itemPerPage={itemPerPage}
                    currentPage={currentPage}
                />
            </div>
        </Layout>
    )
}

export default AssignPass