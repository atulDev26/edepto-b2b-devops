import { IconCodePlus } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { getApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';

const AssignPassToStudent = ({ studentId, callback }) => {
    const [show, setShow] = useState(false);
    const [activePass, setActivePass] = useState([]);
    const [selectedCheckboxId, setSelectedCheckboxId] = useState(null);

    const handleClose = () => { setShow(false); setSelectedCheckboxId(false) };
    const handleShow = () => { setShow(true) };

    useEffect(() => {
        if (show && hasAccess(accessKeys?.getPassToAssign)) {
            getAllPass();
        }
    }, [show])

    async function getAllPass() {
        loadingShow();
        let resp = await getApi(urlApi.passList + studentId);
        loadingHide();
        if (resp.responseCode === 200) {
            setActivePass(resp.data);
        } else {
            toast.error(resp.message);
        }
        return;
    }

    function onCheckBoxClick(categoryId) {
        setSelectedCheckboxId(categoryId);
        return;
    }

    async function assignPassToStudent() {
        loadingShow();
        let resp = await getApi(urlApi.assignPass + studentId + '/' + selectedCheckboxId);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            if (callback) {
                callback();
            }
            handleClose();
        } else {
            toast.error(resp.message);
        }
        return;
    }


    return (
        <>
            <MultiIconButtonUI
                suffixIcon={<IconCodePlus size={18} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text="Assign Pass"
                onClick={() => handleShow()}
            />
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
                            Assign Pass
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
                    {activePass?.length ? <div className='p-3 h-auto max-h-[350px] overflow-y-auto'>
                        {
                            activePass?.map((item, index) => {
                                return (
                                    <div className='flex items-center gap-3 mb-2' key={index}>
                                        <input className='bg-slate-300 rounded-full' type="checkbox" id={`studentPass-${item?._id}`} onChange={() => onCheckBoxClick(item?._id)} checked={selectedCheckboxId === item?._id} required />
                                        <label htmlFor={`studentPass-${item?._id}`}>{item?.passName}</label>
                                        {/* <span style={{ textDecoration: "line-through", color: "var(primary-red)" }}><span>₹{item?.withoutDiscountPrice}</span></span>
                                    <p className='m-0' style={{ color: "green" }}>₹{item?.price}</p> */}
                                    </div>
                                )
                            })
                        }
                    </div> :
                        <div className='flex justify-center items-center'>
                            <p className='text-primary-red'>No Pass Found</p>
                        </div>
                    }

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
                            text={"Add"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => assignPassToStudent()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AssignPassToStudent