import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';

const RemarksModal = ({data,callback}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false)};
    const handleShow = () => setShow(true);

    async function handleRemarks(){
        let postData = {
            remarks: document.getElementById("remarks").value
        }
        loadingShow();
        let resp =  await postApi(urlApi.updateIssue + data._id , postData);
        loadingHide();
        if(resp.responseCode === 200) {
            toast.success(resp.message);
            if(callback){
                callback();
            }
            document.getElementById("remarks").value= null;
            handleClose();
        }else{
            toast.error(resp.message);
        }
    }

    
    return (
        <>
            <i className={`fa fa-edit fa-lg text-primary-blue`} aria-hidden="true" onClick={() => handleShow()}></i>
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                aria-labelledby="Add Teachers"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold  text-base ">
                            Remarks <span className='bg-[#EAEFF7] px-2 py-1 text-primary-blue rounded-xl'>{data?.studentName}</span> 
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
                
                <div className="flex flex-col gap-1 w-[100%] p-4">
                    <label htmlFor="name" className="font-medium text-sm">Remarks</label>
                    <input
                        autoFocus
                        id="remarks"
                        type="text"
                        placeholder="Enter Remarks"
                        className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer
                style={{

                    backgroundColor: "#F5F7FB",
                    borderRadius: "0px 0px 20px 20px",
                }}
            >
                <div className="flex gap-3">
                    <ButtonUI
                        text={"Pending"}
                        variant="transparent"
                        color={"var(--primary-red)"}
                        onClick={handleClose}
                    >
                        Cancel
                    </ButtonUI>
                    <ButtonUI
                        text={"Resolve"}
                        variant="transparent"
                        color={"var(--primary-blue)"}
                        onClick={() =>handleRemarks()}
                    />
                </div>
            </Modal.Footer>
        </Modal >
        </>

    )
}

export default RemarksModal