import { IconLanguage } from '@tabler/icons-react';
import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { getLanguageStringFromId } from '../../utils/getDataFromId';

const StudentEnrolledTestLanguagePopover = ({ data }) => {
    const popover = (
        <Popover id="popover-basic">
            <Popover.Body className='p-2' style={{ backgroundColor: '#f4f4f4' }}>
                <div>
                    {
                        data?.map((lang, index) => {
                            return (
                                <p className='mb-0' key={index}>{getLanguageStringFromId(lang?._id)}</p>
                            )
                        })
                    }
                </div>
            </Popover.Body>
        </Popover>
    );
    const Example = () => (
        <OverlayTrigger trigger={["click"]} placement="bottom" overlay={popover} rootClose>
            <IconLanguage className='cursor-pointer text-primary-blue' />
        </OverlayTrigger>
    );
    return (
        <>
            <Example />
        </>
    )
}

export default StudentEnrolledTestLanguagePopover