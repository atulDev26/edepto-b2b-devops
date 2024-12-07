import { IconLogout } from '@tabler/icons-react';
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import { useNavigate } from 'react-router-dom';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { getApi, postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';
import { detectDevice } from '../../utils/detectDevice';

const Logout = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function handleLogOut() {
        loadingShow();
        let device = detectDevice()
        let resp = await postApi(urlApi.logOut, { device: device });
        loadingHide();
        if (resp.responseCode === 200) {
            localStorage.removeItem("userData");
            localStorage.removeItem("edepto-b2b-token");
            localStorage.removeItem("access-list");
            localStorage.removeItem("states");
            localStorage.removeItem("languages");
            localStorage.removeItem("otpId");
            localStorage.removeItem("question-language");
            handleClose();
            navigate("/", { replace: true });
        } else {
            toast.error(resp.message);
        }
    }
    return (
        <>
            <button className="bg-transparent text-primary-red mb-2 sm:mb-2 md:mb-[0px] px-4 py-2 flex items-center" onClick={() => handleShow()}>
                <IconLogout />
                &nbsp;Logout
            </button>
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                aria-labelledby="Send Notification"
                centered
            >
                <Modal.Body>
                    <div className='flex flex-col justify-center items-center px-10 py-3 gap-11'>
                        <p className='font-bold text-[28px]'>Logout</p>
                        <div className='flex flex-col justify-center items-center mb-8'>
                            <p className='font-semibold text-base text-[#475569]'>You are attempting to logout of Edepto.</p>
                            <p className='font-semibold text-base text-[#475569]'>Are you  Sure?</p>
                        </div>
                    </div>
                </Modal.Body>
                <div className="flex justify-between p-3">
                    <div className='w-[180px]'>
                        <ButtonUI
                            text={"Cancel"}
                            variant="transparent"
                            color={"var(--primary-red)"}
                            onClick={handleClose}
                        >
                            Cancel
                        </ButtonUI>
                    </div>
                    <div className='w-[180px]'>
                        <ButtonUI
                            text={"Logout"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => handleLogOut()}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Logout