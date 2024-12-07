import { IconChevronLeft, IconChevronRight, IconCube } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import "./calender.css";
import { dateReturn } from '../../utils/commonFunction/dateTimeConverter';
import { getApi, postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { toast } from 'sonner';
import DeleteConformationModal from '../DeleteConformationModal/DeleteConformationModal';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';

const Calender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());
  const [pendingTask, setPendingTask] = useState([]);

  useEffect(() => {
    getPendingTask();
  }, [selectedDate]);

  async function getPendingTask() {
    let resp = await postApi(urlApi.pendingTask, createPostData(activeDate));
    if (resp.responseCode === 200) {
      setPendingTask(resp.data);
    } else {
      // toast.error(resp.message);
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setActiveDate(date);
  };


  const handlePreviousDate = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(previousDate);
    setActiveDate(previousDate);
  };

  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDate);
    setActiveDate(nextDate);
  };

  const generateDates = (startDate) => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      dates.push({
        date: currentDate,
        isCurrentDate: currentDate.toDateString() === today.toDateString(),
      });
    }
    return dates;
  };

  const createPostData = (date) => {
    const formattedDate = date;
    let postData = {
      "startDate": formatDate(formattedDate),
      "endDate": formatDate(formattedDate)
    };
    return postData;
  };

  const formatDate = (date) => {
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, '0');
    const day = String(date?.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  async function updateTask(taskId) {
    loadingShow();
    let resp = await getApi(urlApi.updateStatus + taskId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      getPendingTask();
    } else {
      toast.error(resp.message);
    }
    return;
  }
  return (
    <div className='bg-white p-2 shadow-md rounded-2xl  mb-3'>
      <p className='font-bold text-base p-2'>Upcoming Task</p>
      <div className='w-full border mb-3' />
      <div className='w-full flex flex-col items-center border shadow-sm rounded-lg'>
        <div className='flex items-center justify-around w-full mt-3'>
          <div className='border w-[30px] h-[30px] rounded-full'>
            <IconChevronLeft className='mr-auto ml-auto text-gray-600 tex hover:text-gray-900 cursor-pointer'
              onClick={handlePreviousDate} />
          </div>
          <div className='text-xl font-bold '>
            {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
          </div>

          <div className='border w-[30px] h-[30px] rounded-full'>
            <IconChevronRight className=' text-gray-600 hover:text-gray-900 cursor-pointer'
              onClick={handleNextDate} />
          </div>
        </div>
        <div className='flex bg-white justify-center rounded-lg overflow-hidden mx-auto py-4 px-2 md:mx-12 w-full '>
          {generateDates(selectedDate)?.map(({ date, isCurrentDate }, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-center w-20 h-20 mx-1 cursor-pointer rounded-lg transition-all duration-300 
              ${isCurrentDate ? 'bg-primary-blue text-white shadow-sm' : ''} 
              ${activeDate && (date.getTime() === activeDate.getTime()) && !isCurrentDate ? 'bg-primary-blue text-white shadow-sm' : ''} 
              ${!isCurrentDate && !(activeDate && (date.getTime() === activeDate.getTime())) ? 'bg-white text-black ' : ''}`}
              onClick={() => handleDateSelect(date)}
            >
              <div className='text-center'>
                <p className={`text-sm ${isCurrentDate || (activeDate && date.getTime() === activeDate.getTime()) ? 'text-white font-bold shadow-sm' : 'text-black'} transition-all duration-300`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`mt-2 ${isCurrentDate || (activeDate && date.getTime() === activeDate.getTime()) ? 'text-white font-bold shadow-sm' : 'text-black'} transition-all duration-300`}>
                  {date.getDate()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-4 max-h-[400px] h-[400px] overflow-auto'>
        {pendingTask?.map((task, index) =>
        (
          <>
            <div key={index} className='flex items-center space-x-4 p-2 border-b'>
              <div className='w-8 h-8 rounded-full flex items-center justify-center'>
                {index % 3 === 0 && <img src={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/dashboardCalenderDataOne.svg"} alt="" />}
                {index % 3 === 1 && <img src={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/dashboardCalenderDataTwo.svg"} alt="" />}
                {index % 3 === 2 && <img src={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/dashboardCalenderDatathree.svg"} alt="" />}
              </div>
              <div className='flex w-full flex-row items-center justify-between'>
                <div>
                  <p className='font-bold text-clip overflow-hidden'>{task?.task}</p>
                  <p className='text-sm text-gray-500'>{new Date(task.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                </div>
                <div>
                  <DeleteConformationModal onclick={() => { updateTask(task?._id); getPendingTask() }} content={<p>Are you Sure to Mark the task as Complete ?</p>} heading={"Warning !!!"} complete={true} />
                </div>
              </div>
            </div>
            {index !== pendingTask?.length - 1 && <div className='w-full border mb-3' />}
          </>
        ))}
      </div>
    </div>
  );
};

export default Calender;
