import { IconCertificate, IconCirclePlus } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Select from "react-select";
import { toast } from 'sonner';
import { postApi } from '../../../api/callApi';
import { ALL_LANGUAGE } from '../../../api/localStorageKeys';
import { urlApi } from '../../../api/urlApi';
import { uploadImage } from '../../../utils/commonFunction/ImageUpload';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import ButtonUI from '../../Buttons/ButtonUI';
import MultiIconButtonUI from '../../Buttons/MultiIconButtonUI';
import CkEditor from '../../CKeditor/CkEditor';
import DropDown from '../../DropDown/DropDown';

const CreateSubCategoryModal = ({ categoryId, callback }) => {
    const defaultLanguageId = "650153f818634aa486e1abd9";
    const [show, setShow] = useState(false);
    const [file, setFile] = useState();
    const [langOptions, setLangOptions] = useState([]);
    const [languageID, setLanguageID] = useState([defaultLanguageId]);
    const [status, setStatus] = useState(false);
    const [editedData, setEditedData] = useState("");
    const ref = useRef(null);

    useEffect(() => {
        let allLang = JSON.parse(ALL_LANGUAGE())
        const formattedOptions = allLang?.map((lang) => ({
            value: lang?.examLangCode,
            label: lang?.language,
            _id: lang?._id
        }));
        setLangOptions(formattedOptions);
    }, []);


    const handleClose = () => {
        setShow(false)
        setFile(null)
    };
    const handleShow = () => { setShow(true) };

    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
        return;
    }

    const handleDataChange = (newData) => {
        setEditedData(newData);
    };

    async function createSubCategory() {
        let apiUrl = urlApi.uploadFile;
        let imageData = await uploadImage(file, apiUrl);
        if (languageID?.length !== 0) {
            let postData = {
                "subCategoryName": document.getElementById("sub-category-name").value,
                "icon": imageData,
                "status": status,
                "description": editedData,
                "languages": languageID
            }
            loadingShow();
            let resp = await postApi(urlApi.addSubCategory + categoryId, postData);
            loadingHide();
            if (resp.responseCode === 200) {
                toast.success(resp.message);
                handleClose();
                if (callback) {
                    callback();
                }
            } else {
                toast.error(resp.message);
            }
        } else {
            toast.error("Please select at least one language")
        }
        return;
    }

    function statusDropDown(event) {
        setStatus(event === "Active" ? true : false);
        return;
    }

    const handleSelectDropDown = (selectedLanguages) => {
        const selectedLanguageIds = selectedLanguages?.map((lang) => lang?._id);
        if (!selectedLanguageIds.includes(defaultLanguageId)) {
            selectedLanguageIds.push(defaultLanguageId);
        }
        setLanguageID(selectedLanguageIds);
    };

    const customStyles = {
        option: (defaultStyles, lang) => ({
            ...defaultStyles,
            color: lang?.isSelected ? "#212529" : "var(--primary-blue)",
            backgroundColor: lang?.isSelected ? "#a0a0a0" : "var(--white-color)",
        }),

        control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: "var(--white-color)",
            padding: "2px",
        }),
        multiValueRemove: (defaultStyles, lang) => ({
            ...defaultStyles,
            display: lang.data._id === defaultLanguageId ? 'none' : defaultStyles.display,
        }),
        singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#ffffff" }),
    };

    return (
        <>
            <MultiIconButtonUI
                prefixIcon={<IconCertificate size={20} />}
                suffixIcon={<IconCirclePlus size={18} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text="Create Sub Category"
                borderRadius={"10px"}
                onClick={() => handleShow()}
            />
            <Modal
                enforceFocus={false}
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
                            Create Sub Category
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
                        <div className="w-[100%] ">
                            <label htmlFor="name" className="font-semibold text-sm">Exam Sub Category Name</label>
                            <input
                                autoFocus
                                id="sub-category-name"
                                type="text"
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        {file && <img src={URL.createObjectURL(file)} alt="" className='w-[85px] h-[85px] rounded-xl mt-3 object-cover' />}
                        <label htmlFor="name" className="font-semibold text-sm">Exam Sub Category Image</label>
                        <div className='border p-2 rounded-xl mt-2'>
                            <input
                                type="file"
                                className="hidden"
                                ref={ref}
                                accept={["image/jpeg", "image/png", "image/gif"]}
                                onChange={(e) => {
                                    handleImageUpload(e);
                                }}
                            />
                            <button className='bg-[#94A3B8] p-1 rounded-xl px-2 text-white-color font-medium' onClick={() => {
                                ref.current.click();
                            }}>
                                Choose File
                            </button>
                        </div>
                        <label htmlFor="name" className="font-semibold text-sm">Select Language</label>
                        <Select className='mt-1 ' isMulti options={langOptions} onChange={(e) => handleSelectDropDown(e)} styles={customStyles} value={langOptions.filter(lang => languageID.includes(lang._id))} required />
                        <div className="w-[30%] mt-3 mb-3">
                            <label htmlFor="name" className="font-semibold text-sm">Status</label>
                            <DropDown
                                onclick={(e) => statusDropDown(e)}
                                options={["Active", "InActive"]}
                                defaultOption="Status" />
                        </div>
                        <div>
                            <label className="font-semibold text-sm mb-1">Instruction about Sub Category</label>
                            <CkEditor onDataChange={(editorData) => handleDataChange(editorData)} />
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
                            text={"Create"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => createSubCategory()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CreateSubCategoryModal