import React, { useState } from 'react'
import MultiIconButtonUI from '../../Buttons/MultiIconButtonUI';
import { Modal, Toast } from 'react-bootstrap';
import CkEditor from '../../CKeditor/CkEditor';
import ButtonUI from '../../Buttons/ButtonUI';
import { IconCirclePlus, IconFileText, IconSquareRoundedMinus } from '@tabler/icons-react';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { toast } from 'sonner';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { getLanguageStringFromShortCode } from '../../../utils/getDataFromId';

const AddQuestionInOtherLang = ({ selectedLang, testNameId, sectionId, callback, question, editData }) => {
    const [show, setShow] = useState(false);
    const [options, setOptions] = useState([
        {
            prompt: 1,
            value: '',
        },
        {
            prompt: 2,
            value: '',
        },
        {
            prompt: 3,
            value: '',
        },
        {
            prompt: 4,
            value: '',
        },
    ]);
    const [questionData, setQuestionData] = useState({
        langCode: '',
        value: '',
        options: options,
    });

    const handleClose = () => {
        setShow(false);
        setOptions([{
            prompt: 1,
            value: '',
        },
        {
            prompt: 2,
            value: '',
        },
        {
            prompt: 3,
            value: '',
        },
        {
            prompt: 4,
            value: '',
        }])
    };
    const handleShow = () => setShow(true);

    function togetQuestionVal(editorData) {
        setQuestionData((prevData) => ({
            ...prevData,
            value: editorData,
        }));
    }

    function handleAddEditor() {
        setOptions([...options, {
            "prompt": options.length + 1,
            "value": ""
        }])
    }
    function handleDeleteEditor(itemIndex) {
        let tempArr = [...options];
        tempArr.splice(itemIndex, 1);
        setOptions(tempArr)
    }

    function handleEditorDataChange(index, editorData) {
        let tempArr = [...options];
        tempArr[index].value = editorData;
        setOptions(tempArr);
    }


    async function addQuestion() {
        if (selectedLang == null) {
            toast.error("Please Selected a Language")
        }
        let postData = {
            "questionData": {
                "langCode": selectedLang,
                "value": questionData?.value,
                "options": options
            },
        }
        loadingShow();
        let resp = await postApi(urlApi.addQuestionInOtherLanguage + testNameId + "/" + sectionId + "/" + editData, postData);
        loadingHide();
        if (resp.responseCode == 200) {
            toast.success(resp.message)
            if (callback) {
                callback();
            }
            handleClose();
        } else {
            toast.error(resp.message)
        }
    }
    return (
        <>
            {/* <MultiIconButtonUI
                prefixIcon={<IconFileText size={20} />}
                suffixIcon={<IconCirclePlus size={18} />}
                variant="fill"
               
                text="Add"
                
            /> */}
            <IconCirclePlus color={"var(--primary-blue)"} onClick={() => handleShow()} className='cursor-pointer' />
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
                            Edit Question In Other Language <span className='bg-[#EAEFF7] text-primary-blue ml-2 px-2 py-1 rounded-lg font-semibold'>
                                {getLanguageStringFromShortCode(selectedLang)}
                            </span>
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
                        <p>Q.{question}</p>
                        <div>
                            <label className="font-medium text-md">Enter Question</label>
                            <CkEditor onDataChange={(editorData) => togetQuestionVal(editorData)} />
                        </div>
                        {
                            options?.map((data, i) => {
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between items-center px-4">
                                            <div className='flex items-center gap-2 mb-3'>
                                                <h5 className="font-medium text-md">Option {data?.prompt}</h5>
                                                <IconSquareRoundedMinus color='red' size={25} onClick={() => handleDeleteEditor(i)} />
                                            </div>
                                        </div>
                                        <div>
                                            <CkEditor onDataChange={(editorData) => handleEditorDataChange(i, editorData)} />
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className="col-md-3 mt-2">
                            <MultiIconButtonUI
                                prefixIcon={<IconFileText size={20} />}
                                suffixIcon={<IconCirclePlus size={18} />}
                                variant="fill"
                                color={"var(--primary-blue)"}
                                text="Add More Options"
                                onClick={() => handleAddEditor()}
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
                            onClick={() => addQuestion()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddQuestionInOtherLang