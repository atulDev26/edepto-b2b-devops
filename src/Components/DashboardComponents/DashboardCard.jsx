import React from 'react'

const DashboardCard = ({cardName,cardIcon,cardNavIcon,cardColor,cardNumber}) => {
    return (
        <div className={`w-full bg-[${cardColor}] p-3 shadow-xl rounded-[20px]`} style={{
            backgroundColor: `${cardColor}`
        }}>
            <div className='flex justify-between place-items-start'>
                <img className='cursor-pointer w-[52px] h-[52px] sm:w-[52px] sm:h-[52px] md:w-[52px] xl:w-[52px] md:h-[64px] xl:h-[64px]' src={cardIcon} alt="" />
                {/* <img className='cursor-pointer w-[30px] h-[30px]' src={cardNavIcon} alt="" /> */}
            </div>
            <div className='pt-3 flex flex-col gap-1'>
                <p className='font-bold text-2xl '>{cardNumber}</p>
                <p className='font-medium text-sm text-[#475569]'>{cardName}</p>
            </div>
        </div>
    )
}

export default DashboardCard