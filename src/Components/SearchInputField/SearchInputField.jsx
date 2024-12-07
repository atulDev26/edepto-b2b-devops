import { IconSearch } from '@tabler/icons-react'
import React from 'react'

const SearchInputField = ({bgColor,inputId,onClick,onChange,placeholder}) => {
    return (
        <form className='relative full' onSubmit={(e) => {e.preventDefault();onClick()}}>
            <input type="text" placeholder={placeholder ||'Search'} id={inputId || 'table-search-field'} className={`w-[100%] p-[10px] 
            ${bgColor} rounded-xl focus:outline-none border border-gray-300`} onChange={(e)=>onChange(e)} />
            <IconSearch onClick={(e) => { e.preventDefault(); onClick() }} cursor={"pointer"} className={`absolute top-[10px] right-[10px] ml-2  ${bgColor}`} />
        </form>
    )
}

export default SearchInputField           