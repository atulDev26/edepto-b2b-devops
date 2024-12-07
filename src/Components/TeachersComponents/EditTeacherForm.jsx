import { IconBook2, IconBuildingBridge, IconCalendar, IconCamera, IconGenderBigender, IconIdBadge2, IconListDetails, IconMail, IconMapPinCode, IconPhone, IconUserCircle } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { WithContext as ReactTags } from 'react-tag-input';
import { toast } from "sonner";
import { postApi } from "../../api/callApi";
import { STATES } from "../../api/localStorageKeys";
import { urlApi } from "../../api/urlApi";
import { uploadImage } from "../../utils/commonFunction/ImageUpload";
import { addDefaultImg } from "../../utils/commonFunction/defaultImage";
import { getDateFromDateISOString } from "../../utils/commonFunction/extractDateFromDateTime";
import { loadingHide, loadingShow } from "../../utils/gloabalLoading";
import DropdownWithImage from "../DropDown/DropdownWithImage";


const EditTeacherForm = ({ onClick, teacherData, callback }) => {
    const stateData = JSON.parse(STATES());
    const [file, setFile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [gender, setGender] = useState("");
    const ref = useRef(null);
    const [state, setState] = useState(stateData?.find(item => item?._id == teacherData?.state));
    const [tags, setTags] = useState(teacherData?.category || []);
    const defaultStateOption = stateData?.find(item => item?._id == teacherData?.state);

    useEffect(() => {
        const initialTags = (teacherData?.category || []).map((category, index) => ({
            id: index.toString(),
            text: category
        }));
        setTags(initialTags);
    }, []);

    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
        return;
    }

    function handleEdit() {
        setIsEdit(!isEdit);
        return;
    }
    const handleGenderChange = (e) => {
        setGender(e.target.value);
        return;
    };

    const handleDelete = i => {
        setTags(tags?.filter((tag, index) => index !== i));
        return;
    };

    const handleAddition = tag => {
        if (tag.text.length >= 2) setTags([...tags, tag]);
        else {
            toast.error("Please enter at least 2 characters");
        }
        return;
    };


    async function handleEditTeachersProfile() {
        let imageData = teacherData?.profilePic;
        if (file) {
            const apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(file, apiUrl);
        }
        let editTeachers = {
            teacherName: document.getElementById('name').value,
        }
        if (gender || teacherData.gender) {
            editTeachers.gender = gender || teacherData.gender;
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
        let resp = await postApi(urlApi.editTeacher + teacherData?._id, editTeachers);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message)
            setIsEdit(false);
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
        } else {
            toast.error(resp.message);
        }
    }

    function pageDropDown(event) {
        setState(event);
        return;
    }

    return (
        <div className="w-[380px] min-w-[380px] px-3.5">
            <div className="teachers-info h-fit bg-white-color overflow-y-auto rounded-2xl">
                <div className="flex gap-3 bg-[#D94230]  h-[126px] rounded-2xl p-3">
                    <div className="w-fit cursor-pointer" onClick={() => {
                        isEdit && ref.current.click();
                    }}>
                        <img
                            src={!file ? teacherData?.profilePic ?? "null" : URL.createObjectURL(file)}
                            alt=""
                            className="max-w-[98px] w-[98px] h-[98px] bg-white-color rounded-full object-contain border-[4px] border-[#E6E6E6]"
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
                    <div className="relative flex flex-col justify-center items-baseline">
                        <span className="absolute top-[-7px] left-[200px]">
                            <i
                                className="fa fa-times fa-lg text-white cursor-pointer"
                                aria-hidden="true"
                                onClick={() => onClick()}
                            ></i>
                        </span>
                        <p className={`font-bold text-lg text-white-color`}>{teacherData?.teacherName}</p>
                        <p className={`font-medium text-sm text-white-color`}>
                            {teacherData?.email}
                        </p>
                    </div>
                </div>

                <div className="p-3">
                    <div className="flex items-center gap-x-4 mb-2">
                        <IconUserCircle color="#D94230" />
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Name*</label>
                            {isEdit ?
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    defaultValue={teacherData?.teacherName}
                                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{teacherData?.teacherName}</p>}
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
                                    placeholder="Phone Number"
                                    disabled
                                    defaultValue={teacherData?.phone}
                                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
                                /> :
                                <p>{teacherData?.phone}</p>}
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
                                    defaultValue={teacherData?.email}
                                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{teacherData?.email}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <IconGenderBigender color="#D94230" />
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Gender</label>
                            {isEdit ?
                                <div className="">
                                    <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleGenderChange} defaultValue={teacherData?.gender}>
                                        <option value="" disabled>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div> :
                                <p>{teacherData?.gender}</p>}
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
                                    {teacherData?.category?.map((category, i) => {
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
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">DOB</label>
                            {isEdit ?
                                <input
                                    id="date"
                                    type="date"
                                    min="0"
                                    defaultValue={getDateFromDateISOString(teacherData?.dob)}
                                    className={`w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{getDateFromDateISOString(teacherData?.dob) ?? "No Data Found"}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <div>
                            <IconListDetails color="#D94230" />
                        </div>
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">State</label>
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
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">City</label>
                            {isEdit ?
                                <input
                                    id="city"
                                    type="text"
                                    placeholder=""
                                    min="0"
                                    defaultValue={teacherData?.city}
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{teacherData?.city}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4 mb-2">
                        <div>
                            <IconMapPinCode color="#D94230" />
                        </div>
                        <div className="flex flex-col w-[100%]">
                            <label htmlFor="name" className="text-[#798494] font-normal text-sm">Pincode</label>
                            {isEdit ?
                                <input
                                    id="pincode"
                                    type="tel"
                                    placeholder=""
                                    min="0"
                                    maxLength={6}
                                    defaultValue={teacherData?.pincode}
                                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{teacherData?.pincode}</p>}
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
                                    defaultValue={teacherData?.about}
                                    className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                /> :
                                <p>{teacherData?.about}</p>}
                        </div>
                    </div>

                    <div className="flex justify-center items-center mt-6">
                        <button type="button" aria-label="Edit Profile" className='flex justify-center items-center gap-2 rounded-xl text-white-color px-3 py-1 font-semibold text-xs sm:text-sm'
                            onClick={() => { isEdit ? handleEditTeachersProfile() : handleEdit() }}
                            style={{
                                backgroundColor: 'transparent',
                                border: `2px solid #E6E6E6`,
                                color: `black`
                            }}
                        >
                            <span className='w-full sm:w-full md:w-fit'>{isEdit ? "Update Profile" : "Edit Profile"}</span>
                            {!isEdit && <i className="fa fa-pencil" aria-hidden="true"></i>}
                        </button>
                    </div>
                </div>




            </div>
        </div>
    );
};

export default EditTeacherForm;
