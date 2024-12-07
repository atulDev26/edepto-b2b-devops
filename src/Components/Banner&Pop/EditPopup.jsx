import { IconEdit } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import DropDown from '../DropDown/DropDown';
import { urlApi } from '../../api/urlApi';
import { uploadImage } from '../../utils/commonFunction/ImageUpload';
import { toast } from 'sonner';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { postApi } from '../../api/callApi';

const EditPopup = ({ callback, data }) => {
    const ref = useRef(null);
    const [show, setShow] = useState(false);
    const [route, setRoute] = useState("");
    const [popupType, setPopupType] = useState("Image");
    const [file, setFile] = useState(null);
    const [popUpName, setPopUpName] = useState("");
    const [close, setClose] = useState(true);
    const [status, setStatus] = useState(false);
    const [displayPage, setDisplayPage] = useState("");
    const [contentValue, setContentValue] = useState("");
    const [displayTime, setDisplayTime] = useState(null);
    const [type, setType] = useState(null);

    useEffect(() => {
        if (show) {
            setRoute(data?.route?.type === 1 ? "URL" : "None");
            setPopupType(data?.content?.type === 3 ? "Text" : "Image");
            setPopUpName(data?.name || "");
            setClose(data?.isCloseable);
            setStatus(data?.status === "Active" ? true : false);
            // setDisplayPage(data?.displayPage || "");
            if (data?.content?.type === 3) { setContentValue(data?.content?.value) };
            setDisplayTime(data?.displayTime || null);
            setType(data?.showType);
        }
    }, [show])

    function routeDropDown(event) {
        setRoute(event);
        return;
    }

    function popUpTypeDropDown(event) {
        setPopupType(event);
        // if (event == "Image") {
        //     data.content.type = 1
        // } if (event == "Text") {
        //     if (data.content.type == 3) {
        //         console.log(data.content.value);
        //         setContentValue(data.content.value)
        //     } else {
        //         setContentValue("")

        //     }
        // }
        return;
    }

    function handleCloseable(event) {
        setClose(event === "True" ? true : false);
    }
    function handleStatus(event) {
        setStatus(event === "Active" ? true : false);
    }

    function handleDisplayPage(event) {
        setDisplayPage(event);
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
    };

    const handleShow = () => setShow(true);

    async function handleEditPopup() {
        let imageData = data?.content?.value;
        if (file) {
            let apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(file, apiUrl);
        }
        if (!close) {
            if (isNaN(displayTime) || displayTime < 1 || displayTime > 10) {
                toast.error("Display Time must be a number between 1 and 10");
                return;
            }
        }
        let popUpData = {
            "name": popUpName,
            "status": status,
            "isCloseable": close,
            // "displayPage": displayPage,
            "content": {
                "value": popupType === "Image" ? imageData : contentValue,
                "type": popupType === "Image" ? 1 : 3
            },
            showType: parseInt(type)
        }
        if (route === "URL") {
            popUpData.route = {
                "value": document.getElementById("popup-url").value,
                "type": route === "URL" ? 1 : ""
            }
        }
        if (!close) {
            popUpData.displayTime = displayTime
        }
        loadingShow();
        let resp = await postApi(urlApi.editPopUp + data?._id, popUpData);
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

    function onceOrMultiple(e) {
        if (e === "Show Once") {
            setType(1);
        } else {
            setType(2);
        }
    }

    return (
        <>
            <IconEdit className='cursor-pointer text-primary-blue' onClick={() => handleShow()} />
            <Modal
                size="xl"
                show={show}
                onHide={() => handleClose()}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Edit Popup
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
                        <div className='p-2'>
                            <div className='mb-3'>
                                <label className='font-semibold text-sm'>Popup Type</label>
                                <DropDown
                                    onclick={(e) => { popUpTypeDropDown(e) }}
                                    options={["Image", "Text"]}
                                    defaultOption={popupType}
                                />
                            </div>
                            {popupType === "Image" && <div className='border p-2 rounded-xl mt-3 mb-2'>
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
                            }
                            <div className="w-[100%] mb-3">
                                <label className="font-semibold text-sm">Popup Name</label>
                                <input
                                    autoFocus
                                    id="popUpName"
                                    type="text"
                                    placeholder=""
                                    defaultValue={popUpName}
                                    maxLength={25}
                                    onChange={(e) => setPopUpName(e.target.value)}
                                    className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            {
                                popupType === "Text" &&
                                <div className="w-[100%] mb-3">
                                    <label className="font-semibold text-sm">Popup Text</label>
                                    <input
                                        id="popUptext"
                                        type="text"
                                        placeholder=""
                                        onChange={(e) => {
                                            setContentValue(e.target.value);
                                        }}
                                        defaultValue={data?.content?.value}
                                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-wrap`}
                                    />
                                </div>
                            }
                            <div className="w-[100%] mb-3">
                                <label className="font-semibold text-sm">Status</label>
                                <DropDown
                                    onclick={(e) => handleStatus(e)}
                                    options={["Active", "Inactive"]}
                                    defaultOption={data?.status === true ? "Active" : "Inactive"}
                                />
                            </div>
                            <div className="w-[100%] mb-3">
                                <label className="font-semibold text-sm">Closeable </label>
                                <DropDown
                                    onclick={(e) => handleCloseable(e)}
                                    options={["True", "False"]}
                                    defaultOption={close ? "True" : "False"}
                                />
                            </div>
                            <div className='mb-3'>
                                <label className='font-semibold text-sm'>Type</label>
                                <DropDown
                                    onclick={(e) => onceOrMultiple(e)}
                                    options={["Show Once", "Every Time"]}
                                    defaultOption={data?.showType == 1 ? "Show Once" : "Every Time"}
                                />
                            </div>
                            {
                                !close &&
                                <div className="w-[100%] mb-3">
                                    <label className="font-semibold text-sm">Close After ?</label>
                                    <input
                                        id="displayTime"
                                        type="number"
                                        min="1"
                                        max="10"
                                        defaultValue={displayTime}
                                        onChange={(e) => setDisplayTime(e.target.value)}
                                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                    />
                                </div>
                            }
                            {/* <div className="w-[100%] mb-3">
                                <label className="font-semibold text-sm">Display Page </label>
                                <DropDown
                                    onclick={(e) => handleDisplayPage(e)}
                                    options={["Home", "Profile", "Wallet", "ReferAndEarn", "Calender", "Support", "Promoter", "Affiliate Program", "Become Eductor", "Enrolled", "CurrentAffairs"]}
                                    defaultOption={data?.displayPage}
                                />
                            </div> */}
                            <div className='mb-3'>
                                <label className='font-semibold text-sm'>Route Type &nbsp;<span className='font-semibold text-xs text-primary-red'>(Optional)</span></label>
                                <DropDown
                                    onclick={(e) => routeDropDown(e)}
                                    options={["None", "URL"]}
                                    defaultOption={data?.route?.type === 1 ? "URL" : "None"}
                                />
                            </div>
                            {
                                route === "URL" &&
                                <div className='mb-3'>
                                    <label className='font-semibold text-sm'>Route Url</label>
                                    <input
                                        id="popup-url"
                                        type="url"
                                        defaultValue={data?.route?.value}
                                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                    />
                                </div>
                            }
                        </div>

                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] shadow-xl p-3 h-fit">
                            <div className="w-[148px] h-[32px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-[1]"></div>
                            <div className="h-[46px] w-[4px] bg-gray-800 absolute -start-[3px] top-[124px] rounded-s-lg"></div>
                            <div className="h-[46px] w-[4px] bg-gray-800 absolute -start-[3px] top-[178px] rounded-s-lg"></div>
                            <div className="h-[64px] w-[4px] bg-gray-800 absolute -end-[3px] top-[142px] rounded-e-lg"></div>
                            <div className="relative rounded-[2rem] overflow-hidden w-[270px] h-[572px] bg-white dark:bg-gray-800">
                                <img src={process.env.PUBLIC_URL + "/Assets/Images/BannerPopup/popUp2.jpg"} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
                                <div className='absolute bg-slate-950 h-full w-full opacity-50' />
                                {popupType === "Image" ?
                                    <div>
                                        {data?.content?.value ? (
                                            <img src={!file ? data?.content?.value ?? "null" : URL.createObjectURL(file)} alt="Uploaded File" className="absolute inset-0 w-[250px] h-auto rounded-md object-contain mx-auto my-auto" />
                                        ) : (
                                            <div className='mt-3 absolute top-[30%] right-0 left-0 mx-auto flex items-center justify-center h-[200px] w-[250px]  border-dotted rounded-md'>
                                                <p className=" font-semibold text-white-color">Popup Preview</p>
                                            </div>
                                        )}
                                    </div>
                                    :
                                    <>
                                        <div className='absolute inset-0 w-[250px] min-h-[150px] bg-white-color shadow-lg rounded-md object-contain mx-auto my-auto h-fit overflow-y-auto'>
                                            <div className='w-full flex justify-between items-center p-1'>
                                                <p className="w-full mt-1 font-semibold text-base cursor-default text-center">
                                                    {popUpName || "Popup Name"}
                                                </p>
                                                <div>
                                                    <img
                                                        src={process.env.PUBLIC_URL + "/Assets/Images/closeIcon.svg"}
                                                        alt="close"
                                                        className="cursor-pointer"
                                                        onClick={() => handleClose()}
                                                    />
                                                </div>
                                            </div>
                                            <div className='p-2 max-h-[480px] min-h-[150px] overflow-y-auto flex items-center justify-center'>
                                                <p className='break-words font-medium text-sm'>{contentValue || "Popup Text"}</p>
                                            </div>
                                        </div>
                                    </>
                                }
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
                            onClick={() => handleEditPopup()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditPopup