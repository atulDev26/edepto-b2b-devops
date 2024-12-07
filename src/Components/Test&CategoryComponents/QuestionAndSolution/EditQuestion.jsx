import { IconEdit, IconEye } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { getLanguageStringFromShortCode } from '../../../utils/getDataFromId';
import ButtonUI from '../../Buttons/ButtonUI';
import Addimage from './Addimage';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';
import CkEditor from '../../CKeditor/CkEditor';

const EditQuestion = ({ questionData, selectedLang, sectionId, testId, callback, questionId }) => {
    let optionsData = questionData?.options;
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };

    const [question, setQuestion] = useState({
        langCode: '',
        value: '',
    });

    function togetQuestionExplaination(editorData) {
        setQuestion((prevData) => ({
            ...prevData,
            value: editorData,
        }));
    }

    function optionOnChangeEditor(editorData, optionId) {
        for (const item of optionsData) {
            if (item?._id == optionId) {
                item.value = editorData;
            }
        }
    }

    async function handleUpDatequestion() {
        let postData = {
            "questionData": {
                "langCode": selectedLang,
                "value": question.value,
                "options": optionsData?.map(({ _id, ...details }) => details)
            },
        }
        let resp = await postApi(urlApi.addQuestionInOtherLanguage + testId + "/" + sectionId + "/" + questionId, postData)
        if (resp.responseCode == 200) {
            toast.success(resp.message)
            if (callback) {
                callback()
            }
            handleClose();
        } else {
            toast.error(resp.message)
        }
    }

    return (
        <>

            <IconEdit color={"var(--primary-blue)"} onClick={() => handleShow()} className='cursor-pointer' />
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
                            Edit Question <span className='bg-[#EAEFF7] text-primary-blue ml-2 px-2 py-1 rounded-lg font-semibold' >{getLanguageStringFromShortCode(selectedLang)}</span>
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
                        <div>
                            <p className="font-semibold text-base cursor-default">Enter Question</p>
                            <CkEditor editorData={questionData?.value} onDataChange={(editorData) => togetQuestionExplaination(editorData)} />
                        </div>
                        <div className="row">
                            {
                                optionsData?.map((data, index) => {
                                    return (
                                        <div key={data?._id}>
                                            <div className="d-flex justify-content-between px-4">
                                                <p className="font-semibold text-base cursor-default">
                                                    {"Option - " + data?.prompt}
                                                </p>
                                            </div>
                                            <div>
                                                <CkEditor editorData={data?.value} onDataChange={(editorData) => optionOnChangeEditor(editorData, data?._id)} />
                                                <p className='px-5 py-3' dangerouslySetInnerHTML={{ __html: data?.value }}></p>
                                            </div>
                                        </div>
                                    )
                                })
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
                            onClick={() => handleUpDatequestion()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditQuestion