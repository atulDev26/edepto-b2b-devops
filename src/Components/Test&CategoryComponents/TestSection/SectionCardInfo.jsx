import React from 'react'
import PopOver from '../../PopOver/PopOver';

const SectionCardInfo = ({ details }) => {
    return (
        <div className='block md:flex justify-between items-center gap-2 py-2'>
            <div className='flex justify-start items-center gap-2'>
                <img src={details?.icon} alt="" className='max-w-[68px] w-[68px] h-[68px] rounded-full' />
                <p className='font-medium text-base text-menu-text-color'>{details?.subCategoryName}</p>
            </div>
            <div className='m-2 md:m-0'>
                <p className='font-normal text-sm text-menu-text-color'><span className='font-semibold text-base'>
                    {details?.testCount || details?.freeTestCount + details?.paidTestCount}</span> Test</p>
            </div>
            <div className='m-2 md:m-0 flex gap-2'>
                <p className='font-medium text-base text-menu-text-color'>In Language :</p>
                {<PopOver data={details?.languages} />}
            </div>
            <div className='flex gap-14'>
                {details?.status === true ? <div className='bg-[#D6D0FF] px-4 py-2 rounded-2xl h-fit shadow-xl'>
                    <p className='font-semibold text-base '>Active</p>
                </div>
                    :
                    <div className='bg-primary-red px-4 py-2 rounded-2xl h-fit shadow-lg'>
                        <p className='font-semibold text-base text-white-color'>Inactive</p>
                    </div>
                }
                <div className='bg-[#ECFFC4] px-4 py-2 rounded-2xl h-fit w-fit shadow-xl'>
                    <p className='font-semibold text-base' >Enrolled : {details?.totalEnrolled || "--"}</p>
                </div>
            </div>
        </div>
    )
}

export default SectionCardInfo