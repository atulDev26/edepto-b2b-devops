import { IconEyeEdit } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { uploadImage } from '../../utils/commonFunction/ImageUpload';
import { extractDate } from '../../utils/commonFunction/dateTimeConverter';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import ButtonUI from '../Buttons/ButtonUI';
import DropDown from '../DropDown/DropDown';

const EditPassModal = ({ data, callback }) => {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (show) {
            document.getElementById("expire").value = extractDate(data?.expiresAt);
            setStatus(data?.isActive)
        }
    }, [show]);


    const handleClose = () => {
        setShow(false);
        setFile(null);
    };

    const handleShow = () => setShow(true);

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

    async function updatePass() {
        let imageData = data?.icon;
        if (file) {
            const apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(file, apiUrl);
        }
        let postData = {
            "passName": document.getElementById("passName").value,
            "icon": imageData,
            "isActive": status,
            "isNew": isNew,
            "price": parseInt(document.getElementById("price").value),
            "withoutDiscountPrice": parseInt(document.getElementById("w-price").value),
            "order": parseInt(document.getElementById("pass-order")?.value),
            "expiresAt": document.getElementById("expire").value,
            "validity": parseInt(document.getElementById("validity").value)
        }
        loadingShow();
        let resp = await postApi(urlApi.editPass + data?._id, postData);
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
            <IconEyeEdit size={30} className=' absolute bg-background-color text-primary-blue top-5 left-4 rounded-full p-1 shadow-md' onClick={() => handleShow()} />
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="edit Teachers"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Edit Pass
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
                            <label htmlFor="name" className="font-semibold text-sm">Edit Pass Name</label>
                            <input
                                autoFocus
                                id="passName"
                                type="text"
                                placeholder=""
                                defaultValue={data?.passName}
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-100`}
                            />
                        </div>
                        <img src={!file ? data?.icon ?? "null" : URL.createObjectURL(file)} alt="" className='w-[100%] h-[211px] object-cover  rounded-3xl' />
                        <div className='border p-2 rounded-xl mt-3 mb-2'>
                            <label className='font-semibold text-sm'>Edit Image &nbsp;</label>
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
                                autoFocus
                                defaultValue={data?.price}
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
                                defaultValue={data?.withoutDiscountPrice}
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
                                defaultValue={data?.order}
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-2">
                            <div>
                                <label className='font-semibold text-sm'>Edit Status</label>
                                <DropDown
                                    onclick={(e) => statusDropDown(e)}
                                    options={["Active", "InActive"]}
                                    defaultOption={!!data.isActive ? "Active" : "InActive"}
                                />
                            </div>
                            <div>
                                <label className='font-semibold text-sm'>Edit New Pass</label>
                                <DropDown
                                    onclick={(e) => isNewDropDown(e)}
                                    options={["Yes", "No"]}
                                    defaultOption={!!data?.isNew ? "Yes" : "No"}
                                />
                            </div>

                        </div>
                        <div className="w-[100%] mt-1">
                            <label className='font-semibold text-sm'>Edit Expires At</label>
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
                            <label className='font-semibold text-sm'>Edit Validity <span className='text-primary-red'>in Months</span></label>
                            <input
                                id="validity"
                                type="tel"
                                placeholder=""
                                defaultValue={data?.validity}
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
                            text={"Update"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => updatePass()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditPassModal