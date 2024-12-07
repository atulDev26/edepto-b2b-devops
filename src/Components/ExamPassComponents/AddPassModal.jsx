import { IconCertificate, IconCirclePlus } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Select from "react-select";
import { ALL_LANGUAGE } from '../../api/localStorageKeys';
import ButtonUI from '../Buttons/ButtonUI';
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import DropDown from '../DropDown/DropDown';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { getApi, postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';
import { uploadImage } from '../../utils/commonFunction/ImageUpload';

const AddPassModal = ({ callback }) => {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [examSubCategory, setExamSubCategory] = useState([]);
    const [selectedCheckboxId, setSelectedCheckboxId] = useState(null);
    const ref = useRef(null);


    const handleClose = () => {
        setShow(false)
        setFile(null)
        setExamSubCategory([]);
        setSelectedCheckboxId(null);
    };

    const handleShow = () => setShow(true);

    function onCheckBoxClick(categoryId) {
        setSelectedCheckboxId(prev => prev === categoryId ? null : categoryId);
        return;
    }
    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
        return;
    }

    function statusDropDown(event) {
        setStatus(event === "Active" ? true : false);
        return;
    }

    function isNewDropDown(event) {
        setIsNew(event === "Yes" ? true : false);
        return;
    }

    // async function getSubCategory(e) {
    //     if (e.target.value.length >= 2) {
    //         let resp = await getApi(urlApi.getSubCategoryStatic + e.target.value);
    //         if (resp.responseCode === 200) {
    //             setExamSubCategory(resp.data)
    //         }
    //         else {
    //             toast.error(resp.response)
    //         }
    //     }
    //     return;
    // }

    async function createPass() {
        let apiUrl = urlApi.uploadFile;
        let imageData = await uploadImage(file, apiUrl);
        let postData = {
            "passName": document.getElementById("passName").value,
            "icon": imageData,
            "isActive": status,
            "isNew": isNew,
            "price": parseInt(document.getElementById("price").value),
            "withoutDiscountPrice": parseInt(document.getElementById("w-price").value),
            "order": parseInt(document.getElementById("pass-order")?.value),
            "expiresAt": document.getElementById("expire")?.value,
            "validity": parseInt(document.getElementById("validity").value)
        }
        loadingShow();
        let resp = await postApi(urlApi.addPass, postData);
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
        return;
    }

    return (
        <>
            <MultiIconButtonUI
                text={<p className='font-semibold text-xs'>Add Pass</p>}
                prefixIcon={<IconCertificate size={20} />}
                suffixIcon={<IconCirclePlus size={16} />}
                variant='transparent'
                color='var(--primary-blue)'
                textColor='#FFFFFF'
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
                            Add Pass
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
                        <div className="w-[100%] mb-3">
                            <label htmlFor="name" className="font-semibold text-sm">Pass Name</label>
                            <input
                                autoFocus
                                id="passName"
                                type="text"
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        {/* {examSubCategory?.length > 0 && (
                            <div className="existing-category-container h-auto max-h-[350px] overflow-y-auto">
                                {
                                    examSubCategory?.map((item, index) => {
                                        return (
                                            <div className='flex justify-start items-center gap-3 px-2 py-1' key={index}>
                                                <input className='bg-slate-300 rounded-full' type="checkbox" id={`existing-sub-cat-${item?._id}`} onChange={() => onCheckBoxClick(item?._id)} checked={selectedCheckboxId === item?._id} required />
                                                <label htmlFor={`existing-sub-cat-${item?._id}`}>{item?.subCategoryName}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )} */}
                        {file && <img src={URL.createObjectURL(file)} alt="" className='w-[100%] h-[211px] object-cover  rounded-3xl mt-3' />}
                        <div className='border p-2 rounded-xl mt-3 mb-2'>
                            <label className='font-semibold text-sm'>Upload Image &nbsp;</label>
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
                        <div className="w-[100%] mt-1">
                            <label className='font-semibold text-sm'>Price</label>
                            <input
                                id="price"
                                type="number"
                                min={0}
                                placeholder="₹ Enter price "
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="w-[100%] mt-1">
                            <label className='font-semibold text-sm'>Without Discount Price</label>
                            <input
                                id="w-price"
                                type="number"
                                min={0}
                                placeholder="₹ Enter price "
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="w-[100%] mt-1">
                            <label className='font-semibold text-sm'>Order</label>
                            <input
                                id="pass-order"
                                type="number"
                                min={0}
                                placeholder="0"
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                            <div>
                                <label className='font-semibold text-sm'> Status</label>
                                <DropDown
                                    onclick={(e) => statusDropDown(e)}
                                    options={["Active", "InActive"]}
                                    defaultOption="Status"
                                />
                            </div>
                            <div>
                                <label className='font-semibold text-sm'> New Pass</label>
                                <DropDown
                                    onclick={(e) => isNewDropDown(e)}
                                    options={["Yes", "No"]}
                                    defaultOption="New Pass ?"
                                />
                            </div>
                        </div>
                        <div className="w-[100%] mt-1">
                            <label className='font-semibold text-sm'>Expires At</label>
                            <input
                                type="date"
                                min="2018-06-07"
                                max="2040-06-14" className="form-control"
                                placeholder='YYYY-MM-DD'
                                id='expire'
                                required
                            />
                        </div>
                        <div className="w-[100%] mt-1">
                            <label className='font-semibold text-sm'>Validity <span className='text-primary-red'>in Months</span></label>
                            <input
                                id="validity"
                                type="tel"
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
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
                            text={"Create"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => createPass()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddPassModal