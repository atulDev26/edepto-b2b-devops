import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../../Buttons/ButtonUI';
import MultiIconButtonUI from '../../Buttons/MultiIconButtonUI';
import { IconCirclePlus, IconFileText, IconSquareRoundedMinus } from '@tabler/icons-react';
import CkEditor from '../../CKeditor/CkEditor';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';

const AddSection = ({ callback, testId }) => {
    const [show, setShow] = useState(false);
    const [options, setOptions] = useState([{
        "prompt": 0,
        "value": ""
    }])

    function handleAddEditor() {
        setOptions([...options, {
            "prompt": options?.length,
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
    const handleClose = () => {
        setShow(false); setOptions([{
            "prompt": 0,
            "value": ""
        }])
    };
    const handleShow = () => setShow(true);


    async function addSection() {
        let instructionValues = options?.map(option => option?.value);
        let postData = {
            "negMarks": parseFloat(document.getElementById("negMarks")?.value),
            "posMarks": parseInt(document.getElementById("posMarks")?.value),
            "sectionName": document.getElementById("sectionName")?.value,
            "maxMarks": parseInt(document.getElementById("maxMarks")?.value),
            "qCount": parseInt(document.getElementById("tQuestion")?.value),
            "instructions": instructionValues,
        }
        let resp = await postApi(urlApi.addSection + testId, postData)
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


    async function addLanguage() {
        loadingShow();
        let resp = await postApi(urlApi.addLanguage + testId, { languageId: "650153f818634aa486e1abd9" });
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            if (callback) {
                callback();
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
                text="Add Sections"
                onClick={() => handleShow()}
            />

            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="Add Teachers"
                centered
                enforceFocus={false}
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Add Sections
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
                            <label htmlFor="name" className="font-medium text-sm">Section Name</label>
                            <input
                                autoFocus
                                id="sectionName"
                                type="text"
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Max Marks</label>
                            <input
                                id="maxMarks"
                                type="text"
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Total Question</label>
                            <input
                                id="tQuestion"
                                type="number"
                                placeholder=""
                                min={0}
                                max={1000}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Positive Marks</label>
                            <input
                                id="posMarks"
                                type="number"
                                placeholder=""
                                min={0}
                                max={1000}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Negative Marks</label>
                            <input
                                id="negMarks"
                                type="number"
                                placeholder=""
                                min={0}
                                max={1000}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <div className="d-flex gap-3 mt-2">
                                <h4>
                                    Add Instruction?
                                </h4>
                                <div className="col-md-3">
                                    <MultiIconButtonUI
                                        prefixIcon={<IconFileText size={20} />}
                                        suffixIcon={<IconCirclePlus size={18} />}
                                        variant="fill"
                                        color={"var(--primary-blue)"}
                                        text="Add Instruction"
                                        onClick={() => handleAddEditor()}
                                    />
                                </div>
                            </div>
                            {
                                options?.map((data, i) => {
                                    return (
                                        <div key={i}>
                                            <div className='d-flex gap-2'>
                                                <h5 style={{ color: 'var(--table-color)' }}>Instruction {data?.prompt + 1}</h5>
                                                <IconSquareRoundedMinus color='red' size={20} onClick={() => handleDeleteEditor(i)} />
                                            </div>
                                            <div>
                                                <CkEditor onDataChange={(editorData) => handleEditorDataChange(i, editorData)} />
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
                            text={"Add"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => addSection()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddSection