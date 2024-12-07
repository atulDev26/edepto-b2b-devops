import { IconInfoCircle, IconUserEdit } from '@tabler/icons-react';
import React from 'react';
import { Badge } from 'react-bootstrap';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';
import EditPassModal from './EditPassModal';
import KnowMore from './KnowMore';

const ExamPassCards = ({ item, callback }) => {
    return (
        <div className='w-full sm-w-full md:w-full h-fit bg-white-color rounded-3xl mt-2 mb-2 shadow-md md:hover:bg-slate-50 md:hover:cursor-pointer'>
            <div className='relative'>
                <img src={item?.icon} alt='ExamPass-Icon' className='w-[100%] h-[211px] object-cover  rounded-tl-3xl rounded-tr-3xl' />
                {
                    !!item?.isNew &&
                    <img className='absolute top-8 right-0' src={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/newAdded.svg"} alt='' />
                }
                {hasAccess(accessKeys?.editPass) && <EditPassModal data={item} callback={() => callback()} />}
                {hasAccess(accessKeys?.getAllPass) && <KnowMore info={item} />}
            </div>
            <div className='exam-pass-info text-start p-3 leading-4'>
                <p className='font-bold text-xl'>{item?.passName}</p>
                <div className='flex justify-between'>
                    <p className='text-[#D94230] font-medium text-sm'>Assign Pass: {item?.totalCount || 0}</p>
                    <Badge bg={!!item?.isActive ? "primary" : "danger"}>{!!item?.isActive ? "Active" : "Inactive"}</Badge>
                </div>

                <div className='grid grid-cols-2'>
                    <div className='flex items-center gap-2 mt-1'>
                        <div className='flex justify-center items-center bg-[#F5F6F8] w-[28px] h-[28px] rounded-full p-[2px]'>
                            <span><IconInfoCircle stroke={2} size={16} /></span>
                        </div>
                        <span className='flex flex-wrap font-normal text-sm text-black items-center'>No of Test:&nbsp;<span className='font-bold text-xl'>{item?.testCount || 0}</span> </span>
                    </div>
                    <div className='flex items-center gap-2 mt-1'>
                        <div className='flex justify-center items-center bg-[#F5F6F8] w-[28px] h-[28px] rounded-full p-[2px]'>
                            <span><IconUserEdit stroke={2} size={16} /></span>
                        </div>
                        <span className='font-bold text-xl'>{item?.totalCount || 0}</span>
                    </div>
                </div>
                <div className='flex justify-center items-center mt-3 mb-3'>
                    <p className='font-normal text-xs text-black'>Created By:<span className='font-bold text-md '>&nbsp;{item?.createdBy}</span></p>
                </div>
            </div>
        </div>
    )
}
export default ExamPassCards
