import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../../Buttons/ButtonUI';
import MultiIconButtonUI from '../../Buttons/MultiIconButtonUI';
import { IconCirclePlus, IconFileText } from '@tabler/icons-react';
import DropDown from '../../DropDown/DropDown';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';
import { getTimeConvert } from '../../../utils/commonFunction/dateTimeConverter';

const AddTest = ({ categoryId, subCategoryId, sectionIds, subSectionId, callback }) => {
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState(null);

    const handleClose = () => { setShow(false); setStatus(null) };
    const handleShow = () => setShow(true);

    function statusDropDown(event) {
        setStatus(event === "Active" ? 1 : event === "InActive" ? 0 : 2);
    }

    async function handleAddTest() {
        let postData = {
            "testName": document.getElementById("test-name").value,
            "categoryIds": [categoryId],
            "subCategoryId": [subCategoryId],
            "sectionId": [sectionIds],
            "subsectionId": [subSectionId],
            "duration": getTimeConvert(document.getElementById("duration").value),
            "totalMarks": document.getElementById("totalMarks").value,
            "isActive": status,
            "language": ["650153f818634aa486e1abd9"],
            "instructions": document.getElementById('instructions').value
        }
        if (status == 2) {
            postData.availableIn = document.getElementById('date').value
        }
        loadingShow();
        let resp = await postApi(urlApi.addTest, postData);
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
            <MultiIconButtonUI
                prefixIcon={<IconFileText size={20} />}
                suffixIcon={<IconCirclePlus size={18} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text={"Add Test"}
                onClick={() => handleShow()}
            />

            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Add Teachers"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Add Test
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
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Test Name</label>
                            <input
                                autoFocus
                                id="test-name"
                                type="text"
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className='flex w-full gap-4'>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="name" className="font-medium text-sm">Duration</label>
                                <input
                                    id="duration"
                                    type="time"
                                    placeholder=""
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer`}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="name" className="font-medium text-sm">Total Marks</label>
                                <input
                                    id="totalMarks"
                                    type="number"
                                    min={0}
                                    placeholder=""
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-1'>
                            <label className='font-semibold text-sm'>Status</label>
                            <DropDown
                                onclick={(e) => statusDropDown(e)}
                                options={["InActive", "Future"]}
                                defaultOption="Status"
                            />
                        </div>
                        {
                            status == 2 && <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">Available In</label>
                                <input
                                    id="date"
                                    type="date"
                                    min="0"
                                    className={`w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                        }

                        <div className="flex flex-col gap-1 w-[100%] sm:col-span-2">
                            <label className="font-medium text-sm">Instructions</label>
                            <textarea
                                id="instructions"
                                type="text"
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
                            text={"Add"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => handleAddTest()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddTest