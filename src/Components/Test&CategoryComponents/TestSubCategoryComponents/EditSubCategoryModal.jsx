import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Select from "react-select";
import { toast } from 'sonner';
import { postApi } from '../../../api/callApi';
import { ALL_LANGUAGE } from '../../../api/localStorageKeys';
import { urlApi } from '../../../api/urlApi';
import { uploadImage } from '../../../utils/commonFunction/ImageUpload';
import { getLanguageDetailsFromId } from '../../../utils/getDataFromId';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import ButtonUI from '../../Buttons/ButtonUI';
import DropDown from '../../DropDown/DropDown';
import CkEditor from '../../CKeditor/CkEditor';

const EditSubCategoryModal = ({ categoryId, callback, data }) => {
    const defaultLanguageId = "650153f818634aa486e1abd9";
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [langOptions, setLangOptions] = useState([]);
    const [languageID, setLanguageID] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
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
        setEditedData(data?.description)
    }, []);


    const handleClose = () => {
        setShow(false)
        setFile(null)
        setLanguageID([])
    };
    const handleShow = () => {
        const tempArr = data?.languages?.map((item) => {
            const langDetails = getLanguageDetailsFromId(item);
            return {
                value: langDetails.examLangCode,
                label: langDetails.language,
                _id: langDetails._id,
            };
        }) || [];
        setSelectedLanguages(tempArr);
        setShow(true)
    };

    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
    }

    const handleDataChange = (newData) => {
        setEditedData(newData);
    };

    async function editSubCategory() {
        let imageData = data?.icon;
        if (file) {
            const apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(file, apiUrl);
        }
        let langId = languageID?.length != 0 ? languageID : getSelectedLangId(selectedLanguages);
        if (!langId.length) {
            toast.error("Please select at least one language");
            return;
        }
        let postData = {
            "subCategoryName": document.getElementById("sub-category-name").value,
            "icon": imageData,
            "status": status,
            "languages": langId,
            "description": editedData,
        }
        loadingShow();
        let resp = await postApi(urlApi.editSubCategory + categoryId + "/" + data?._id, postData);
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
        return;
    }

    function statusDropDown(event) {
        setStatus(event === "Active" ? true : false);
    }

    function handleSelectDropDown(selectedLanguages) {
        let language_ID = selectedLanguages?.map((lang) => lang?._id);
        setLanguageID(language_ID)
    }

    function getSelectedLangId(selectedLanguages) {
        let arr = []
        for (const lang_id of selectedLanguages) {
            arr.push(lang_id?._id)
        }
        return arr
    }

    const customStyles = {
        option: (defaultStyles, lang) => ({
            ...defaultStyles,
            color: lang?.isSelected ? "#212529" : "var(--primary-blue)",
            backgroundColor: lang?.isSelected ? "#94A3B8" : "var(--white-color)",
            fontWeight: "500"
        }),

        control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: "var(--input-field-color)",
            padding: "2px",
            border: "1px solid #e2e2e2",
            borderRadius: "10px",
            boxShadow: "none",
        }),
        multiValueRemove: (defaultStyles, lang) => ({
            ...defaultStyles,
            display: lang.data._id === defaultLanguageId ? 'none' : defaultStyles.display,
        }),
        singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#fff" }),
    };

    return (
        <>
            <i className="fa fa-pencil-square-o fa-lg text-primary-blue" aria-hidden="true" onClick={() => handleShow()}></i>
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
                            Edit Sub Category
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
                                defaultValue={data?.subCategoryName}
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        {data?.icon && <img src={file ? URL.createObjectURL(file) : data?.icon} alt="" className='w-[85px] h-[85px] rounded-xl mt-3 object-cover' />}
                        <div className='border p-2 rounded-xl mt-3'>
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
                        <Select className='mt-2' isMulti options={langOptions} defaultValue={selectedLanguages} onChange={(e) => handleSelectDropDown(e)} styles={customStyles} required />
                        <div className="w-[30%] mt-3 mb-3">
                            <DropDown
                                onclick={(e) => statusDropDown(e)}
                                options={["Active", "InActive"]}
                                defaultOption={data?.status === true ? "Active" : (data?.status === false ? "InActive" : "Edit Status")} />
                        </div>
                        <CkEditor editorData={data?.description} onDataChange={(editorData) => handleDataChange(editorData)} />
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
                            onClick={() => editSubCategory()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditSubCategoryModal