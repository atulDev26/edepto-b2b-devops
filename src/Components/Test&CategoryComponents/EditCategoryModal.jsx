import React, { useEffect, useRef, useState } from 'react'
import ButtonUI from '../Buttons/ButtonUI';
import { Modal } from 'react-bootstrap';
import { urlApi } from '../../api/urlApi';
import DropDown from '../DropDown/DropDown';
import { toast } from 'sonner';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { postApi } from '../../api/callApi';
import { uploadImage } from '../../utils/commonFunction/ImageUpload';

const EditCategoryModal = ({ callback, data }) => {
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

    async function editCategory() {
        let imageData = data?.icon;
        if (file) {
            const apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(file, apiUrl);
        }
        const categoryData = {
            "categoryName": document.getElementById("category-name").value,
            "icon": imageData,
            "status": status,
            "orderBy": parseInt(document.getElementById("category-order").value)
        }
        loadingShow();
        let resp = await postApi(urlApi.editCategory + data?._id, categoryData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            handleClose();
            if (callback) {
                callback();
            }
        } else {
            toast.error(resp.message)
        }
        return;
    }
    return (
        <>
            <i className={`fa fa-edit fa-sm text-primary-blue cursor-pointer`} onClick={() => handleShow()}></i>
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
                            Edit Category
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
                            <label htmlFor="name" className="font-semibold text-sm">Edit Category Name</label>
                            <input
                                autoFocus
                                id="category-name"
                                type="text"
                                placeholder=""
                                defaultValue={data?.categoryName}
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="w-[100%] ">
                            <label htmlFor="name" className="font-semibold text-sm">Edit Order</label>
                            <input
                                id="category-order"
                                type="number"
                                placeholder=""
                                min={0}
                                defaultValue={data?.orderBy}
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        {data?.icon && <img src={!file ? data?.icon ?? "null" : URL.createObjectURL(file)} alt="" className='w-[85px] h-[85px] rounded-xl mt-3 object-cover' />}
                        <label htmlFor="name" className="font-semibold text-sm">Edit Category Icon &nbsp;</label>
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
                            <label  className="font-semibold text-sm">Edit Status</label>
                            <DropDown
                                onclick={(e) => statusDropDown(e)}
                                options={["Active", "InActive"]}
                                defaultOption={data?.status === true ? "Active" : (data?.status === false ? "InActive" : "Edit Status")} />
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
                            onClick={() => editCategory()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditCategoryModal