import FullCalendar from '@fullcalendar/react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'


const OtherTaskList = () => {
    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [currentEvents, setCurrentEvents] = useState([]);
  
  
    function handleWeekendsToggle() {
      setWeekendsVisible(!weekendsVisible)
    }
  
    function handleDateSelect(selectInfo) {
      let title = prompt('Please enter a new title for your event')
      let calendarApi = selectInfo.view.calendar
  
      calendarApi.unselect() // clear date selection
  
      if (title) {
        calendarApi.addEvent({
          id: 1,
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    }
  
    function handleEventClick(clickInfo) {
      if (toast.warning(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    }
  
    function handleEvents(events) {
      setCurrentEvents(events)
    }
  
    return (
      <>
        {/* <AddTaskList /> */}
        <div className='flex flex-col md:flex-row rounded-xl bg-white p-4 shadow-xl mt-2 '>
          <Sidebar
            weekendsVisible={weekendsVisible}
            handleWeekendsToggle={handleWeekendsToggle}
            currentEvents={currentEvents}
          />
          <div className='w-full'>
            <FullCalendar
              schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView='dayGridMonth'
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={weekendsVisible}
              // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
              select={handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={handleEventClick}
              eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
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
  
    function Sidebar({ currentEvents }) {
      return (
        <div className='border-r-transparent p-2'>
          <div className=''>
            <h2 className='font-semibold text-lg'>Events</h2>
            <p className='font-normal text-[#475569 ]'>Drag and drop your event or click
              in the calendar</p>
          </div>
          <div className='demo-app-sidebar-section'>
            <h2>All Events ({currentEvents.length})</h2>
            <div className="">
              <select className="w-full cursor-pointer bg-white border border-gray-300 rounded-[10px] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500" >
                {currentEvents.map((event) => (
                  <option value="">{event.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )
    }
  
}

export default OtherTaskList