import React from 'react'

const MultiIconButtonUI = ({ text, prefixIcon, suffixIcon, variant = "outline", color = "primary-color", onClick, textColor,borderRadius }) => {
    return (
        <button type="button" aria-label={text} className='flex justify-center items-center gap-2 rounded-xl text-white-color px-2 py-1 font-semibold text-xs sm:text-sm'
            onClick={() => onClick()}
            style={{
                backgroundColor: variant === "outline" ? 'transparent' : color,
                border: `2px solid ${color}`,
                color: `${textColor}`,
                borderRadius:`${borderRadius}`
            }}
        >
            {prefixIcon || null}
            <span className='w-full sm:w-full md:w-fit'>{text || "Add"}</span>
            {suffixIcon || null}
        </button>
    )
}

export default MultiIconButtonUI