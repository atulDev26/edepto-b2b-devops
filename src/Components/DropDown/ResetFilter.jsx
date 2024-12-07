import { IconRefresh } from '@tabler/icons-react';
import React, { useRef } from 'react';

const ResetFilter = ({ options, onclick, val }) => {
  let menuRef = useRef();
  function handleItemClick(option) {
    onclick();
  };
  return (
    <div className='relative' ref={menuRef} title="Reset">
      <IconRefresh size={24} className='text-primary-red' cursor={"pointer"} onClick={() => handleItemClick()} />
    </div>
  )
}

export default ResetFilter