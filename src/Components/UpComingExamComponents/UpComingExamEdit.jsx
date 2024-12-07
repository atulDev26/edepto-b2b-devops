import React, { useEffect, useState } from 'react'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';
import { Modal } from 'react-bootstrap';
import ButtonUI from '../Buttons/ButtonUI';
import { extractDate } from '../../utils/commonFunction/dateTimeConverter';

const UpComingExamEdit = ({callback,data}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    if (show) {
        document.getElementById('post-date').value = extractDate(data?.postDate) || "";
        document.getElementById('last-date').value = extractDate(data?.lastApplyDate) || "";
        document.getElementById('admin-date').value = extractDate(data?.admitCardDate) || "";
        document.getElementById('exam-date').value = extractDate(data?.examDate) || "";
        document.getElementById('result-date').value = extractDate(data?.resultDate) || "";
    }
}, [show])


  async function handleAddUpComingExamDetails() {
      loadingShow();
      let postData = {
          exam: document.getElementById('exam').value,
          conductingAuthority: document.getElementById('conductingAuthority').value,
          postName: document.getElementById('postName').value,
          vacancy: parseInt(document.getElementById('vacancy').value),
          postDate: document.getElementById('post-date').value,
          lastApplyDate: document.getElementById('last-date').value,
          admitCardDate: document.getElementById('admin-date').value,
          examDate: document.getElementById('exam-date').value,
          resultDate: document.getElementById('result-date').value,
          blogLink: document.getElementById('Blog-link').value,
          jobNotificationLink: document.getElementById('jobNotificationLink').value,
          eligibility: document.getElementById('eligibility').value
      }
      if (!postData.admitCardDate) delete postData.admitCardDate;
      if (!postData.examDate) delete postData.examDate;
      if (!postData.resultDate) delete postData.resultDate;
      if (!postData.blogLink) delete postData.blogLink;
      if (!postData.jobNotificationLink) delete postData.jobNotificationLink;
      if (!postData.eligibility) delete postData.eligibility;
      let resp = await postApi(urlApi.updateUpComingTest + data?._id, postData);
      loadingHide();
      if (resp.responseCode === 200) {
          toast.success(resp.message);
          if (callback) {
              callback();
          }
          handleClose();
          document.getElementById('exam').value = null;
          document.getElementById('conductingAuthority').value = null;
          document.getElementById('postName').value = null;
          document.getElementById('vacancy').value = null;
          document.getElementById('post-date').value = null;
          document.getElementById('last-date').value = null;
          document.getElementById('admin-date').value = null;
          document.getElementById('exam-date').value = null;
          document.getElementById('result-date').value = null;
          document.getElementById('Blog-link').value = null;
          document.getElementById('jobNotificationLink').value = null;
          document.getElementById('eligibility').value = null;
      } else {
          toast.error(resp.message);
      }
      return;
  }
  return (
      <>
          <i className={`fa fa-edit fa-lg text-primary-blue cursor-pointer`} onClick={() => handleShow()}></i>
          <Modal
              show={show}
              onHide={handleClose}
              size="md"
              backdrop="static"
              keyboard={false}
          >
              <Modal.Header>
                  <div className="w-full flex justify-between items-center">
                      <p className="font-semibold text-base cursor-default">
                          Edit Upcoming Exam
                      </p>
                      <div>
                          <img
                              src={process.env.PUBLIC_URL + "/Assets/Images/closeIcon.svg"}
                              alt="close"
                              className="cursor-pointer"
                              onClick={() => {
                                  handleClose();
                              }}
                          />
                      </div>
                  </div>
              </Modal.Header>
              <Modal.Body>
                  <div className="p-4 flex flex-col items-center justify-center">
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Exam Name</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="text" name="exam" id='exam' defaultValue={data?.exam}/>
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Conducting Authority</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="text" name="conductingAuthority" id='conductingAuthority' defaultValue={data?.conductingAuthority}/>
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Post Name</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="text" name="PostName" id='postName' defaultValue={data?.postName}/>
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Vacancy</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="number" name="vacancy" id='vacancy' min={0} defaultValue={data?.vacancy}/>
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Blog Link </label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="url" id='Blog-link' defaultValue={data?.blogLink}/>
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Job Notification Link </label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="url" id='jobNotificationLink' defaultValue={data?.jobNotificationLink}/>
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Eligibility</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="text" id='eligibility' defaultValue={data?.eligibility}/>
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Post Date</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="date" placeholder="DD/MM/YYYY" id='post-date' />
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Last Date to Apply</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="date" id='last-date' />
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Admit Card Date</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="date" id='admin-date' />
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Exam Date</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="date" id='exam-date' />
                      </div>
                      <div className="flex flex-col gap-1 w-[100%]">
                          <label className="font-medium text-sm">Result Date</label>
                          <input className={`w-full border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 `} type="date" id='result-date' />
                      </div>
                  </div>
              </Modal.Body>
              <Modal.Footer
                  style={{
                      backgroundColor: "#F5F7FB",
                      borderRadius: "0px 0px 20px 20px",
                  }}
              >
                  <div className="w-[180px] flex  gap-3">
                      <ButtonUI
                          text={"Cancel"}
                          variant="transparent"
                          color={"var(--primary-red)"}
                          onClick={handleClose}
                      >
                          Cancel
                      </ButtonUI>
                      <ButtonUI
                          text={"Update"}
                          variant="transparent"
                          color={"var(--primary-blue)"}
                          onClick={() => handleAddUpComingExamDetails()}
                      />
                  </div>
              </Modal.Footer>
          </Modal>
      </>
  )
}

export default UpComingExamEdit