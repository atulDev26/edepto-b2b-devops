import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { getApi, postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import ButtonUI from '../Buttons/ButtonUI';


const AccessDetailsModal = ({ current_id, data, callBack, clearCallBack }) => {
    const [show, setShow] = useState(false);
    const [accessData, setAccessData] = useState([]);
    const handleClose = () => { setShow(false); clearCallBack() };
    const handleShow = () => { setShow(true); callBack() };

    useEffect(() => {
        if (show) {
            handleAccess();
        }
    }, [show])


    async function handleAccess() {
        loadingShow();
        let resp = await getApi(urlApi.getAccess + data?._id);
        loadingHide();
        if (resp.responseCode === 200) {
            let reduceData = resp.data?.reduce((acc, cur) => {
                if (!acc[cur.group]) {
                    acc[cur.group] = {};
                    acc[cur.group].groupName = cur.group;
                    acc[cur.group].subMenu = [];
                }
                acc[cur.group]?.subMenu?.push(cur);
                return acc;
            }, Object.create(null))
            setAccessData(Object.entries(reduceData).map(([key, value]) => { return value; }));
        } else {
            toast.error(resp.message)
        }
        return;
    }


    async function updateAccess() {
        let checkedLabels = [];
        let checkboxValues = document.querySelectorAll('input[name="checkbox"]:checked');
        for (let i = 0; i < checkboxValues.length; i++) {
            checkedLabels.push(checkboxValues[i].value);
        }
        let postData = {
            "functions": checkedLabels
        }
        const resp = await postApi(urlApi.updateAccessByTeacherId + data?._id, postData)
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            setShow(false)
        } else {
            toast.error(resp.message);
        }
        return;
    }


    const handleSelectAllCheckBox = (groupName, isChecked) => {
        setAccessData(prevData =>
            prevData?.map(group => {
                if (group.groupName === groupName) {
                    group.subMenu = group?.subMenu?.map(subItem => ({
                        ...subItem,
                        access: isChecked ? 'granted' : 'denied'
                    }));
                }
                return group;
            })
        );
    };

    const handleCheckboxChange = (groupName, functionName, isChecked) => {
        setAccessData(prevData =>
            prevData?.map(group => {
                if (group.groupName === groupName) {
                    group.subMenu = group?.subMenu?.map(subItem => {
                        if (subItem?.function === functionName) {
                            return {
                                ...subItem,
                                access: isChecked ? 'granted' : 'denied'
                            };
                        }
                        return subItem;
                    });
                }
                return group;
            })
        );
    };

    return (
        <>
            <i title='Update Access' className={`fa fa-eye fa-lg ${current_id === data._id ? "text-white" : "text-table-buttons-color"}`} aria-hidden="true" onClick={() => handleShow()}></i>

            <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                aria-labelledby="Add Teachers"
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Access Details<span className='bg-[#EAEFF7] text-primary-blue ml-2 px-2 py-1 rounded-lg font-semibold '>{data?.teacherName}</span>
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
                    <div style={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'scroll', overflowX: 'clip', padding: "10px" }} >
                        {
                            accessData?.map((item, index) => {
                                const allChecked = item.subMenu.every(subItem => subItem.access === 'granted');
                                return (
                                    <div key={index}>
                                        <div className="d-flex align-items-center gap-3">
                                            <p className='mb-1 text-[#5E6A7C]' style={{ fontSize: 18, fontWeight: 600, textTransform: 'capitalize' }} > {item.groupName === "submittedIssue" ? "Feedback / Support" : item.groupName}</p>
                                            <div className="cl-toggle-switch">
                                                <label className="cl-switch">
                                                    <input type="checkbox" checked={allChecked} onChange={e => handleSelectAllCheckBox(item.groupName, e.target.checked)} />
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="row p-2"> {
                                            item.subMenu.length !== 0 &&
                                            item.subMenu?.map((subItem, subIndex) => {
                                                return (
                                                    <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-2 col-xs-1" key={subIndex}>
                                                        <div className="d-flex gap-2 align-items-center justify-content-between p-2 mb-2 flex-wrap" style={{ border: '1px solid #ccc', borderRadius: 10 }}>
                                                            <label htmlFor={`access-check-${subItem?.function}`} style={{ cursor: 'pointer', wordBreak: 'break-all' }} >{subItem?.function}</label>

                                                            <label className="switch" htmlFor={`access-check-${subItem?.function}`} style={{ cursor: 'pointer', wordBreak: 'break-all' }} >
                                                                <input id={`access-check-${subItem?.function}`} value={subItem?.function} type="checkbox" name='checkbox' defaultChecked={subItem?.access === "granted"} checked={subItem?.access === 'granted'}
                                                                    onChange={e =>
                                                                        handleCheckboxChange(
                                                                            item.groupName,
                                                                            subItem?.function,
                                                                            e.target.checked
                                                                        )} />
                                                                <span className="slider"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                )
                            })
                        }
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
                            onClick={() => updateAccess()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AccessDetailsModal