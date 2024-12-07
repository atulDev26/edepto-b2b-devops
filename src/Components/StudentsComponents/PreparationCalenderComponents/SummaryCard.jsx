import React, { useRef, useState } from 'react'
import { Button, Overlay, Popover } from 'react-bootstrap';
import "./SummaryCard.css"

const SummaryCard = ({ icon, title, score, outOff, popupDescription, info }) => {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    return (
        <div className="summary-card shadow-sm mt-2">
            {info && <Button ref={target} className='info-icon' onClick={() => setShow(!show)}>
                {/* <BsInfoCircle color='var(--gray)' size={18} /> */}
            </Button>}
            <Overlay rootClose={true} trigger="click" target={target.current}
                onHide={() => setShow(false)} show={show} placement="left">
                {(props) => (
                    <Popover id="popover-positioned-start" {...props}>
                        <Popover.Header as="h3">How We Calculate {title}?</Popover.Header>
                        <Popover.Body>
                            {popupDescription}
                        </Popover.Body>
                    </Popover>
                )}
            </Overlay>
            <div className="icon">
                <img src={icon ?? process.env.PUBLIC_URL + "/Images/summary-icon.svg"} alt="" />
            </div>
            <p className="mb-0 title">{title ?? "Rank"}</p>
            <p className="mb-0 rank">{score ?? "0"} {outOff && <span className='out-of-rank'>/{outOff ?? "00"}</span>} </p>
        </div>
    )
}

export default SummaryCard