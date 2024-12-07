import { IconEdit } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import ButtonUI from '../../Buttons/ButtonUI';
import DropDown from '../../DropDown/DropDown';

const EditStatus = ({ data, callback }) => {
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState(null);
    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (show) {
            setStatus(data?.isActive);
            const futureDateElement = document.getElementById("future-date");
            if (futureDateElement && data?.availableIn) {
                futureDateElement.value = data?.availableIn;
            }
        }
    }, [show]);

    const handleStatusChange = (e) => {
        if (e === "Active") {
            setStatus(1);
        } else if (e === "InActive") {
            setStatus(0);
        } else {
            setStatus(2);
        }
    }

    async function editStatus() {
        let postData = {}
        if (status === 2) {
            postData.availableIn = document.getElementById("future-date").value
        }
        loadingShow();
        let resp = await postApi(urlApi.updateTestStatus + data?._id + "/" + status, postData);
        loadingHide(false);
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            if (callback) {
                callback()
            }
            handleClose()
            setStatus(null);
        } else {
            toast.error(resp.message);
        }
    }

    return (
        <>
            <IconEdit
                size={18}
                className='cursor-pointer text-primary-blue'
                onClick={() => handleShow()}
            />
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Edit Test Status"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Edit Test Status
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
                            <p className='font-semibold'>Test Name : {data?.testName}</p>
                        </div>
                        <label htmlFor="name" className="font-medium text-sm w-full">Status</label>
                        <div className="w-full">
                            <DropDown
                                onclick={handleStatusChange}
                                options={["Active", "InActive", "Future"]}
                                defaultOption={status == 0 ? "Inactive" : status == 1 ? "Active" : "Future"}
                            />
                            {
                                status == 2 && (
                                    <>
                                        <div className="p-4 flex flex-col items-center justify-center gap-2">
                                            <label htmlFor="name" className="font-medium text-sm">Date</label>
                                            <input
                                                id="future-date"
                                                type="date"
                                                placeholder=""
                                                defaultValue={data?.availableIn}
                                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer`}
                                            />
                                        </div>
                                    </>
                                )
                            }
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
                            onClick={() => editStatus()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditStatus