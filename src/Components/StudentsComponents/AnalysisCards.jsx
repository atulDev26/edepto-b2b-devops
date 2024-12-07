import React from 'react'

const AnalysisCards = ({cardName,cardIcon,cardColor,cardNumber}) => {
  return (
    <div className={`w-full  flex justify-start items-center gap-2 bg-[${cardColor}] p-3 shadow-xl rounded-[20px]`} style={{
        backgroundColor: `${cardColor}`
    }}>
        <div className='flex justify-between place-items-start'>
            <img className='cursor-pointer w-[52px] h-[52px] sm:w-[52px] sm:h-[52px] md:w-[52px] xl:w-[52px] md:h-[64px] xl:h-[64px]' src={cardIcon} alt="" />
        </div>
        <div className='flex flex-col'>
            <p className='font-medium text-base text-[#475569]'>{cardName}</p>
            <p className='font-bold text-base '>{cardNumber}</p>
        </div>
    </div>
  )
}

export default AnalysisCards