import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../../Buttons/ButtonUI';
import { IconEdit } from '@tabler/icons-react';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';

const EditExamCutOff = ({ callback, testId, data }) => {
    const [show, setShow] = useState(false);
    function handleClose() {
        setShow(false);
        return;
    }
    function handleShow() {
        setShow(true);
        return;
    }

    async function handleSubmit() {
        const postData = {
            "category": data?.category,
            "lowerBound": document.getElementById('lowerBound')?.value,
            "upperBound": document.getElementById('upperBound')?.value,
            "lowerBoundPercentile": document.getElementById('lowerBoundPercentile')?.value,
            "upperBoundPercentile": document.getElementById('upperBoundPercentile')?.value,
        };
        loadingShow();
        let resp = await postApi(urlApi.updateExamCutOffs + testId + "/" + data?._id, postData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            if (callback) {
                callback()
            }
            handleClose();
            document.getElementById('lowerBound').value = null;
            document.getElementById('upperBound').value = null;
            document.getElementById('lowerBoundPercentile').value = null;
            document.getElementById('upperBoundPercentile').value = null;
            setShow(false);
        } else {
            toast.error(resp.message);
        }
    }
    return (
        <>
            <IconEdit
                title={"Add CutOff"}
                className='cursor-pointer text-primary-blue'
                onClick={() => handleShow()}
            />
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Edit ExamCutoff"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Edit Exam Cutoff of {<span className='text-green-500'>{data?.category}</span>}
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
                    <div className='p-2 flex flex-col gap-2'>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Lower Bound Percentile
                                <span className='text-red-600 ml-2'>(in number)</span></label>
                            <input
                                autoFocus
                                id="lowerBoundPercentile"
                                type="tel"
                                min={0}
                                defaultValue={data?.lowerBoundPercentile}
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Upper Bond Percentile
                                <span className='text-red-600 ml-2'>(in number)</span></label>
                            <input
                                id="upperBoundPercentile"
                                type="tel"
                                placeholder=""
                                min={0}
                                defaultValue={data?.upperBoundPercentile}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Lower Bound
                                <span className='text-red-600 ml-2'>(in number)</span></label>
                            <input
                                id="lowerBound"
                                type="tel"
                                defaultValue={data?.lowerBound}
                                placeholder=""
                                min={0}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Upper Bond
                                <span className='text-red-600 ml-2'>(in number)</span></label>
                            <input
                                id="upperBound"
                                type="tel"
                                defaultValue={data?.upperBound}
                                placeholder=""
                                min={0}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
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
                            onClick={() => handleSubmit()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default EditExamCutOff