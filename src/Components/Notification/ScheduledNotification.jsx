import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { getFormattedDateTime } from '../../utils/commonFunction/dateTimeConverter';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import ButtonUI from '../Buttons/ButtonUI';

const ScheduledNotification = ({date,notificationID,callback}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);

    useEffect(() => {
       if(show){
        document.getElementById('scheduled').value= getFormattedDateTime(date)
       }
    }, [show])



    async function handleReScheduled() {
        let scheduledData = {
            scheduleDate: document.getElementById("scheduled").value
        }
        loadingShow();
        let resp = await postApi(urlApi.updateSchedule + notificationID, scheduledData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            if(callback){
                callback()
            }
            handleClose();
        } else {
            toast.error(resp.message);
        }
        return;
    }

    return (
        <>
            <i className="fa fa-calendar fa-lg text-primary-blue" aria-hidden="true" onClick={() => handleShow()}></i>
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
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
                        <div>
                            <label className='font-semibold text-sm'>Scheduled</label>
                            <input
                                id='scheduled'
                                type="datetime-local"
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 "
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
                            onClick={() => handleReScheduled()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ScheduledNotification