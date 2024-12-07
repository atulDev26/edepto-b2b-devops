import React, { useRef, useState } from 'react'
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import { IconPencil, IconSquareRoundedX } from '@tabler/icons-react';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { urlApi } from '../../api/urlApi';
import { uploadImage } from '../../utils/commonFunction/ImageUpload';
import { postApi } from '../../api/callApi';
import { toast } from 'sonner';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';
import { USER_DATA } from '../../api/localStorageKeys';

const Institute = ({ data, callback }) => {
    const ref = useRef(null);
    const [isEdit, setIsEdit] = useState(false);
    const [files, setFiles] = useState(null);
    const userData = JSON.parse(USER_DATA());
    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFiles(e?.target?.files[0]);
        }
        return;
    }
    async function handleUpdateInsProfile() {
        let imageData = data?.logo;
        if (files) {
            const apiUrl = urlApi.uploadFile;
            imageData = await uploadImage(files, apiUrl);

        }
        let instituteData = {
            website: document.getElementById("inswebsite").value,
            logo: imageData,
            email: document.getElementById("insemail").value,
            description: document.getElementById("insdescription").value,
            location: document.getElementById("inslocation").value
        }
        if (document.getElementById("gstNumber").value && document.getElementById("organizationName").value &&
            document.getElementById("address").value) {
            instituteData.gstNumber = document.getElementById("gstNumber").value;
            instituteData.organizationName = document.getElementById("organizationName").value;
            instituteData.address = document.getElementById("address").value
        }
        loadingShow();
        let resp = await postApi(urlApi.updateInstituteData, instituteData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            const updatedUserData = { ...userData, instituteLogo: imageData };
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            if (callback) {
                callback();
            }
            setIsEdit(false);
        }
        else {
            toast.error(resp.message);
        }
        return;
    }

    function handleClose() {
        setIsEdit(false);
        setFiles(null);
        document.getElementById("inswebsite").value = data?.website;
        document.getElementById("insemail").value = data?.email;
        document.getElementById("insdescription").value = data?.description;
        document.getElementById("inslocation").value = data?.location;
    }
    return (
        <div className='bg-white border rounded-xl mt-4'>
            <div className='flex justify-between items-center p-3'>
                <h2 className='font-semibold text-base'>Institute Setting</h2>
                {<MultiIconButtonUI
                    text={<p className='font-semibold text-base'>Edit</p>}
                    suffixIcon={!isEdit ? <IconPencil size={16} /> : <IconSquareRoundedX color='red' size={16} />}
                    variant='transparent'
                    color='#F1F1F1F1'
                    textColor='#000000'
                    onClick={() => setIsEdit(!isEdit)}
                />}
            </div>
            <div className='border border-b-background-color' />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2 items-center">
                <div className='image'>
                    <div className='institute-logo'>
                        <div className='flex justify-between items-center gap-4 p-2'>
                            <div className='max-w-[200px] max-h-[100px] mt-1'>
                                <div className='flex gap-2 items-center mb-2'>
                                    <label className="font-semibold text-sm">Institute Logo*</label>
                                    {isEdit && <button
                                        className="border border-red-900 text-primary-blue font-semibold py-2 shadow-sm px-4 rounded-xl"
                                        onClick={() => {
                                            ref.current.click();
                                        }}>
                                        Upload
                                    </button>}
                                </div>
                                <img
                                    src={!files ? data?.logo ?? "null" : URL.createObjectURL(files)}
                                    alt=""
                                    className="max-w-[80px] w-[80px] max-h-[80px] h-[80px] border-[4px] rounded-xl object-cover aspect-square"
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null;
                                        currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edepto.svg";
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
                            </div>

                        </div>
                    </div>
                </div>
                <div className='instituteName'>
                    <label className=" font-semibold text-sm">Name*</label>
                    <input
                        id="insname"
                        type="text"
                        placeholder="Name"
                        disabled
                        defaultValue={data?.instituteName}
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 'cursor-not-allowed bg-slate-100`}
                    />
                </div>
                <div className='instituteWebsite'>
                    <label className="font-semibold text-sm">Email*</label>
                    <input
                        id="insemail"
                        type="email"
                        placeholder="Email"
                        disabled={!isEdit}
                        defaultValue={data?.email}
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
                    />
                </div>
                <div className='instituteWebsite'>
                    <label className="font-semibold text-sm">Web Site*</label>
                    <input
                        id="inswebsite"
                        type="url"
                        placeholder="Web Site"
                        disabled={!isEdit}
                        defaultValue={data?.website}
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
                    />
                </div>
                <div className='instituteDescription'>
                    <label className="font-semibold text-sm">Institute Description*</label>
                    <textarea
                        maxLength="100"
                        id="insdescription"
                        type="text"
                        disabled={!isEdit}
                        defaultValue={data?.description}
                        placeholder="type here .."
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
                    />
                </div>
                <div className='phone-number'>
                    <label className="font-semibold text-sm">Phone No*</label>
                    <input
                        id="insphone"
                        type="number"
                        placeholder="Phone No"
                        disabled
                        defaultValue={data?.phone}
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-slate-100`}
                    />
                </div>
                <div className='loaction'>
                    <label className="font-semibold text-sm">Location*</label>
                    <input
                        id="inslocation"
                        type="text"
                        placeholder="State"
                        disabled={!isEdit}
                        defaultValue={data?.location}
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500  ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
                    />
                </div>
                {userData?.institutePlan && <div className='currentPlan'>
                    <label className="font-semibold text-sm">Plan</label>
                    <input
                        id="current-plan"
                        type="text"
                        placeholder='Current Plan'
                        disabled={true}
                        defaultValue={data?.currentPlan?.name}
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-not-allowed bg-primary-blue text-white`}
                    />
                </div>}

                <div className='gstNumber'>
                    <label className="font-semibold text-sm">GST Number(optional)</label>
                    <input
                        id="gstNumber"
                        type="text"
                        disabled={!isEdit}
                        defaultValue={data?.currentGST?.gst?.gstNumber}
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
                    />
                </div>
                <div className='Organization Name'>
                    <label className="font-semibold text-sm">Organization Name(optional)</label>
                    <input
                        id="organizationName"
                        type="text"
                        disabled={!isEdit}
                        defaultValue={data?.currentGST?.gst?.organizationName}
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
                    />
                </div>
                <div className='Organization Address'>
                    <label className="font-semibold text-sm">Organization Address(optional)</label>

                    <textarea
                        maxLength="500"
                        id="address"
                        type="text"
                        disabled={!isEdit}
                        defaultValue={data?.currentGST?.gst?.address}
                        placeholder="type here .."
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!isEdit && 'cursor-not-allowed bg-slate-100'}`}
                    />
                </div>
            </div>
            {isEdit && <div className='bg-[#F6F8FB] w-full shadow-sm p-2'>
                <div className="flex justify-end items-center gap-2">
                    <div className='flex gap-2'>
                        <button
                            disabled={!isEdit}
                            className={`bg-primary-red text-white font-semibold py-2 shadow-sm px-4 rounded-xl ${!isEdit && 'cursor-not-allowed bg-[#e07265]'}`}
                            onClick={() => handleClose()}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={!isEdit}
                            className={`bg-primary-blue text-white font-semibold py-2 shadow-sm px-4 rounded-xl ${!isEdit && 'cursor-not-allowed bg-[#307eff]'}`}
                            onClick={() => handleUpdateInsProfile()}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Institute