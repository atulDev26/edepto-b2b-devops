import React, { useRef, useState } from 'react';

const NormalPopUp = ({ callback }) => {
    const ref = useRef(null)
    const [file, setFile] = useState(null);

    function handleImageUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
            if (callback) {
                callback(e?.target?.files[0]);
            }
        }
    }

    return (
        <>
            <div className="w-[100%] mb-3">
                <label htmlFor="name" className="font-semibold text-sm">Title</label>
                <input
                    autoFocus
                    id="title"
                    type="text"
                    placeholder=""
                    className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                />
            </div>

            {/* <div>
                    <label className='font-semibold text-sm'>Topic</label>
                    <input
                        id="topic"
                        type="text"
                        placeholder=""
                        className={`w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                    />
                </div> */}
            <div className='w-[100%] mb-3'>
                <label className='font-semibold text-sm'>Scheduled</label>
                <input
                    id='scheduled'
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 "
                />
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
        </>
    )
}

export default NormalPopUp