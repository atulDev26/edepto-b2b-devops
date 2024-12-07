import { IconCirclePlus, IconUserShield } from '@tabler/icons-react';
import React, { useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { postApi } from '../../api/callApi';
import { ALL_LANGUAGE, STATES } from '../../api/localStorageKeys';
import { urlApi } from '../../api/urlApi';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import ButtonUI from '../Buttons/ButtonUI';
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import Students from '../../view/Students/Students';


const AddStudents = ({ callback }) => {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState();
    const ref = useRef(null);
    const stateData = JSON.parse(STATES());
    const [state, setState] = useState("");
    const [gender, setGender] = useState("");
    const [category, setCategory] = useState(null);
    const [status, setstatus] = useState(null);
    const [language, setLanguage] = useState("");
    const languageData = JSON.parse(ALL_LANGUAGE());
    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
    }

    const handleClose = () => {
        setShow(false);
        // setFile(null);
        // setCategory(null);
        // setState("");
        // setGender("");
        // setLanguage("")
    };
    const handleShow = () => setShow(true);

    function pageDropDown(event) {
        setState(event._id);
        return;
    }

    const handleGenderChange = (e) => {
        if (e === "MALE") {
            setGender(1);
        } else if (e === "Female") {
            setGender(2);
        } else {
            setGender(3);
        }
    };
    const handleCategoryChange = (e) => {
        if (e === "GEN") {
            setCategory(1);
        } else if (e === "OBC") {
            setCategory(2);
        } else if (e === "SC") {
            setCategory(3);
        } else if (e === "ST") {
            setCategory(4);
        } else if (e === "EWS") {
            setCategory(5);
        }

    };

    const handleStatusChange = (e) => {
        if (e === "Active") {
            setstatus(1);
        } else if (e === "InActive") {
            setstatus(2);
        }
    }

    const handleLanguageChange = (e) => {
        setLanguage(e?._id)
    }

    async function addNewStudent() {
        let newStudents = {
            mobileNumber: document.getElementById('number').value,
            ID: document.getElementById('id').value,
        }
        if (document.getElementById('batch').value) {
            newStudents.batch = document.getElementById('batch').value
        } if (document.getElementById('join-date').value) {
            newStudents.joinDate = document.getElementById('join-date').value
        } if (document.getElementById('about').value) {
            newStudents.userNote = document.getElementById('about').value
        }
        loadingShow();
        let resp = await postApi(urlApi.addStudents, newStudents);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            handleClose();
            if (callback) {
                callback();
            }
            document.getElementById('number').value = null;
            document.getElementById('about').value = null;
            document.getElementById('batch').value = null;
            document.getElementById('id').value = null;
            document.getElementById('join-date').value = null;
        } else {
            toast.error(resp.message);
        }
        return;
    }

    return (
        <>
            <MultiIconButtonUI
                prefixIcon={<IconUserShield size={20} />}
                suffixIcon={<IconCirclePlus size={18} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text="Add Student"
                onClick={() => handleShow()}
            />
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Add student"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Add New Student
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
                        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="name" className="font-medium text-sm">Mobile Number*</label>
                                <input
                                    id="number"
                                    type="tel"
                                    min="0"
                                    maxLength={10}
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">Batch</label>
                                <input
                                    id="batch"
                                    type="text"
                                    placeholder=""
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">ID*</label>
                                <input
                                    id="id"
                                    type="text"
                                    placeholder=""
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">Join Date</label>
                                <input
                                    id="join-date"
                                    type="date"
                                    min="0"
                                    className={`w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%] sm:col-span-2">
                                <label className="font-medium text-sm">User Note</label>
                                <textarea
                                    id="about"
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
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
                            text={"Add"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => addNewStudent()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddStudents