import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../../Buttons/ButtonUI';
import { IconEdit } from '@tabler/icons-react';
import { getSecondToHourMin, getTimeConvert } from '../../../utils/commonFunction/dateTimeConverter';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';

const EditTest = ({ testData, callback }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (show) {
            document.getElementById("duration").value = getSecondToHourMin(testData?.duration);
        }
    }, [show])

    async function handleEditTest() {
        let postData = {
            "testName": document.getElementById("test-name").value,
            "duration": getTimeConvert(document.getElementById("duration").value),
            "totalMarks": document.getElementById("totalMarks").value,
            "instructions": document.getElementById('instructions').value
        }
        loadingShow();
        let resp = await postApi(urlApi.editTest + testData?._id, postData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            if (callback) {
                callback()
            }
            handleClose();
        } else {
            toast.error(resp.message);
        }
    }
    return (
        <>
            <IconEdit
                className='cursor-pointer text-primary-blue'
                onClick={() => handleShow()}
            />
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Edit Test"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Edit Test
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
                    <div className="p-4 flex flex-col items-center justify-center gap-2">
                        <div className="w-full mb-2">
                            <p className='font-semibold break-words'>Test Name : {testData?.testName}</p>
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Test Name</label>
                            <input
                                autoFocus
                                id="test-name"
                                type="text"
                                placeholder=""
                                defaultValue={testData?.testName}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Duration</label>
                            <input
                                autoFocus
                                id="duration"
                                type="time"
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer`}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Total Marks</label>
                            <input
                                autoFocus
                                id="totalMarks"
                                type="number"
                                min={0}
                                placeholder=""
                                defaultValue={testData?.totalMarks}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%] sm:col-span-2">
                            <label className="font-medium text-sm">Instructions</label>
                            <textarea
                                id="instructions"
                                type="text"
                                defaultValue={testData?.instructions[0]?.value}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
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
                            text={"Update"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => handleEditTest()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditTest