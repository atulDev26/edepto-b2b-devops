import { IconCirclePlus, IconFileText, IconSquareRoundedMinus } from '@tabler/icons-react'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import MultiIconButtonUI from '../../Buttons/MultiIconButtonUI'
import CkEditor from '../../CKeditor/CkEditor'
import ButtonUI from '../../Buttons/ButtonUI'
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading'
import { postApi } from '../../../api/callApi'
import { urlApi } from '../../../api/urlApi'
import { toast } from 'sonner'
import { getLanguageStringFromShortCode } from '../../../utils/getDataFromId'
import Addimage from './Addimage'

const AddQuestion = ({ testNameId, sectionId, selectedLang, callback }) => {
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
    const [solutionData, setSolutionData] = useState({
        langCode: '',
        value: '',
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

    function togetSolutionExplaination(editorData) {
        setSolutionData((prevData) => ({
            ...prevData,
            value: editorData,
        }));
    }

    function handleDeleteEditor(itemIndex) {
        let tempArr = [...options];
        tempArr.splice(itemIndex, 1);
        setOptions(tempArr)
    }

    function handleEditorDataChange(index, editorData) {
        let tempArr = [...options];
        tempArr[index].prompt = index + 1;
        tempArr[index].value = editorData;
        setOptions(tempArr);
    }


    async function addQuestion() {
        let selectedOption = null;
        const selectedRadioButton = document.getElementsByName('correctoption');
        for (let i = 0; i < selectedRadioButton.length; i++) {
            if (selectedRadioButton[i].checked == true) {
                selectedOption = parseInt(selectedRadioButton[i].value) + 1;
            }
        }

        if (selectedLang == null) {
            toast.error("Please Selected a Language")
        }
        let postData = {
            "correctOption": selectedOption,
            "questionData": {
                "langCode": selectedLang,
                "value": questionData?.value,
                "options": options
            },
            "solution": {
                "langCode": selectedLang,
                "value": solutionData?.value
            }
        }
        loadingShow();
        let resp = await postApi(urlApi.addQuestion + testNameId + "/" + sectionId, postData);
        loadingHide();
        if (resp.responseCode == 200) {
            toast.success(resp.message)
            handleClose();
            if (callback) {
                callback();
            }
        } else {
            toast.error(resp.message)
        }
    }
    return (
        <>
            <MultiIconButtonUI
                prefixIcon={<IconFileText size={20} />}
                suffixIcon={<IconCirclePlus size={18} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text="Add Question"
                onClick={() => handleShow()}
            />
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
                            Add Question <span className='bg-[#EAEFF7] text-primary-blue ml-2 px-2 py-1 rounded-lg font-semibold'> {getLanguageStringFromShortCode(selectedLang)}</span>
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
                            <label className="font-medium text-md">Enter Question</label>
                            <CkEditor onDataChange={(editorData) => togetQuestionVal(editorData)} />
                        </div>
                        <div>
                            <label className="font-medium text-md">Solution Explanation</label>
                            <CkEditor onDataChange={(editorData) => togetSolutionExplaination(editorData)} />
                        </div>
                        {
                            options?.map((data, i) => {
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between items-center px-4">
                                            <div className='flex items-center gap-2 mb-3'>
                                                <h5 className="font-medium text-md">Option {i + 1}</h5>
                                                <IconSquareRoundedMinus color='red' size={25} onClick={() => handleDeleteEditor(i)} />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <span style={{ color: 'var(--table-color)', fontSize: '15px' }}>
                                                    &nbsp;Mark as Correct&nbsp;&nbsp;&nbsp;
                                                </span>
                                                <input
                                                    type="radio"
                                                    id={`correctoption${i}`}
                                                    name="correctoption"
                                                    value={i}
                                                    style={{ visibility: 'hidden' }}
                                                />
                                                <label htmlFor={`correctoption${i}`}></label>
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
                            text={"Add"}
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

export default AddQuestion