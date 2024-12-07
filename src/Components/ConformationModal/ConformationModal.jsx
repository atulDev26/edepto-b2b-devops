import React, { useState } from 'react'
import ButtonUI from '../Buttons/ButtonUI';
import { Modal } from 'react-bootstrap';
import { IconCircleX } from '@tabler/icons-react';

const ConformationModal = ({ handleOperation, bodyText, title, components, text }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    async function handleConform() {
        await handleOperation();
        handleClose();
        return;
    }
    return (
        <>
            <button className="bg-transparent text-primary-red flex items-center" onClick={() => handleShow()}>
                {components}
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
                        <p className='font-bold text-[28px]'>
                            {/* {needCross && <IconCircleX size={60} className='text-primary-yellow' />} */}
                        </p>
                        <div className='flex flex-col justify-center items-center mb-8'>
                            <p className='font-semibold text-base text-[#475569]'>{
                                bodyText ? bodyText : "Are You Sure You Want To Delete!! "}</p>
                        </div>
                    </div>
                </Modal.Body>
                <div className="flex justify-between p-3">
                    <div className='w-[150px]'>
                        <ButtonUI
                            text={"Cancel"}
                            variant="transparent"
                            color={"var(--primary-red)"}
                            onClick={handleClose}
                        />
                    </div>
                    <div className='w-[150px]'>
                        <ButtonUI
                            text={text || "Sure"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => handleConform()}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ConformationModal