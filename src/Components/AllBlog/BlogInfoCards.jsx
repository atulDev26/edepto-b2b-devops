import { IconEye, IconMessage2 } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import ButtonUI from '../Buttons/ButtonUI'
import Status from '../StatusInfo/Status'

const BlogInfoCards = () => {
    const [status, setStatus] = useState(Math.random() > 0.5 ? 1 : 2);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setStatus(Math.random() > 0.5 ? 1 : 2);
        }, 5000);

        return () => clearInterval(intervalId)
    }, []);

    return (
        <div className='w-full sm-w-full md:w-full h-fit bg-white-color rounded-3xl mt-2 shadow-md md:hover:bg-slate-50 md:hover:cursor-pointer overflow-hidden'>
            <img src={`https://source.unsplash.com/random/1080x1920/?blog`} alt='ExamPass-Icon' className='w-[100%] h-[210px] object-fill  rounded-tl-3xl rounded-tr-3xl' />
            <div className='exam-pass-info text-start p-3 leading-8'>
                <p className='font-bold text-xl'>OSSC CGL Notification 2024 </p>
                <p className='text-primary-blue font-bold text-base'>JOB UPDATE</p>
                <div className='grid grid-cols-2 mt-3'>
                    <div className='flex items-center gap-2 mt-1'>
                        {
                            status === 1 ? <Status status={"Active"} /> : <Status status={"Inactive"} />
                        }
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <div className='flex items-center gap-2'>
                            <div className='bg-[#F5F6F8] w-fit rounded-full p-[2px]'>
                                <span><IconEye stroke={1.5} size={24}/></span>
                            </div>
                            <span className='font-medium text-sm'>25k </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='bg-[#F5F6F8] w-fit rounded-full p-[2px]'>
                                <span><IconMessage2 stroke={1.5} size={24}/></span>
                            </div>
                            <span className='font-medium text-sm'>25k</span>
                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                    <ButtonUI
                        text={"View Blog"}
                        variant='outline'
                        color={"#024cc7"}
                        textColor={"#024cc7"}
                        onClick={() => console.log("working")}
                    />
                </div>
            </div>
        </div>
    )
}

export default BlogInfoCards