import React, { useRef, useState } from 'react'

const PopUpNotification = ({ callback,callbackTwo }) => {
    const ref = useRef(null);
    const refs = useRef(null)
    const [file, setFile] = useState(null);
    const [fileDetails, setFileDetails] = useState(null);


    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
            if (callback) {
                callback(e?.target?.files[0]);
            }
        }
    }
    function handleImageUploadsecond(e) {
        if (e.target.files.length) {
            setFileDetails(e?.target?.files[0]);
            if (callbackTwo) {
                callbackTwo(e?.target?.files[0]);
            }
        }
    }

    return (
        <>
            <div className="w-[100%] mb-3">
                <label htmlFor="name" className="font-semibold text-sm">Title</label>
                <input
                    autoFocus
                    id="popup-title"
                    type="text"
                    placeholder=""
                    className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div>
                    <label className='font-semibold text-sm'>Topic</label>
                    <input
                        id="popup-topic"
                        type="text"
                        placeholder=""
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                    />
                </div>
                <div>
                    <label className='font-semibold text-sm'>Scheduled</label>
                    <input
                        id='popup-scheduled'
                        type="datetime-local"
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 "
                    />
                </div>
            </div>
            {file && <img src={URL.createObjectURL(file)} alt="" className='w-[100%] h-[211px] object-cover rounded-3xl mt-3' />}
            <div className='border p-2 rounded-xl mt-3 mb-2'>
                <label className='font-semibold text-sm'>Upload Image &nbsp;</label>
                <input
                    type="file"
                    className="hidden"
                    ref={ref}
                    accept={["image/jpeg", "image/png", "image/gif"]}
                    onChange={(e) => {
                        handleImageUpload(e);
                    }}
                />
                <button className='bg-[#94A3B8] p-1 rounded-xl px-2 text-white-color font-medium' onClick={() => {
                    ref.current.click();
                }}>
                    Choose File
                </button>
            </div>
            <div className="flex flex-col gap-1 w-[100%] sm:col-span-2">
                <label className="font-medium text-sm">Message</label>
                <textarea
                    id="message"
                    type="text"
                    className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                />
            </div>
            <div className='mt-2'>
                <p className="font-semibold text-lg">PopUp Details</p>
                {fileDetails && <img src={URL.createObjectURL(fileDetails)} alt="" className='w-[100%] h-[211px] object-cover rounded-3xl mt-3' />}
            <div className='border p-2 rounded-xl mt-3 mb-2'>
                <label className='font-semibold text-sm'>Upload Image &nbsp;</label>
                <input
                    type="file"
                    className="hidden"
                    ref={refs}
                    accept={["image/jpeg", "image/png", "image/gif"]}
                    onChange={(e) => {
                        handleImageUploadsecond(e);
                    }}
                />
                <button className='bg-[#94A3B8] p-1 rounded-xl px-2 text-white-color font-medium' onClick={() => {
                    refs.current.click();
                }}>
                    Choose File
                </button>
            </div>
                <div className="w-[100%] mb-3">
                    <label htmlFor="name" className="font-semibold text-sm">Title</label>
                    <input
                        autoFocus
                        id="popupDetails-title"
                        type="text"
                        placeholder=""
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                    />
                </div>
                <div className="w-[100%] mb-3">
                    <label htmlFor="name" className="font-semibold text-sm">Description</label>
                    <input
                        autoFocus
                        id="popupDetails-description"
                        type="text"
                        placeholder=""
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                    />
                </div>
                <div>
                    <label className='font-semibold text-sm'>URL</label>
                    <input
                        id="popupDetails-url"
                        type="url"
                        placeholder=""
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                    />
                </div>
            </div>
        </>
    )
}

export default PopUpNotification