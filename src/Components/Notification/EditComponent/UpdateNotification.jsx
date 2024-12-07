import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../../Buttons/ButtonUI';
import DropDown from '../../DropDown/DropDown';
import EditPopUp from './EditPopUp';
import EditNormalPopup from './EditNormalPopup';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { toast } from 'sonner';
import { getApi, postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { uploadImage } from '../../../utils/commonFunction/ImageUpload';

const UpdateNotification = ({ data }) => {
    const [show, setShow] = useState(false);
    const [localFile, setLocalFile] = useState(null);
    const [popUpfile, setPopUpfile] = useState(null);
    const [popUpFileDetails, setPopUpFileDetails] = useState(null);

    const [resetFilter, setResetFilter] = useState(false);
    const [notificationType, setNotificationType] = useState("");

    useEffect(() => {
        if (show) {
            setNotificationType(capitalizeFirstLetter(data?.type))
        }
    }, [show])

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function handleNotificationType(event) {
        setNotificationType(capitalizeFirstLetter(event));
    }

    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);


    async function sendNotification(notificationID) {
        loadingShow();
        let resp = await getApi(urlApi.sendNotification + notificationID);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
        } else {
            toast.error(resp.message);
        }
    }

    const updateandsendNotification = async () => {
        let imageData = data?.imageUrl;
        let imageDataPopUp = data?.imageUrl;
        let imageDataPopUpTwo = data?.popup?.imageUrl

        if (localFile) {
            const apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(localFile, apiUrl);
        }
        if (popUpfile) {
            const apiUrl = urlApi.uploadFile;
            imageDataPopUp = await uploadImage(popUpfile, apiUrl);
        }
        if (popUpFileDetails) {
            const apiUrl = urlApi.uploadFile;
            imageDataPopUpTwo = await uploadImage(popUpFileDetails, apiUrl);
        }

        let normalNotification = {
            type: "normal",
            title: document.getElementById("title")?.value,
            text: document.getElementById("message")?.value,
            scheduleDate: document.getElementById("scheduled")?.value,
            imageUrl: imageData
        }

        let popUpNotification = {
            "type": "popup",
            "text": document.getElementById("topic")?.value,
            "title": document.getElementById("popup-title")?.value,
            "imageUrl": imageDataPopUp,
            "scheduleDate": document.getElementById("popup-scheduled")?.value,
            "popup": {
                "title": document.getElementById("popup-title")?.value,
                "body": document.getElementById("popupDetails-description")?.value,
                "imageUrl": imageDataPopUpTwo,
                "url": document.getElementById("popupDetails-url")?.value,
            }
        }

        loadingShow();
        let resp = await postApi(urlApi.editNotification + data?._id, notificationType === "Normal" ? normalNotification : popUpNotification)
        loadingHide();
        if (resp.responseCode === 200) {
            sendNotification(data?._id)
            toast.success(resp.message);
            handleClose();
        } else {
            toast.error(resp.message);

        }
        return;
    }


    return (
        <>
            <i className="fa fa-plane fa-lg text-green-400" aria-hidden="true" onClick={() => handleShow()}></i>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                aria-labelledby="Send Notification"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <div className='flex justify-start items-center gap-2'>
                            <p className="font-semibold text-base cursor-default">
                                Send Notification
                            </p>
                        </div>
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
                        <div className='w-[200px] mb-2'>
                            <DropDown onclick={(e) => { handleNotificationType(e) }}
                                options={["Normal", "Popup"]}
                                defaultOption={notificationType} reset={resetFilter} />
                        </div>
                        {notificationType === "Normal" && <EditNormalPopup callback={(file) => { setLocalFile(file) }} data={data} />}
                        {notificationType === "Popup" && <EditPopUp callback={(file) => setPopUpfile(file)} callbackTwo={(file) => setPopUpFileDetails(file)} data={data} />}
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
                            onClick={() => updateandsendNotification()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpdateNotification