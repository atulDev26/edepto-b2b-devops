import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';

const PricePlanContactTeam = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => { handleIntrustedUser(); };
    const handleShow = () => {
        setShow(true);
    };

    async function handleIntrustedUser(param) {
        loadingShow();
        let postData = {}
        let about = document.getElementById("other-details").value;
        if (about) {
            postData.message = about
        }
        let resp = await postApi(urlApi.customPlan, postData);
        setShow(false);
        loadingHide();
        if (param == "SUB") {
            if (resp.responseCode === 200) {
                toast.success(resp.message)
            } else {
                toast.error(resp.message)
            }
        }
        return
    }


    return (
        <>
            <button className={`w-full p-2 rounded-xl font-medium text-sm bg-blue hover:text-primary-blue`} onClick={() => handleShow()}>
                Contact Us for More Details
            </button>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Contact our Team form"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Contact our Team
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
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Any Message</label>
                            <textarea
                                maxLength="250"
                                id="other-details"
                                type="text"
                                placeholder="type here .."
                                className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-50`}
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
                            text={"Submit"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => handleIntrustedUser("SUB")}
                        />
                    </div>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default PricePlanContactTeam