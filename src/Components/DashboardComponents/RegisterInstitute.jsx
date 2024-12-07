import React, { useRef } from 'react'
import { Modal } from 'react-bootstrap';
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import { IconCirclePlus } from '@tabler/icons-react';
import ButtonUI from '../Buttons/ButtonUI';
import { useState } from 'react';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';
import { autoLogin } from '../../utils/autoLogin';
import { uploadImage } from '../../utils/commonFunction/ImageUpload';
import { useNavigate } from 'react-router-dom';

const RegisterInstitute = () => {
    const ref = useRef(null);
    const [show, setShow] = useState(false);
    const [files, setFiles] = useState(null);
    const navigate = useNavigate()


    const handleClose = () => { setShow(false); setFiles(null) };
    const handleShow = () => setShow(true);

    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFiles(e?.target?.files[0]);
        }
        return;
    }

    async function registerInstitute() {
        let apiUrl = urlApi.uploadFile;
        let imageData = await uploadImage(files, apiUrl);
        let postData = {
            "instituteName": document.getElementById("instituteName").value,
            "phone": document.getElementById("number").value,
            "email": document.getElementById("email-id").value,
        }
        if (document.getElementById("url").value) {
            postData.website = document.getElementById("url").value;
        }
        if (document.getElementById("description").value) {
            postData.description = document.getElementById("description").value;
        } if (document.getElementById("location").value) {
            postData.location = document.getElementById("location").value;
        } if (imageData) {
            postData.logo = imageData;
        }
        loadingShow();
        let resp = await postApi(urlApi.registerInstitute, postData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            autoLogin(() => navigate("/price-&-plan"))
        } else {
            toast.error(resp.message);
        }
        return;
    }

    return (
        <>
            <MultiIconButtonUI
                // prefixIcon={<IconUserShield size={20} />}
                suffixIcon={<IconCirclePlus size={18} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text="Register Institute"
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
                            Register Institute
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
                    <div className="p-4 flex flex-col items-center justify-center">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="instituteName" className="font-medium text-sm">Institute Name*</label>
                                <input
                                    id="instituteName"
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="number" className="font-medium text-sm">Mobile Number*</label>
                                <input
                                    id="number"
                                    type="tel"
                                    min="0"
                                    maxLength={10}
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="url" className="font-medium text-sm">Web Site URL</label>
                                <input
                                    id="url"
                                    type="url"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="description" className="font-medium text-sm">Description</label>
                                <input
                                    id="description"
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="location" className="font-medium text-sm">Location</label>
                                <input
                                    id="location"
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="email-id" className="font-medium text-sm">Email*</label>
                                <input
                                    id="email-id"
                                    type="email"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className='image'>
                                <div className='institute-logo'>
                                    <div className='flex justify-between items-center gap-4 p-2'>
                                        <div className=' w-[100%] mt-1'>
                                            <div className='flex gap-3 items-center mb-2'>
                                                <label className="font-semibold text-sm w-32 text-wrap">Institute Logo</label>
                                                <button
                                                    className="border border-red-900 text-primary-blue font-semibold py-2 shadow-sm px-4 rounded-xl"
                                                    onClick={() => {
                                                        ref.current.click();
                                                    }}>
                                                    Upload
                                                </button>
                                            </div>
                                            <img
                                                src={!files ? process.env.PUBLIC_URL + "/Assets/Images/defaultImg.svg" : URL.createObjectURL(files)}
                                                alt=""
                                                className="max-w-[180px] w-[180px] max-h-[100px] h-[100px] border-[4px] rounded-xl object-cover "
                                                onError={({ currentTarget }) => {
                                                    currentTarget.onerror = null;
                                                    currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edepto.svg";
                                                }}
                                            />
                                            <input
                                                type="file"
                                                className="hidden"
                                                ref={ref}
                                                accept={["image/jpeg", "image/png", "image/gif"]}
                                                onChange={(e) => {
                                                    handleImageUpload(e);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        marginTop: "20px",
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
                            onClick={() => registerInstitute()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RegisterInstitute