import { IconEdit } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap';
import DropDown from '../DropDown/DropDown';
import ButtonUI from '../Buttons/ButtonUI';
import { urlApi } from '../../api/urlApi';
import { uploadImage } from '../../utils/commonFunction/ImageUpload';
import { postApi } from '../../api/callApi';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { toast } from 'sonner';

const EditBanner = ({ data, callback }) => {
    const exceptThisSymbols = ["e", "E", "+", "-", "."];
    const ref = useRef(null);
    const [show, setShow] = useState(false);
    const [pageName, setPageName] = useState("None");
    const [status, setStatus] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (show) {
            setPageName(data?.route?.pageName || "None");
            setStatus(data?.status);
        }
    }, [show])

    function pageDropDown(event) {
        setPageName(event);
        return;
    }

    function statusDropDown(event) {
        setStatus(event === "Active" ? true : false);
        return;
    }
    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
    }

    const handleClose = () => {
        setShow(false);
        setFile(null);
        setStatus(null);
        setPageName("None");
    };
    const handleShow = () => setShow(true);

    async function editBanner() {
        let imageData = data?.image;
        if (file) {
            const apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(file, apiUrl);
        }
        let bannerData = {
            "name": document.getElementById("bannerName").value,
            "image": imageData,
            "status": status,
            "order": document.getElementById("bannerOrder").value,
        }
        if (pageName != "None"){
            bannerData.route = {
                "value":  document.getElementById("url").value,
                "pageName": pageName,
                "type": pageName === "URL" ? 1 : (pageName === "Profile" ? 3 : 2)
            };
        }
        loadingShow();
        let resp = await postApi(urlApi.editBanner + data?._id, bannerData);
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
            <IconEdit className='cursor-pointer text-primary-blue' onClick={() => handleShow()} />

            <Modal
                size="lg"
                show={show}
                onHide={() => handleClose()}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Edit Banner
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
                    <div className={`p-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2`}>
                        <div className='p-3'>
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
                            <div className="w-[100%] mb-3">
                                <label className="font-semibold text-sm">Edit Banner Name</label>
                                <input
                                    autoFocus
                                    id="bannerName"
                                    defaultValue={data?.name}
                                    type="text"
                                    placeholder=""
                                    className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="w-[100%] mb-3">
                                <label className="font-semibold text-sm">Edit Order</label>
                                <input
                                    id="bannerOrder"
                                    type="number"
                                    placeholder=""
                                    defaultValue={data?.order}
                                    min={0}
                                    className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                    onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()} onPaste={(e) => { e.preventDefault(); return false; }}
                                />
                            </div>
                            <div className='mb-3'>
                                <label className='font-semibold text-sm'>Edit Status</label>
                                <DropDown
                                    onclick={(e) => statusDropDown(e)}
                                    options={["Active", "Inactive"]}
                                    defaultOption={data?.status && data?.status === true ? "Active" : "Inactive" || "Status"}
                                />
                            </div>
                            <div className='mb-3'>
                                <label className='font-semibold text-sm'>Edit Route Type &nbsp;<span className='font-semibold text-xs text-primary-red'>(Optional)</span></label>
                                <DropDown
                                    onclick={(e) => pageDropDown(e)}
                                    options={["None", "URL"]}
                                    defaultOption={data?.route && data?.route?.type === 1 ? "URL" : "Route Type?"}
                                />
                            </div>
                            {
                                pageName === "URL" &&
                                <div className="w-[100%] mb-3">
                                    <label className="font-semibold text-sm">Edit Banner URL</label>
                                    <input
                                        autoFocus
                                        id="url"
                                        type="url"
                                        placeholder=""
                                        defaultValue={data?.route?.value}
                                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                    />
                                </div>
                            }
                        </div>

                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] shadow-xl p-3">
                            <div className="w-[148px] h-[32px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-[1]"></div>
                            <div className="h-[46px] w-[4px] bg-gray-800 absolute -start-[3px] top-[124px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[4px] bg-gray-800 absolute -start-[3px] top-[178px] rounded-s-lg"></div>
                            <div className="h-[64px] w-[4px] bg-gray-800 absolute -end-[3px] top-[142px] rounded-e-lg"></div>
                            <div className="relative rounded-[2rem] overflow-hidden w-[270px] h-[572px] bg-white dark:bg-gray-800">
                                <img src={process.env.PUBLIC_URL + "/Assets/Images/BannerPopup/banner.jpg"} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                                {data?.image || file ? (
                                    <img src={!file ? data?.image ?? "null" : URL.createObjectURL(file)} alt="Uploaded File" className="absolute  inset-0 w-[250px] h-[450px] rounded-md object-contain mx-auto my-auto" style={{
                                        top: "-304px",
                                        height: "65px",
                                        objectFit: "cover"
                                    }} />
                                ) : (
                                    <p className="mt-3 absolute inset-0 font-semibold flex items-center justify-center text-black">Banner Preview</p>
                                )}
                            </div>
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
                            onClick={() => editBanner()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditBanner