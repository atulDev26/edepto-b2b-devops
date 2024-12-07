import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../../Buttons/ButtonUI';
import { postApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { toast } from 'sonner';

const EditSection = ({callback,categoryIdPlusSubCategoryIdPlusSectionId,name,shortName,orderby}) => {
    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);

    async function addTestSection() {
        let postData = {
            "name": document.getElementById("name").value,
            "shortName": document.getElementById("shortname").value,
            "orderBy": document.getElementById("order").value
        }
        let resp = await postApi(urlApi.editTestSection + categoryIdPlusSubCategoryIdPlusSectionId, postData)
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            if (callback) {
                callback()
            }
            handleClose();
        } else {
            toast.error(resp.message)
        }
        return
    }

    return (
        <>
            <i className="fa fa-pencil-square-o fa-lg text-primary-blue" aria-hidden="true" onClick={() => handleShow()}></i>
               
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Edit Test Section"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                        Edit Test Section
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
                    <div className="p-4 flex flex-col items-center justify-center gap-2">
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Test Section Name</label>
                            <input
                                autoFocus
                                id="name"
                                type="text"
                                placeholder=""
                                defaultValue={name}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Short Name</label>
                            <input
                                id="shortname"
                                type="text"
                                placeholder=""
                                defaultValue={shortName}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Enter Order</label>
                            <input
                                id="order"
                                type="number"
                                placeholder=""
                                defaultValue={orderby}
                                min={0}
                                max={1000}
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
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
                            onClick={() => addTestSection()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditSection