import React from 'react'
import "./questionStatusCard.css"

const QuestionStatusCard = ({icon,status,value}) => {
  return (
    <>
        <div className="ques-status-card shadow-sm">
            <div className="icon-text">
                <img src={icon} alt="" />
                <p className="mb-0">{status}</p>
            </div>
            <p className="count mb-0">{value || 0}</p>
        </div>
    </>
  )
}

export default QuestionStatusCard