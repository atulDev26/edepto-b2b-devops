import { IconFileArrowLeft } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { urlApi } from '../../../api/urlApi';
import { uploadImage } from '../../../utils/commonFunction/ImageUpload';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import MultiIconButtonUI from '../../Buttons/MultiIconButtonUI';

const Addimage = () => {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [apiResponse, setApiResponse] = useState('');
    const handleClose = () => { setShow(false); setFile(false); setApiResponse('') };
    const handleShow = () => setShow(true);


    function handleFileUpload(e) {
        if (e.target.files.length) {
            setFile(e?.target?.files[0]);
        }
    }

    async function writeClipboardText(text) {
        if (text) {
            await navigator.clipboard.writeText(text).then(() => {
                toast.success('Link copied to clipboard!');
                handleClose();
            });
        }
        else {
            toast.error('Failed to copy link!');
        }
    }


    async function addImage() {
        loadingShow();
        let apiUrl = urlApi.uploadFile;
        let resp = await uploadImage(file, apiUrl)
        loadingHide();
        if (resp) {
            setApiResponse(resp);
            toast.success("Link Generate successfully");

        } else {
            toast.error("Link Generate Unsuccessfully");
        }
        return;
    }
    return (
        <>
            <MultiIconButtonUI
                suffixIcon={<IconFileArrowLeft size={20} />}
                variant='fill'
                text='Generate Image Link'
                color={"var(--primary-blue)"}
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
                            Generate Image Link
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
                    <div className='p-3'>
                        <div className="flex flex-col items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" accept={["image/jpeg", "image/png", "image/gif"]} onChange={(e) => handleFileUpload(e)} />
                            </label>
                            {file && <p className='text-xl font-medium mt-2'>File Name : <span className='font-medium text-sm'> {file?.name}</span></p>}
                            <div className='flex gap-3'>
                                {file && <button className='mt-4 bg-primary-blue text-white p-2 rounded-lg' onClick={addImage}>
                                    Generate Link
                                </button>}
                                {apiResponse && (
                                    <button className='mt-4 bg-green-500 text-white p-2 rounded-lg' onClick={() => writeClipboardText(apiResponse)}>
                                        Copy Link
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Addimage