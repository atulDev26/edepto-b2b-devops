import { IconBulb } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { getLanguageStringFromShortCode } from '../../../utils/getDataFromId';
import ButtonUI from '../../Buttons/ButtonUI';
import CkEditor from '../../CKeditor/CkEditor';
import Addimage from './Addimage';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';

const EditSolution = ({ selectedLang, editData, testId, callback, questionId, sectionId, solutions }) => {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [solutionData, setSolutionData] = useState(null);
    const [editorDataValue, setEditorDataValue] = useState(solutionData?.solution?.[selectedLang])
    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        if (show) {
            for (const item of solutions) {
                if (item?._id == sectionId) {
                    for (const qData of item?.questions) {
                        if (qData?.questionNumber == editData?.sections?.questions?.questionNumber &&
                            qData?.sectionNumber == editData?.sections?.sectionNumber) {
                            setSolutionData(qData);
                        }
                    }
                }
            }
        }

    }, [show, editData?.sections?.questions?.questionNumber, editData?.sections?.sectionNumber, sectionId, solutions])

    function togetSolutionExplaination(editorData) {
        setEditorDataValue(editorData);
    }

    async function handleEditSolution() {
        if (editData?.sections?.questions?.[selectedLang]?.options?.length >= parseInt(document.getElementById("correct-option")?.value)) {
            let postData = {
                "correctOption": parseInt(document.getElementById("correct-option")?.value),
                "solution": {
                    "langCode": selectedLang,
                    "value": editorDataValue,
                }
            }
            loadingShow();
            let resp = await postApi(urlApi.updateSolution + testId + "/" + sectionId + "/" + questionId, postData)
            loadingHide();
            if (resp.responseCode == 200) {
                toast.success(resp.message)
                if (callback) {
                    callback()
                }
                handleClose();
            } else {
                toast.error(resp.message)
            }
        } else {
            toast.error("your Correct option is grater then the Number of option you have")
        }
        return;
    }


    return (
        <>
            <IconBulb color={"var(--primary-blue)"} onClick={() => handleShow()} className='cursor-pointer' />
            <Modal
                enforceFocus={false}
                show={show}
                onHide={handleClose}
                backdrop="static"
                size="xl"
                keyboard={false}
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Edit Solution <span className='bg-[#EAEFF7] text-primary-blue ml-2 px-2 py-1 rounded-lg font-semibold' >{getLanguageStringFromShortCode(selectedLang)}</span>
                        </p>
                        <Addimage />
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
                        <div className="row">
                            <div className="col-md-3  mb-3">
                                <label className="font-medium text-sm"> Correct Option</label>
                                <input
                                    autoFocus
                                    id="correct-option"
                                    type="tel"
                                    defaultValue={editData?.sections?.questions?.correctOption}
                                    placeholder="Full Name"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                        </div>
                        <div>
                            <h4>Solution Explanation</h4>
                            {<CkEditor editorData={solutionData?.solution?.[selectedLang]} onDataChange={(editorData) => togetSolutionExplaination(editorData)} />}
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
                            onClick={() => handleEditSolution()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditSolution