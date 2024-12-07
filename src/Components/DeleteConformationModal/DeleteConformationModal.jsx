import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import { IconCopyCheckFilled } from '@tabler/icons-react';

const DeleteConformationModal = ({ onclick, content, heading, complete }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
    };

    const handleShow = () => setShow(true);

    return (
        <>
            {!complete ? <i className="fa fa-trash-o fa-lg text-primary-red cursor-pointer" aria-hidden="true" onClick={() => handleShow()}></i> :
                <IconCopyCheckFilled className='cursor-pointer text-primary-blue' onClick={() => handleShow()} />
            }
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                aria-labelledby="Add Teachers"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default text-primary-red">
                            {heading}
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
                    <div className='p-3'>
                        {content}
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
                            text={!complete ? "Delete" : "Sure"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => { onclick(); handleClose() }}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteConformationModal