import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { extractDate } from '../../utils/commonFunction/dateTimeConverter';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import ButtonUI from '../Buttons/ButtonUI';

const EditAssignPass = ({ callback, passData }) => {
    
    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);

    async function editMyPass() {
        let postData = {
            "expiresAt": document.getElementById("expire").value
        }
        loadingShow();
        let resp = await postApi(urlApi.editAssignPass + passData?._id, postData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            if (callback) {
                callback()
            }
            handleClose()
        } else {
            toast.error(resp.message)
        }
        return;
    }

    return (
        <>
            <i className={`fa fa-edit fa-lg text-primary-blue cursor-pointer`} onClick={() => handleShow()}></i>
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                aria-labelledby="Assign Pass"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                           Edit Assign Pass
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
                    <div className='p-2'>
                        <div className="form-group">
                            <label>Edit Expires At</label>
                            <input type="date"
                                name="meeting-time"
                                defaultValue={extractDate(passData?.expiresAt)}
                                min="2018-06-07"
                                max="2040-06-14" className="form-control" placeholder='YYYY-MM-DD' id='expire' />
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
                            onClick={() => editMyPass()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditAssignPass