import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import { IconCircleDashedCheck, IconInfoCircle, IconLanguage, IconListNumbers, IconReceipt, IconReceiptRupee, IconShoppingBag, IconUserEdit, IconUsers } from '@tabler/icons-react';
import { getLanguageStringFromId } from '../../utils/getDataFromId';

const KnowMore = ({ info }) => {
    const [show, setShow] = useState(false);
    const [showAllItems, setShowAllItems] = useState(false);
    const handleClose = () => {
        setShow(false)
    };
    const handleShow = () => setShow(true);
    // const limitedItems = info?.languages?.slice(0, showAllItems ? info?.languages?.length : 3);

    return (
        <>

            <IconInfoCircle size={30} className='absolute bg-background-color text-primary-blue top-16 left-4 rounded-full p-1 shadow-md' onClick={() => handleShow()} />
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                aria-labelledby="Add Teachers"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Pass Detail ({info?.passName})
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
                    <div className='grid grid-cols-1 px-3 py-1'>
                        <div className='flex flex-col justify-center md:p-4'>
                            <div className='relative w-full mt-3'>
                                <img src={info.icon} alt='ExamPass-Icon' className='w-[100%] h-[200px] object-cover  rounded-3xl' />
                                {info.isNew && <img className='absolute top-6 right-0' src={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/newAdded.svg"} alt='' />}
                            </div>
                            <div className='mt-[17px] text-center'>
                                <p className='font-extrabold text-xl mb-4'>{info?.subCategoryName}</p>
                                <div className='grid grid-cols-2 items-start gap-3 '>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-[#F5F6F8] rounded-full p-[8px]'>
                                            <IconReceipt size={20} stroke={1.8} />
                                        </div>
                                        <p className='font-medium'>Price : <span className='font-bold text-base'>{info?.withoutDiscountPrice}</span></p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-[#F5F6F8] rounded-full p-[8px]'>
                                            <IconReceiptRupee size={20} stroke={1.8} />
                                        </div>
                                        <p className='font-medium'>DiscountPrice : <span className='font-bold text-base'>{info?.price}</span></p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-[#F5F6F8] rounded-full p-[8px]'>
                                            <IconListNumbers size={20} stroke={1.8} />
                                        </div>
                                        <p className='font-medium'>No of Test : <span className='font-bold text-base'>{info?.testCount || 0}</span></p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-[#F5F6F8] rounded-full p-[8px]'>
                                            <IconUserEdit size={20} stroke={1.8} />
                                        </div>
                                        <p className='font-medium'><span className='font-bold text-base'>{info?.totalCount || 0}</span></p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-[#F5F6F8] rounded-full p-[8px]'>
                                            <IconUsers size={20} stroke={1.8} />
                                        </div>
                                        <p className='font-medium'>Total User : <span className='font-bold text-base'>16</span></p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-[#F5F6F8] rounded-full p-[8px]'>
                                            <IconShoppingBag size={20} stroke={1.8} />
                                        </div>
                                        <p>Assign: <span className='font-bold text-base'>16</span></p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='bg-[#F5F6F8] rounded-full p-[8px]'>
                                            <IconCircleDashedCheck size={20} stroke={1.8} />
                                        </div>
                                        <p>Validity: <span className='font-bold text-base'>{info?.validity}</span></p>
                                    </div>
                                    <p></p>
                                    {/* <div className='flex items-center gap-2'>
                                        <div className='bg-[#F5F6F8] rounded-full p-[8px]'>
                                            <IconLanguage size={20} stroke={1.8} />
                                        </div>
                                        <p className='font-medium'>Languages</p>

                                    </div> */}
                                </div>
                                {/* <div className='grid grid-cols-4 gap-2 items-center mt-3'>
                                    {limitedItems?.map((item, index) => (
                                        <div key={item} className='font-semibold text-xs p-1 w-full text-center  rounded-xl bg-[#F2F7FF] '>
                                            <p className='text-[#7D94B5]'>{getLanguageStringFromId(item)}</p>
                                        </div>
                                    ))}
                                    {info?.languages?.length > 4 && (
                                        <div
                                            className='text-xs p-1 text-center rounded-xl bg-blue-500 hover:bg-blue-700 cursor-pointer text-white'
                                            onClick={() => setShowAllItems(!showAllItems)}
                                        >
                                            {showAllItems ? 'less' : 'more'}
                                        </div>
                                    )}
                                </div> */}
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
                    <div className="w-full">
                        {/* <ButtonUI
                            text={"Assign Pass"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                        onClick={() => "working"}
                        /> */}
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default KnowMore