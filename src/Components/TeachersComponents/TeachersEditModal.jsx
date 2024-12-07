import { IconBook2, IconBuildingBridge, IconCalendar, IconCamera, IconGenderBigender, IconIdBadge2, IconListDetails, IconMail, IconMapPinCode, IconPhone, IconPresentation, IconUserCircle } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { loadingHide, loadingShow } from "../../utils/gloabalLoading";
import { toast } from "sonner";
import { postApi } from "../../api/callApi";
import { urlApi } from "../../api/urlApi";
import { getDateFromDateISOString } from "../../utils/commonFunction/extractDateFromDateTime";
import DropdownWithImage from "../DropDown/DropdownWithImage";
import { STATES } from "../../api/localStorageKeys";
import { WithContext as ReactTags } from 'react-tag-input';
import { uploadImage } from "../../utils/commonFunction/ImageUpload";
import { addDefaultImg } from "../../utils/commonFunction/defaultImage";
import { hasAccess } from "../../utils/StaticData/accessList";
import { accessKeys } from "../../utils/accessKeys.utils";


const TeachersEditModal = (props) => {
    const stateData = JSON.parse(STATES());
    const [state, setState] = useState(stateData?.find(item => item?._id == props?.teacherData?.state || []));
    const [tags, setTags] = useState(props?.teacherData?.category || []);
    const defaultStateOption = stateData?.find(item => item?._id == props?.teacherData?.state) || [];
    const [file, setFile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [gender, setGender] = useState("")
    const ref = useRef(null);

    useEffect(() => {
        const initialTags = (props?.teacherData?.category || []).map((category, index) => ({
            id: index.toString(),
            text: category
        }));
        setTags(initialTags);
    }, []);

    useEffect(() => {
        if (props?.onHide) {
            setIsEdit(false)
        }
    }, [props?.onHide])



    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };
    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(URL.createObjectURL(e?.target?.files[0]));
        }
    }
    function handleEdit() {
        setIsEdit(!isEdit);
    }

    const handleDelete = i => {
        setTags(tags?.filter((tag, index) => index !== i));
    };

    const handleAddition = tag => {
        if (tag.text.length >= 2) setTags([...tags, tag]);
        else {
            toast.error("Please enter at least 2 characters");
        }
    };

    async function handleEditTeachersProfile() {
        let imageData = props?.teacherData?.profilePic;
        if (file) {
            const apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(file, apiUrl);
        }
        let editTeachers = {
            teacherName: document.getElementById('name').value,
        }
        if (gender || props?.teacherData.gender) {
            editTeachers.gender = gender || props?.teacherData.gender;
        }
        if (state?._id) {
            editTeachers.state = state?._id
        }
        if (document.getElementById('city').value) {
            editTeachers.city = document.getElementById('city').value
        }
        if (document.getElementById('pincode').value) {
            editTeachers.pincode = document.getElementById('pincode').value
        }
        if (document.getElementById('date').value) {
            editTeachers.dob = document.getElementById('date').value
        }
        if (imageData) {
            editTeachers.profilePic = imageData
        }
        if (document.getElementById('email').value) {
            editTeachers.email = document.getElementById('email').value
        }
        if (tags) {
            editTeachers.category = tags?.map((tag) => { return tag?.text })
        }
        if (document.getElementById('about').value) {
            editTeachers.about = document.getElementById('about').value
        }
        loadingShow();
        let resp = await postApi(urlApi.editTeacher + props?.teacherData?._id, editTeachers);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            props.onHide();
            if (props.callback) {
                props.callback();
            }
            document.getElementById('name').value = null;
            document.getElementById('number').value = null;
            document.getElementById('email').value = null;
            document.getElementById('date').value = null;
            document.getElementById('city').value = null;
            document.getElementById('pincode').value = null;
            document.getElementById('about').value = null;
            setGender("");
        } else {
            toast.error(resp.message);
        }
    }
    function pageDropDown(event) {
        setState(event);
        return;
    }


    return (
        <Modal
            {...props}
            size={"lg"}
            aria-labelledby="Edit Modal of Teachers"
            centered
            backdrop="static"
        >
            <Modal.Body>
                <div className="flex gap-3 relative bg-[#D94230]  h-[126px] rounded-2xl p-3">
                    <div className="w-fit cursor-pointer" onClick={() => {
                        isEdit && ref.current.click();
                    }}>
                        <img
                            src={!file ? (props?.teacherData?.profilePic ?? "null") : URL.createObjectURL(file)}
                            alt=""
                            className="w-[98px] h-[98px] rounded-full object-contain border-[4px] border-[#E6E6E6] bg-white-color"
                            onError={({ currentTarget }) => { addDefaultImg(currentTarget) }}
                            style={{
                                border: "4px solid #E6E6E6",
                            }}
                        />
                        <input
                            type="file"
                            className="hidden"
                            ref={ref}
                            accept={["image/jpeg", "image/png", "image/gif"]}
                            onChange={(e) => {
                                handleImageUpload(e);
                            }}
                        />
                        {isEdit && <div className="bg-white-color w-fit rounded-full p-1 relative bottom-[100px] left-[68px]">
                            <IconCamera
                                size={18}
                                stroke={2}
                                color="#024CC7"
                                className="cursor-pointer"

                            />
                        </div>}
                    </div>
                    <div className="flex flex-col justify-center items-baseline">
                        <span className="absolute right-4 top-2 ">
                            <i
                                className="fa fa-times fa-lg text-white cursor-pointer"
                                aria-hidden="true"
                                onClick={props.onHide}
                            ></i>
                        </span>
                        <p className={`font-bold text-lg text-white-color`}>{props?.teacherData?.teacherName}</p>

                        <p className={`font-medium text-sm text-white-color`}>
                            {props?.teacherData?.email}
                        </p>
                    </div>
                </div>
                <div className="teachers-info h-fit p-3 bg-white-color overflow-y-auto">
                    <div className="flex items-center gap-x-4 mb-2">
                        <IconUserCircle color="#D94230" />
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Name*</label>
                            {isEdit ?
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    defaultValue={props?.teacherData?.teacherName}
                                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{props?.teacherData?.teacherName}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <IconPhone color="#D94230" />
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Phone*</label>
                            {isEdit ?
                                <input
                                    id="number"
                                    type="tel"
                                    disabled
                                    placeholder="Phone Number"
                                    defaultValue={props?.teacherData?.phone}
                                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
                                /> :
                                <p>{props?.teacherData?.phone}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <IconMail color="#D94230" />
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Email</label>
                            {isEdit ?
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    defaultValue={props?.teacherData?.email}
                                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{props?.teacherData?.email}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <IconGenderBigender color="#D94230" />
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Gender*</label>
                            {isEdit ?
                                <div className="">
                                    <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleGenderChange} defaultValue={props?.teacherData?.gender}>
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div> :
                                <p>{props?.teacherData?.gender}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <IconBook2 color="#D94230" />
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Category</label>
                            {isEdit ?
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
                                /> :
                                <div className="p-2 flex gap-2 flex-wrap">
                                    {props?.teacherData?.category?.map((category, i) => {
                                        return (
                                            <p key={i} className="px-2 py-1 rounded-lg bg-primary-blue text-white font-semibold text-sm ">{category}</p>
                                        )
                                    })}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <div><IconCalendar color="#D94230" /></div>
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">DOB*</label>
                            {isEdit ?
                                <input
                                    id="date"
                                    type="date"
                                    min="0"
                                    defaultValue={getDateFromDateISOString(props?.teacherData?.dob)}
                                    className={`w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{getDateFromDateISOString(props?.teacherData?.dob)}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <div>
                            <IconListDetails color="#D94230" />
                        </div>
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">State*</label>
                            {isEdit ?
                                <DropdownWithImage
                                    onclick={(e) => pageDropDown(e)}
                                    options={stateData}
                                    defaultOption={defaultStateOption}
                                /> :
                                <p>{defaultStateOption?.states}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <div>
                            <IconBuildingBridge color="#D94230" />
                        </div>
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">City*</label>
                            {isEdit ?
                                <input
                                    id="city"
                                    type="text"
                                    placeholder=""
                                    min="0"
                                    defaultValue={props?.teacherData?.city}
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{props?.teacherData?.city}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <div>
                            <IconMapPinCode color="#D94230" />
                        </div>
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Pincode*</label>
                            {isEdit ?
                                <input
                                    id="pincode"
                                    type="tel"
                                    placeholder=""
                                    maxLength={6}
                                    min="0"
                                    defaultValue={props?.teacherData?.pincode}
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{props?.teacherData?.pincode}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <div>
                            <IconIdBadge2 color="#D94230" />
                        </div>
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">About</label>
                            {isEdit ?
                                <textarea
                                    maxlength="60"
                                    id="about"
                                    type="text"
                                    placeholder="About"
                                    defaultValue={props?.teacherData?.about}
                                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{props?.teacherData?.about}</p>}
                        </div>
                    </div>


                    <div className="flex justify-center items-center mt-6">
                        <button type="button" aria-label="Edit Profile" className='flex justify-center items-center gap-2 rounded-xl text-white-color px-2 py-1 font-semibold text-xs sm:text-sm'
                            onClick={() => { isEdit ? handleEditTeachersProfile() : handleEdit() }}
                            style={{
                                backgroundColor: 'transparent',
                                border: `2px solid #E6E6E6`,
                                color: `black`
                            }}
                        >
                            <span className='w-full sm:w-full md:w-fit'>{isEdit ? "Update Profile" : "Edit Profile"}</span>
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                {/* <Button onClick={props.onHide}>Close</Button> */}
            </Modal.Body>
        </Modal>
    )
}

export default TeachersEditModal