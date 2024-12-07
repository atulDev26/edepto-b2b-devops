import { IconChecks, IconSquareRoundedX, IconZoomExclamation } from '@tabler/icons-react'
import React from 'react'

const TestStatusComponent = ({correct,incorrect,unattempted}) => {
    return (
        <>
            <div className='min-w-fit w-full h-full bg-white-color shadow-sm rounded border-slate-400 border border-2 flex-wrap'>
                <p className='p-2 font-semibold text-sm'>Test Status</p>
                <div className='border border-b-background-color' />
                <div className='p-3 flex flex-col gap-2 flex-wrap'>
                    <div className='bg-[#D9FFED] px-2 py-2 flex justify-between items-center rounded-md' style={{
                        border: '2px solid #49A57A'
                    }}>
                        <div className='flex gap-2 items-center'>
                            <IconChecks className='text-[#49A57A]'/>
                            <p className='text-[#49A57A] font-bold text-sm'>Correct Answer</p>
                        </div>
                        <p className='text-[#49A57A] font-bold text-lg'>{correct||0}</p>
                    </div>

                    <div className='bg-[#FFEDF5] px-2 py-2 flex justify-between items-center rounded-md' style={{
                        border: '2px solid #D3789F'
                    }}>
                        <div className='flex gap-2 items-center'>
                            <IconSquareRoundedX className='text-[#D3789F]'/>
                            <p className='text-[#D3789F] font-bold text-sm'>Incorrect Answer </p>
                        </div>
                        <p className='text-[#D3789F] font-bold text-lg'>{incorrect||0}</p>
                    </div>

                    <div className='bg-[#F9F9F9] px-2 py-2 flex justify-between items-center rounded-md' style={{
                        border: '2px solid #DEE5EC'
                    }}>
                        <div className='flex gap-2 items-center'>
                            <IconZoomExclamation className='text-[#334155]'/>
                            <p className='text-[#334155] font-bold text-sm'>Unattempted</p>
                        </div>
                        <p className='text-[#334155] font-bold text-lg'>{unattempted||0}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TestStatusComponent