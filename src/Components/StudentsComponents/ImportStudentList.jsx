import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import { IconFileArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Table from '../DataTable/Table';
import ButtonUI from '../Buttons/ButtonUI';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { imageUploadApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';

const ImportStudentList = ({ callback }) => {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const handleClose = () => { setShow(false); setFile(false) };
    const handleShow = () => setShow(true);

    const data = [{
        id: 1,
        joinDate: "22/07/2020",
        phone: "XXXXXX4124",
        email: "example@example.com",
        userNote: "abc",
        batch: "A1",
    }]

    const columns = [
        {
            name:
                <div className='font-semibold'>
                    ID
                </div>,
            center: true,
            cell: (row) => row?.id,
        },
        {
            name:
                <div className='font-semibold'>
                    joinDate
                </div>,
            center: true,
            cell: (row) => row?.joinDate,
        },
        {
            name:
                <div className='font-semibold'>
                    mobileNumber
                </div>,
            center: true,
            cell: (row) => row?.phone,
        },
        {
            name:
                <div className='font-semibold'>
                    userNote
                </div>,
            center: true,
            cell: (row) => row?.userNote,
        },
        {
            name:
                <div className='font-semibold'>
                    emailId
                </div>,
            center: true,
            cell: (row) => row?.email,
        },
        {
            name:
                <div className='font-semibold'>
                    batch
                </div>,
            center: true,
            cell: (row) => row?.batch,
        }
    ];

    function handleFileUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
    }

    async function importTeachers() {
        let formData = new FormData();
        formData.append('studentList', file);
        loadingShow();
        let resp = await imageUploadApi(urlApi.importAllStudent, formData);
        loadingHide();
        if (resp.responseCode === 200) {
            if (callback) {
                callback();
            }
            toast.success(resp.message);
            handleClose();

        } else {
            toast.error(resp.message);
        }
        return;
    }
    return (
        <>
            <MultiIconButtonUI
                suffixIcon={<IconFileArrowLeft size={20} />}
                variant='fill'
                text='Import'
                color={"var(--primary-blue)"}
                onClick={() => handleShow()}
            />
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Add Student"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Import Student<span className='text-red-700 font-semibold text-xs'>(Warning do not change headers)</span>
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
                    <div className='p-3'>
                        <p className='text-red-600 font-semibold text-md mb-3'>Format Of CSV</p>
                        <Link className='p-2 bg-primary-blue text-white-color rounded-md' target='_blank' to={process.env.PUBLIC_URL + "/Assets/FileCSV/Student_List_Demo.csv"} download>Download DEMO Sheet</Link>
                        <div className='mb-3 mt-3'>
                            <Table data={data} columns={columns} />
                        </div>
                        <div className="flex flex-col items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">CSV(MAX. 5MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept='.csv' onChange={(e) => handleFileUpload(e)} />
                            </label>
                            {file && <p className='text-xl font-medium mt-2'>File Name : <span className='font-medium text-sm'>{file?.name}</span></p>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        backgroundColor: "#F5F7FB",
                        borderRadius: "0px 0px 20px 20px",
                    }}
                >
                    <div className="w-[180px] flex  gap-3">
                        <ButtonUI
                            text={"Cancel"}
                            variant="transparent"
                            color={"var(--primary-red)"}
                            onClick={handleClose}
                        >
                            Cancel
                        </ButtonUI>
                        <ButtonUI
                            text={"Import"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => importTeachers()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export default ImportStudentList