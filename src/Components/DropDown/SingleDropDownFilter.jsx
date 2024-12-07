import React, { useEffect, useState, useRef } from 'react'
import MultiIconButtonUI from '../Buttons/MultiIconButtonUI';
import { IconFilter } from '@tabler/icons-react';

const SingleDropDownFilter = ({ options, reset, defaultOption, onclick }) => {
    const [isActive, setIsActive] = useState(false);
    const [selected, setSelected] = useState(defaultOption);
    let menuRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (!menuRef?.current?.contains(e?.target)) {
                setIsActive(false);
            }
        }
        document.addEventListener('mousedown', handler);
    }, [defaultOption])


    function handleItemClick(option) {
        setSelected(option);
        setIsActive(false);
        onclick(option);
    };
    return (
        <div className='relative' ref={menuRef}>
            <MultiIconButtonUI
                text={<p className='font-semibold text-sm'>{reset ? defaultOption : selected}</p>}
                suffixIcon={<IconFilter size={16} />}
                variant='transparent'
                color='#000000'
                textColor='#F1F1F1'
                onClick={() => { setIsActive(!isActive) }}
            />
            <div
                className={`origin-top-right absolute right-0 mt-2 w-[180px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${isActive ? 'block' : 'hidden'
                    } dropdown-menu`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
            >
                {options?.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => handleItemClick(option)}
                        className=" block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SingleDropDownFilter