import { IconBell, IconCirclePlus } from '@tabler/icons-react'
import React, { useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'sonner'
import { postApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { uploadImage } from '../../utils/commonFunction/ImageUpload'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import ButtonUI from '../Buttons/ButtonUI'
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI'
import DropDown from '../DropDown/DropDown'
import NormalPopUp from './NormalPopUp'
import PopUpNotification from './PopUpNotification'

const SendNotificationModal = ({ callback }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  const [localFile, setLocalFile] = useState(null);
  const [popUpfile, setPopUpfile] = useState(null);
  const [popUpFileDetails, setPopUpFileDetails] = useState(null);

  const [resetFilter, setResetFilter] = useState(false);
  const [notificationType, setNotificationType] = useState("Normal");

  const handleClose = () => { setShow(false); setNotificationType("Normal") };
  const handleShow = () => setShow(true);

  const handleAddNormal = async () => {
    let apiUrl = urlApi.uploadFile;
    let imageData = await uploadImage(localFile, apiUrl);
    let imageDataPopUp = await uploadImage(popUpfile, apiUrl);
    let imageDataPopUpTwo = await uploadImage(popUpFileDetails, apiUrl);

    let normalNotification = {
      type: "normal",
      title: document.getElementById("title")?.value,
      // topic: document.getElementById("topic")?.value,
      text: document.getElementById("message")?.value,
      scheduleDate: document.getElementById("scheduled")?.value,
      imageUrl: imageData
    }

    let popUpNotification = {
      "type": "popup",
      "text": document.getElementById("popup-topic")?.value,
      "title": document.getElementById("popup-title")?.value,
      "imageUrl": imageDataPopUp,
      "scheduleDate": document.getElementById("popup-scheduled")?.value,
      "popup": {
        "title": document.getElementById("popup-topic")?.value,
        "body": document.getElementById("popupDetails-description")?.value,
        "imageUrl": imageDataPopUpTwo,
        "url": document.getElementById("popupDetails-url")?.value,
      }
    }
    loadingShow();
    let resp = await postApi(urlApi.createNotification, notificationType === "Normal" ? normalNotification : popUpNotification)
    loadingHide();
    if (resp.responseCode === 200) {
      if (callback) {
        callback();
      }
      toast.success(resp.message);
      handleClose();
    } else {
      toast.error(resp.message);
    }
    return;
  }

  function handleNotificationType(event) {
    setNotificationType(event);
  }

  return (
    <>
      <MultiIconButtonUI
        prefixIcon={<IconBell size={23} />}
        suffixIcon={<IconCirclePlus size={18} />}
        variant="fill"
        color={"var(--primary-blue)"}
        text="Add Notification"
        onClick={() => handleShow()}
      />

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
                options={["Normal", "PopUp"]}
                defaultOption={notificationType} reset={resetFilter} />
            </div>
            {notificationType === "Normal" && <NormalPopUp callback={(file) => { setLocalFile(file) }} />}
            {notificationType === "PopUp" && <PopUpNotification callback={(file) => setPopUpfile(file)} callbackTwo={(file) => setPopUpFileDetails(file)} />}
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
              onClick={() => handleAddNormal()}
            />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SendNotificationModal