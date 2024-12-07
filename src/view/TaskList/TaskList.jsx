import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import momentPlugin from '@fullcalendar/moment'
import FullCalendar from '@fullcalendar/react'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import React, { useState } from 'react'
import { toast } from 'sonner'
import "./TaskList.css"
import { IconCopyCheckFilled, IconTrash } from '@tabler/icons-react'
import { urlApi } from '../../api/urlApi'
import { getApi } from '../../api/callApi'
import ConformationModal from '../../Components/ConformationModal/ConformationModal'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import DeleteConformationModal from '../../Components/DeleteConformationModal/DeleteConformationModal'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'

const TaskList = ({ event, callback }) => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  async function handleDelete(id, event) {
    let resp = await getApi(urlApi.deleteTodo + id);
    if (resp.responseCode === 200) {
      if (callback) {
        callback()
      }
    } else {
      toast.error(resp.message)
    }
    return;
  }

  async function updateTask(taskId) {
    loadingShow();
    let resp = await getApi(urlApi.updateStatus + taskId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      if (callback) {
        callback();
      }
    } else {
      toast.error(resp.message);
    }
    return;
  }

  return (
    <>
      <div className='flex flex-col md:flex-row rounded-xl bg-white p-4 shadow-xl mt-2'>
        {/* <Sidebar
          weekendsVisible={weekendsVisible}
          handleWeekendsToggle={handleWeekendsToggle}
          currentEvents={event}
        /> */}
        <div className='w-full'>
          <FullCalendar
            schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
            plugins={[listPlugin, resourceTimelinePlugin, dayGridPlugin, timeGridPlugin, momentPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            timeZone="local"
            headerToolbar={{
              start: 'dayGridMonth,timelineWeek,timelineDay',
              center: 'title',
              end: 'today prev,next',
            }}
            height="620px"
            // datesSet={(e) => { this.setState({ timeLineDate: e }, () => this.fetchAllEventData(this.state.currentTab)) }}
            events={event}
            editable={true}
            selectable={false}
            // eventClick={(event) => handleEventClick(event)}
            eventContent={(e) => {
              return (
                <>
                  <div className="d-flex align-items-center gap-2 ">
                    <span className={`text=[${event?.color}]`}
                      style={{ fontSize: "14px", fontWeight: 600, padding: "2px", textDecorationColor: "red", textDecoration: e.event.extendedProps?.status == 1 ? 'line-through' : 'none' }}>
                      {e.event._def.extendedProps.adminName ? e.event._def.extendedProps.adminName + " : " + e.event._def.title : e.event._def.title}
                    </span>
                    <div className='flex'>
                      <ConformationModal bodyText={"Are you Sure to Mark the task as Complete  ?"} components={<IconCopyCheckFilled stroke={2.5} className={`cursor-pointer text-orange-400 `} />}
                        handleOperation={() => {
                          updateTask(e.event.extendedProps.taskId)
                        }} />
                      {hasAccess(accessKeys?.deleteTask) && <ConformationModal bodyText={"Are You Sure To Delete the task ?"} components={<IconTrash size={18} stroke={2.5} color='red' />}
                        handleOperation={() => { handleDelete(e.event.extendedProps.taskId, event) }} />}
                    </div>
                  </div>
                </>)
            }
            }
          />
        </div>
      </div>
    </>
  )

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

  // function Sidebar({ currentEvents }) {
  //   return (
  //     <div className='border-r-slate-300 p-3'>
  //       <div className=''>
  //         <h2 className='font-semibold text-lg'>Events</h2>
  //         <p className='font-normal text-[#475569]'>Drag and drop your event or click
  //           in the calendar</p>
  //       </div>
  //       <div className='demo-app-sidebar-section'>
  //         <h2>All Events ({currentEvents.length})</h2>
  //         <div className="">
  //           <select className="w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" >
  //             {currentEvents.map((event) => (
  //               <option value="" key={event._id}>{event.title}</option>
  //             ))}
  //           </select>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

}

export default TaskList