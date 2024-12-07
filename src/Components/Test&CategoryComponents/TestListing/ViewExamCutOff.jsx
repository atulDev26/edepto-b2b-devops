import { IconEdit } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import DropDown from '../../DropDown/DropDown';
import AddExamCutOff from './AddExamCutOff';
import EditExamCutOff from './EditExamCutOff';

const ViewExamCutOff = ({ data, callback, ID }) => {
    const [show, setShow] = useState(false);
    const [category, setCategory] = useState("General");
    function handleShow() {
        setShow(true);
        return;
    }

    function handleClose() {
        setShow(false);
        setCategory("General")
        return;
    }

    function statusDropDown(e) {
        setCategory(e);
        return;
    }

    function getCategoryData() {
        return data?.find(item => item?.category === category);
    }

    const categoryData = getCategoryData();

    const cardStyle = {
        color: 'blue',
        padding: "10px",
        borderRadius: "10px",
        fontWeight: '500',
        marginBottom: '10px',
        fontSize: '1.1em',
        backgroundColor: '#f5f2f2',
        cursor: "default",
    };
    return (
        <div>
            <IconEdit
                className='cursor-pointer text-primary-blue'
                onClick={() => handleShow()}
            />
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                backdrop="static"
                keyboard={false}
                aria-labelledby="ExamCutoff"
                centered
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <div className='flex items-center gap-3'>
                            <p className="font-semibold text-base cursor-default">
                                Exam Cutoff
                            </p>
                            <AddExamCutOff testId={ID} callback={callback} />
                            {data?.length !== 0 && <EditExamCutOff testId={ID} callback={callback} data={categoryData} />}
                        </div>
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
                    <div className='p-2'>
                        <div className='flex flex-col w-full gap-1 '>
                            <label className='font-semibold text-sm'>Category</label>
                            <DropDown
                                onclick={(e) => statusDropDown(e)}
                                options={["General", "OBC", "SC", "ST", "EWS"]}
                                defaultOption={category}
                            />
                        </div>
                        {categoryData ? (
                            <div style={{ marginTop: '20px' }}>
                                <h5 className='mb-2' >Category: {<span className='text-green-500'>{categoryData.category}</span>}</h5>
                                <p style={cardStyle} className='shadow-md border'>Lower Bound Percentile: {(categoryData?.lowerBoundPercentile).toFixed(0)}%</p>
                                <p style={cardStyle} className='shadow-md border'>Upper Bound Percentile: {(categoryData?.upperBoundPercentile).toFixed(0)}%</p>
                                <p style={cardStyle} className='shadow-md border'>Lower Bound: {categoryData.lowerBound}</p>
                                <p style={cardStyle} className='shadow-md border'>Upper Bound: {categoryData.upperBound}</p>
                            </div>
                        ) : <p className='w-full text-center text-danger mt-3'>No Data Found</p>}
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default ViewExamCutOff