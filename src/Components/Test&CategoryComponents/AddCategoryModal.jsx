import React, { useRef, useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import { IconCertificate, IconCirclePlus } from '@tabler/icons-react';
import DropDown from '../DropDown/DropDown';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';
import { uploadImage } from '../../utils/commonFunction/ImageUpload';

const AddCategoryModal = ({ callback }) => {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(false);
    const ref = useRef(null);

    const handleClose = () => {
        setShow(false);
        setFile(null);
    };
    const handleShow = () => setShow(true);

    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
    }

    function statusDropDown(event) {
        setStatus(event === "Active" ? true : false);
    }

    async function createCategory() {
        let imageData;
        if (file) {
            let apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(file, apiUrl);
        }
        const categoryData = {
            "categoryName": document.getElementById("category-name").value,
            "icon": imageData,
            "status": status,
            "orderBy": document.getElementById("category-order").value
        }
        loadingShow();
        let resp = await postApi(urlApi.addCategory, categoryData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            handleClose();
            if (callback) {
                callback();
            }
            setFile(null);
            document.getElementById("category-name").value = null;
            document.getElementById("category-order").value = null;
        } else {
            toast.error(resp.message)
        }
        return;
    }

    return (
        <>
            <MultiIconButtonUI
                text={<p className='font-semibold text-xs'>Add Category</p>}
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
                            Create Category
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
                            <label htmlFor="name" className="font-semibold text-sm">Category Name</label>
                            <input
                                autoFocus
                                id="category-name"
                                type="text"
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="w-[100%] ">
                            <label htmlFor="name" className="font-semibold text-sm">Order</label>
                            <input
                                id="category-order"
                                type="number"
                                min={0}
                                placeholder=""
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        {file && <img src={URL.createObjectURL(file)} alt="" className='w-[85px] h-[85px] rounded-xl mt-3 object-cover' />}
                        <label htmlFor="name" className="font-semibold text-sm">Select Category Icon &nbsp;</label>
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
                        <div className="w-[30%] mt-3">
                            <label htmlFor="name" className="font-semibold text-sm">Status</label>
                            <DropDown
                                onclick={(e) => statusDropDown(e)}
                                options={["Active", "InActive"]}
                                defaultOption="Status" />
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
                            onClick={() => createCategory()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddCategoryModal