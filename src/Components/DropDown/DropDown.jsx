import React, { useEffect, useRef, useState } from 'react';

const DropDown = ({ options, defaultOption, onclick, reset }) => {
    const [isActive, setIsActive] = useState(false);
    const [selected, setSelected] = useState(defaultOption);

    let menuRef = useRef();

    useEffect(() => {
        setSelected(defaultOption)
        let handler = (e) => {
            if (!menuRef?.current?.contains(e?.target)) {
                setIsActive(false);
            }
        }
        document.addEventListener('mousedown', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, [defaultOption])

    function handleItemClick(option) {
        setSelected(option);
        setIsActive(false);
        onclick(option);
    };

    return (
        <div className="relative inline-block text-left w-[100%]" ref={menuRef}>
            <div>
                <button
                    onClick={() => setIsActive(!isActive)}
                    type="button"
                    className="inline-flex justify-between items-center gap-2 w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 "
                    // id="options-menu"
                    aria-expanded="true"
                    aria-haspopup="true"

                >
                    {reset ? defaultOption :selected}
                    <div className={`custom-dropdown ${!isActive ? "dropdown-close" : "dropdown-open"}`} />
                </button>
            </div>
            <div
                className={`origin-top-right absolute z-10 right-0 mt-2 w-full cursor-pointer rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[250px] overflow-y-auto ${isActive ? 'block' : 'hidden'
                    }`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
            >
                {options?.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => handleItemClick(option)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-blue hover:text-white"
                        role="menuitem"
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DropDown