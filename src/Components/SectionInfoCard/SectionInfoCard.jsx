import React from 'react'

const SectionInfoCard = ({ Icon, cardTitle, prefixNumber, suffixNumber }) => {
  return (
    <div className='flex items-center h-fit w-full bg-white p-3 rounded-xl shadow-sm gap-4'>
      <img src={Icon} alt="Total Pass Icon" className='w-12 h-12' />
      <div className='w-full text-left'>
        <p className='text-menu-text-color font-medium break-words'>{cardTitle}</p>
        <div className="flex flex-wrap gap-2">
          <p className='text-stone-800 font-bold'>{prefixNumber}</p>
          {
            suffixNumber && (
              <span className='text-menu-text-color font-medium'>
                worth&nbsp;&nbsp;
                <span className='text-stone-800 font-bold'>₹ {suffixNumber}/-</span>
              </span>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SectionInfoCard        