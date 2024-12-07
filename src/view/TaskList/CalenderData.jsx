import { IconDots } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { getApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import AddTaskList from '../../Components/TaskList/AddTaskList';
import Layout from '../../Layout/Layout';
import { accessKeys } from '../../utils/accessKeys.utils';
import { dateReturnForCalendar } from '../../utils/CalenderTaskFormat/CalenderTaskFormat';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { hasAccess } from '../../utils/StaticData/accessList';
import TaskList from './TaskList';

const CalenderData = () => {
    const [key, setKey] = useState(hasAccess(accessKeys?.getOtherCalendarTasks) ? 'All' : 'MyCalender');

    const [allTask, setAllTask] = useState([
        {
            title: "",
            start: "",
            end: "",
            adminName: "",
            taskId: "",
            status: "",
        }

    ]);
    const [myTask, setMyTask] = useState([
        {
            title: "",
            start: "",
            end: "",
        }

    ]);

    const [resetData, setResetData] = useState({
        "All": false,
        "MyCalender": false,
    });

    useEffect(() => {
        if (hasAccess(accessKeys?.getOtherCalendarTasks)) {
            getAllTask();
        }
        getMyTask();
    }, [])

    function handleTabChange(tabKey) {
        setKey(tabKey);
        // setResetData(prevState => ({
        //     ...prevState,
        //     [tabKey]: !prevState[tabKey]
        // }));
    }

    async function getAllTask() {
        loadingShow();
        let resp = await getApi(urlApi.getOtherCalendarTask);
        loadingHide();
        if (resp.responseCode === 200) {
            let formattedEvents = resp?.data?.map(task => ({
                title: task.task,
                start: dateReturnForCalendar(task.startDate),
                end: dateReturnForCalendar(task.endDate),
                adminName: task.adminId ? task.adminId.username : '',
                taskId: task._id,
                status: task.status,
                color: task.colourCode
            }));
            setAllTask(formattedEvents);
        } else {
            // setAllTask([{
            //     title: "",
            //     start: "",
            //     end: "",
            //     adminName: "",
            //     taskId: "",
            //     status: "",
            //     color: "",
            // }])
            // toast.error(resp.message)
        }
    }
    // 7980740001

    async function getMyTask() {
        loadingShow();
        let resp = await getApi(urlApi.getMyCalendarTask);
        loadingHide()
        if (resp.responseCode === 200) {
            const formattedEvents = resp?.data?.map(task => ({
                title: task.task,
                start: dateReturnForCalendar(task.startDate),
                end: dateReturnForCalendar(task.endDate),
                taskId: task._id,
                status: task.status,
                color: task.colourCode
            }));
            setMyTask(formattedEvents);
        } else {
            // toast.error(resp.message)
        }
    }

    return (
        <Layout>
            <div className='h-auto w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
                <div className='flex justify-center items-center gap-2 font-semibold text-base sm:w-auto order-[1]'>
                    {/* Todo Calender */}
                    {hasAccess(accessKeys?.addTask) && <div className='order-[2]'>
                        <AddTaskList callback={() => { getMyTask(); getAllTask() }} />
                    </div>}
                </div>
                <div className='flex filter-container items-center gap-3 order-[3] sm:order-[3]'>
                    <IconDots size={24} cursor={"normal"} />
                </div>
            </div>
            <div className='w-full border' />
            <div className='p-2 bg-white-color'>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => {
                        handleTabChange(k);
                    }}
                    className="mb-3"
                >
                    {hasAccess(accessKeys?.getOtherCalendarTasks) && <Tab eventKey="All" title="All">
                        <TaskList tab={key} event={allTask} resetData={resetData["All"]} callback={() => getAllTask()} />
                    </Tab>}
                    <Tab eventKey="MyCalender" title="My Calender">
                        <TaskList tab={key} event={myTask} resetData={resetData["myTask"]} callback={() => getMyTask()} />
                    </Tab>
                </Tabs>
            </div>
        </Layout>
    )
}

export default CalenderData