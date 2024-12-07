import React from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ButtonUI from '../Buttons/ButtonUI';

const LoginSignUpModal = ({ isShow, handleClose }) => {

    function handleLoginWithAnotherNumber() {
        document.getElementById("phoneNumber").value = null;
        handleClose();
    }

    return (
        <>
            <Modal
                show={isShow}
                onHide={handleClose}
                size="md"
                aria-labelledby="Send Notification"
                centered
                backdrop="static"
            >
                <Modal.Body>
                    <div className='flex flex-col justify-center items-center px-10 py-3 gap-4'>
                        <p className='font-medium text-lg '>This mobile number does not exist in our system</p>
                        <Link to={"/login"} className='w-full'>
                            <ButtonUI
                                text={"Login with another number"}
                                variant="transparent"
                                color={"var(--primary-blue)"}
                                onClick={() => handleLoginWithAnotherNumber()}
                            />
                        </Link>
                        <Link to={"/sign-up"} className='w-full'>
                            <ButtonUI
                                text={"Signup with this number"}
                                variant="transparent"
                                color={"var(--primary-red)"}
                                onClick={handleClose}
                            />
                        </Link>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default LoginSignUpModal