import React, { useState } from 'react'
import { getLanguageStringFromShortCode } from '../../../utils/getDataFromId';
import ButtonUI from '../../Buttons/ButtonUI';
import { Modal } from 'react-bootstrap';
import { IconEye } from '@tabler/icons-react';

const SeeQuestion = ({ questionData, selectedLang, sectionId, testId, callback, questionId }) => {
    let optionsData = questionData?.options;
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            <IconEye color={"var(--primary-blue)"} onClick={() => handleShow()} className='cursor-pointer' />
            <Modal
                enforceFocus={false}
                show={show}
                onHide={handleClose}
                backdrop="static"
                size="xl"
                keyboard={false}
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            View Question in <span className='bg-[#EAEFF7] text-primary-blue ml-2 px-2 py-1 rounded-lg font-semibold' >{getLanguageStringFromShortCode(selectedLang)}</span>
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
                        <div>
                            <p className="font-semibold text-base cursor-default">Question</p>
                            <p className='p-3' dangerouslySetInnerHTML={{ __html: questionData?.value }}></p>
                        </div>
                        <div className="row">
                            {
                                optionsData?.map((data, index) => {
                                    return (
                                        <div key={data?._id}>
                                            <div className="d-flex justify-content-between px-4">
                                                <p className="font-semibold text-base cursor-default">
                                                    {"Option - " + data?.prompt}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='px-5 py-3' dangerouslySetInnerHTML={{ __html: data?.value }}></p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
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
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SeeQuestion