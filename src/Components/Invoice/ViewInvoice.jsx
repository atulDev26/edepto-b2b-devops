import { IconBrandInstagram, IconBrandLinkedin, IconDownload } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { dateReturn } from '../../utils/commonFunction/dateTimeConverter';
import { toWords } from '../../utils/currencyCal';
import { Link } from 'react-router-dom';
import generatePDF from 'react-to-pdf';


const options = {
    filename: "Invoice.pdf",
    page: {
        margin: 10,
        format: 'A4',
        scale: 160
    }
};

const getTargetElement = () => document.getElementById("invoice");

const downloadPdf = () => generatePDF(getTargetElement, options);

const ViewInvoice = ({ invoiceData }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };
    const handleShow = () => { setShow(true) };

    const number = invoiceData?.totalPrice || 0;
    const words = toWords?.convert(number);

    return (
        <>
            <i title='Update Access' className={`fa fa-eye fa-lg text-primary-blue`} aria-hidden="true" onClick={() => handleShow()}></i>
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
                            Invoice ID <span className='bg-[#EAEFF7] text-primary-blue ml-2 px-2 py-1 rounded-lg font-semibold '>{invoiceData?.invoiceId}</span>
                        </p>
                        <div className='flex justify-center items-center gap-4'>
                            <button className='bg-primary-blue px-3 py-1 text-white rounded-3xl font-normal flex justify-start items-center flex-wrap gap-2'
                                onClick={() => downloadPdf()}
                            >
                                <IconDownload />
                                Download
                            </button>
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
                    <div className='p-4' id='invoice' >
                        <div className="gst-information min-w-full">
                            <div className="flex flex-col gap-3 sm:flex-col md:flex-col lg:flex-row justify-between columns-1 sm:columns-1 md:columns-1 lg:columns-2">
                                <div className='lg:w-1/2 flex flex-col justify-center lg:justify-start'>
                                    <img className='max-w-[150px] w-full h-fit' src={process.env.PUBLIC_URL + "/Assets/Images/Edepto-Business-Logo.png"} alt='Edepto-business' />
                                    <>
                                        <p className='text-menu-text-color font-semibold mt-2'>Address</p>
                                        <p className='text-menu-text-color font-normal mt-1 text-ellipsis '>Edwid Technologies Private Limited
                                            369/4 Avishar Shopping Complex,
                                            Kalitala Road, Kalikapur,
                                            Kolkata, West Bengal 700078, India
                                        </p>
                                    </>
                                </div>
                                <div className='lg:w-1/2 flex justify-between lg:justify-end items-center lg:gap-3'>
                                    <div>
                                        <p>Invoice No : {invoiceData?.invoiceId}</p>
                                        <p>Payment Date: {dateReturn(invoiceData?.createdAt)}</p>
                                    </div>
                                    <img className='max-w-[80px] max-h-[80px] w-full h-fit' src={process.env.PUBLIC_URL + "/Assets/Images/edepto-business-qr.png"} alt='Edepto-business' />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-col md:flex-col lg:flex-row justify-between columns-1 sm:columns-1 md:columns-1 lg:columns-2 lg:mt-20">
                                <div className='lg:w-1/2 flex flex-col justify-center lg:justify-start'>
                                    <>
                                        <p className='text-menu-text-color font-semibold mt-2'>Invoice To</p>
                                        <p className='text-primary-blue'>{invoiceData?.organizationName}</p>
                                        <p className='text-primary-blue'>GST :- {invoiceData?.gstNumber}</p>
                                        <p className='text-menu-text-color font-normal mt-1 text-ellipsis '>{invoiceData?.address}
                                        </p>
                                        <p className='text-menu-text-color font-normal mt-1 text-ellipsis '>{invoiceData?.phone}
                                        </p>
                                        <p className='text-menu-text-color font-normal mt-1 text-ellipsis '>{invoiceData?.email}
                                        </p>
                                    </>
                                </div>
                                <div className='lg:w-1/2 flex justify-between lg:justify-end items-center lg:gap-3'>
                                    <div className='lg:w-1/2 flex flex-col justify-center lg:justify-start'>
                                        <p className='text-menu-text-color font-semibold mt-2'>Invoice From</p>
                                        <p className='text-primary-red'>Edepto Tech Pvt. Ltd.</p>
                                        <p className='text-menu-text-color font-normal mt-1 text-ellipsis '>Edwid Technologies Private Limited
                                            369/4 Avishar Shopping Complex,
                                            Kalitala Road, Kalikapur,
                                            Kolkata, West Bengal 700078, India
                                        </p>
                                        <p className='text-menu-text-color font-normal mt-1'>+91 90382 16596</p>
                                        <p className='text-menu-text-color font-normal mt-1'>  contact@edepto.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table className="w-full text-left border-collapse mt-10">
                            <thead className='bg-[#F1F5F9]'>
                                <tr className='border-b border-blue-100' >
                                    <th className="p-3 font-semibold">Product Description</th>
                                    <th className="p-3 font-semibold">Duration</th>
                                    <th className="p-3 font-semibold">Plan Price</th>
                                    <th className="p-3 font-semibold">Amount (INR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-blue-100">
                                    <td className="p-2">{invoiceData?.planName}<br /></td>
                                    <td className="p-2 text-center">{invoiceData?.duration}</td>
                                    <td className="p-2">₹{invoiceData?.price}</td>
                                    <td className="p-2">₹{invoiceData?.price}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="px-[20px] lg:px-[80px] text-right" colspan="3">
                                        Sub Total
                                    </td>
                                    <td className="p-2">₹{invoiceData?.price}</td>
                                </tr>
                                <tr>
                                    <td className="px-[20px] lg:px-[80px] text-right" colspan="3">Tax</td>
                                    <td className="p-2">₹{invoiceData?.tax}</td>
                                </tr>
                                <tr>
                                    <td className="px-[20px] lg:px-[80px] text-right font-bold" colspan="3">Total Price</td>
                                    <td className="p-2 font-bold">₹{invoiceData?.totalPrice}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        backgroundColor: "#F5F7FB",
                        borderRadius: "0px 0px 20px 20px",
                        width: "100%",
                    }}
                >
                    <p className='font-light flex justify-center items-center w-full'>Thank you for doing business with us!”,Join us on social media for promotions and updates
                        <span className='flex items-center gap-1 px-2'>
                            <Link to='https://in.linkedin.com/company/edepto' target='blank'><IconBrandLinkedin /></Link>
                            <Link to='https://www.instagram.com/edepto.in/' target='blank'><IconBrandInstagram /></Link>
                        </span>
                    </p>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewInvoice