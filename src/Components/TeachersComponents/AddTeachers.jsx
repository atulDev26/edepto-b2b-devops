import {
    IconCamera,
    IconCirclePlus,
    IconUserShield
} from "@tabler/icons-react";
import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { WithContext as ReactTags } from 'react-tag-input';
import { toast } from "sonner";
import { postApi } from "../../api/callApi";
import { STATES } from "../../api/localStorageKeys";
import { urlApi } from "../../api/urlApi";
import { uploadImage } from "../../utils/commonFunction/ImageUpload";
import { loadingHide, loadingShow } from "../../utils/gloabalLoading";
import ButtonUI from "../Buttons/ButtonUI";
import MultiIconButtonUI from "../Buttons/MultiIconButtonUI";
import DropDown from "../DropDown/DropDown";
import DropdownWithImage from "../DropDown/DropdownWithImage";


const AddTeachers = ({ callback }) => {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const ref = useRef(null);
    const [gender, setGender] = useState("");
    const [state, setState] = useState("");
    const [tags, setTags] = useState([]);
    const stateData = JSON.parse(STATES());

    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
        return;
    }

    const handleGenderChange = (e) => {
        setGender(e);
    };

    const handleClose = () => { setFile(null); setShow(false); setTags([]); setGender(""); };
    const handleShow = () => setShow(true);

    function pageDropDown(event) {
        setState(event);
        return;
    }

    const handleDelete = i => {
        setTags(tags?.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        if (tag.text.length >= 2) setTags([...tags, tag]);
        else {
            toast.error("Please enter at least 2 characters");
        }
        return;
    };

    async function addNewTeachers() {
        let apiUrl = urlApi.uploadFile;
        let imageData = await uploadImage(file, apiUrl);
        let newTeachers = {
            teacherName: document.getElementById('name').value,
            phone: document.getElementById('number').value,
        }
        if (gender) {
            newTeachers.gender = gender
        }
        if (document.getElementById('date').value) {
            newTeachers.dob = document.getElementById('date').value
        }
        if (state?._id) {
            newTeachers.state = state?._id
        }
        if (document.getElementById('city').value) {
            newTeachers.city = document.getElementById('city').value
        }
        if (document.getElementById('pincode').value) {
            newTeachers.pincode = document.getElementById('pincode').value
        }
        if (imageData) {
            newTeachers.profilePic = imageData;
        }
        if (document.getElementById('email').value) {
            newTeachers.email = document.getElementById('email').value
        }
        if (tags) {
            newTeachers.category = tags?.map((tag) => { return tag?.text })
        }
        if (document.getElementById('about').value) {
            newTeachers.about = document.getElementById('about').value
        }
        loadingShow();
        let resp = await postApi(urlApi.addTeachers, newTeachers);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            handleClose();
            if (callback) {
                callback();
            }
            document.getElementById('name').value = null;
            document.getElementById('number').value = null;
            document.getElementById('email').value = null;
            document.getElementById('date').value = null;
            document.getElementById('city').value = null;
            document.getElementById('pincode').value = null;
            document.getElementById('about').value = null;
            setGender("");
            setTags([]);
            setFile(null);
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
                text="Add Teacher"
                onClick={() => handleShow()}
            />
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
                aria-labelledby="Add Teachers"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Add New Teacher
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

                        <div className="w-fit mx-auto mb-2">
                            <div className="w-fit mx-auto relative cursor-pointer"
                                onClick={() => {
                                    ref.current.click();
                                }}>
                                <div className="bg-primary-blue w-fit rounded-full p-1 absolute top-0 right-0" style={{
                                    border: "2px solid #E6E6E6",
                                }}>
                                    <IconCamera
                                        size={18}
                                        stroke={2}
                                        color="#ffffff"
                                        className="cursor-pointer"
                                    />
                                </div>
                                <img
                                    src={!file ? process.env.PUBLIC_URL + "/Assets/Images/defaultImg.svg" : URL.createObjectURL(file)}
                                    alt=""
                                    className="w-[98px] h-[98px] rounded-full object-contain border-[4px] mx-auto border-[#E6E6E6]"
                                    style={{
                                        border: "4px solid #E6E6E6",
                                    }}
                                />
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                ref={ref}
                                accept={["image/jpeg", "image/png", "image/gif"]}
                                onChange={(e) => {
                                    handleImageUpload(e);
                                }}
                            />
                            <p className="text-center mt-2 mb-2 font-medium text-sm text-black">Profile Picture (Max Limit 5MB)</p>
                        </div>

                        <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="name" className="font-medium text-sm">Full Name *</label>
                                <input
                                    autoFocus
                                    id="name"
                                    type="text"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="name" className="font-medium text-sm">Mobile Number*</label>
                                <input
                                    id="number"
                                    type="tel"
                                    placeholder=""
                                    min="0"
                                    maxLength={10}
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="name" className="font-medium text-sm">Email ID</label>
                                <input
                                    id="email"
                                    type="email"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="name" className="font-medium text-sm">Gender</label>
                                <DropDown
                                    onclick={handleGenderChange}
                                    options={["Male", "Female", "Other"]}
                                    defaultOption="Select Gender"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">DOB</label>
                                <input
                                    id="date"
                                    type="date"
                                    min="0"
                                    className={`w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">State</label>
                                <DropdownWithImage
                                    onclick={(e) => pageDropDown(e)}
                                    options={stateData}
                                    defaultOption="Select State"
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    placeholder=""
                                    min="0"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">Pincode</label>
                                <input
                                    id="pincode"
                                    type="tel"
                                    placeholder=""
                                    min="0"
                                    maxLength={6}
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label htmlFor="name" className="font-medium text-sm">Category</label>
                                <ReactTags
                                    tags={tags}
                                    allowDragDrop={false}
                                    handleDelete={handleDelete}
                                    handleAddition={handleAddition}
                                    inputFieldPosition="top"
                                    autofocus={false}
                                    placeholder="Press enter to add category"
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                    classNames={{
                                        tagInputField: "tagInputField",
                                        tag: "singleTag",
                                        remove: "removeIcon",
                                        selected: "selectedArea"
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%] sm:col-span-2">
                                <label className="font-medium text-sm">About</label>
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
                            onClick={() => addNewTeachers()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddTeachers;
