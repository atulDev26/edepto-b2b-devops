import { IconBell, IconCheck, IconCirclePlus } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'sonner';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import ButtonUI from '../Buttons/ButtonUI';
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';

const AddTaskList = ({ callback }) => {
    const [show, setShow] = useState(false);
    const colorSet = [
        {
            id: "1",
            color: "#024CC8"
        },
        {
            id: "2",
            color: "#96C237"
        },
        {
            id: "3",

            color: "#D94230"
        },
        {
            id: "4",
            color: "#D3789F"
        }
    ];
    const [color, setColor] = useState(null);
    const handleClose = () => { setShow(false); setColor(null) };
    const handleShow = () => setShow(true);

    async function addNewTask() {
        let postData = {
            task: document.getElementById("title").value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            colourCode: color
        }
        loadingShow();
        let resp = await postApi(urlApi.addTodo, postData);
        loadingHide();
        if (resp.responseCode === 200) {
            toast.success(resp.message);
            if (callback) {
                callback();
            }
            handleClose();
        } else {
            toast.error(resp.message);
        }
        return;
    }


    return (
        <>
            <MultiIconButtonUI
                prefixIcon={<IconBell size={20} />}
                suffixIcon={<IconCirclePlus size={18} />}
                variant="fill"
                color={"var(--primary-blue)"}
                text="Add Task"
                onClick={() => handleShow()}
            />
            <Modal
                show={show}
                onHide={handleClose}
                size="md"
                aria-labelledby="Add Teachers"
                centered
                backdrop="static"
            >
                <Modal.Header>
                    <div className="w-full flex justify-between items-center">
                        <p className="font-semibold text-base cursor-default">
                            Create New Task
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
                    <div className="p-4 flex flex-col items-start justify-start gap-2">
                        <div className="flex flex-col gap-1 w-[100%]">
                            <label htmlFor="name" className="font-medium text-sm">Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder='Enter title'
                                className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                            />
                        </div>
                        <div>
                            <label className="font-medium text-sm">Label Color</label>
                            <div className='flex gap-3 mt-2'>
                                {
                                    colorSet.map((item, index) => {
                                        return (
                                            <button
                                                key={index}
                                                style={{
                                                    backgroundColor: item?.color
                                                }}
                                                onClick={() => setColor(item?.color)}
                                                className='w-[30px] h-[30px] rounded-full'
                                            >{item?.color === color ? <IconCheck size={18} stroke={4.4} className=' text-white-color m-auto' /> : null}</button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-col md:flex-row w-full gap-2 flex-wrap'>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">Start Date</label>
                                <input
                                    id="startDate"
                                    type="datetime-local"
                                    min="0"
                                    className={`w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
                                />
                            </div>
                            <div className="flex flex-col gap-1 w-[100%]">
                                <label className="font-medium text-sm">End Date</label>
                                <input
                                    id="endDate"
                                    type="datetime-local"
                                    min="0"
                                    className={`w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
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
                            text={"Create"}
                            variant="transparent"
                            color={"var(--primary-blue)"}
                            onClick={() => addNewTask()}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddTaskList