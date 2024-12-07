import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Calender from '../../Components/DashboardComponents/Calender';
import ChartByGraph from '../../Components/DashboardComponents/ChartByGraph';
import DashboardCard from '../../Components/DashboardComponents/DashboardCard';
import StudentActivityGraph from '../../Components/DashboardComponents/StudentActivityGraph';
import WeeklyOverViewGraph from '../../Components/DashboardComponents/WeeklyOverViewGraph';
import DateRange from '../../Components/DateRangeFilter/DateRange';
import Card from '../../Components/SkeletonEffect/DashboardCards/Card';
import WeeklyOverviewSkeleton from '../../Components/SkeletonEffect/DashboardCards/WeeklyOverviewSkeleton';
import Layout from '../../Layout/Layout';
import { getApi, postApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';
import { dateReturn } from '../../utils/commonFunction/dateTimeConverter';
import RegisterInstitute from '../../Components/DashboardComponents/RegisterInstitute';
import Table from '../../Components/DataTable/Table';
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber';
import { Link } from 'react-router-dom';
import { addDefaultImg } from '../../utils/commonFunction/defaultImage';
import DashboardSkeleton from '../../Components/SkeletonEffect/DashboardSkeleton';
import StudentDataSkeleton from '../../Components/SkeletonEffect/StudentDataSkeleton';

const DashBoard = () => {
  const [isFetch, setIsFetch] = useState({
    totalRegistration: false,
    todayActiveUser: false,
    todayEnrollTest: false,
    pendingTaskToday: false,
    weeklyRegisteredStudent: false,
    chartByGraph: false,
    studentList: false
  });
  const [totalRegistration, setTotalRegistration] = useState({});
  const [todayActiveUser, setTodayActiveUser] = useState({});
  const [todayEnrollTest, setTodayEnrollTest] = useState({});
  const [pendingTaskToday, setPendingTaskToday] = useState({});
  const [weeklyRegisteredStudent, setWeeklyRegisteredStudent] = useState([]);
  const [chartBy, setChartBy] = useState([]);
  const [date, setDate] = useState({
    "startDate": new Date(),
    "endDate": new Date()
  });
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentList, setStudentList] = useState({
    data: [],
    count: 0
  });


  useEffect(() => {
    if (hasAccess(accessKeys?.todayRegisteredStudents)) {
      getTotalRegisteredStudent();
    }
    if (hasAccess(accessKeys?.todayActiveStudents)) {
      getTodayActiveUser();
    }

    if (hasAccess(accessKeys?.todayEnrolledTests)) {
      todayEnrollTestCount();
    }

    if (hasAccess(accessKeys?.todayPendingTasks)) {
      pendingTaskTodayCount();
    }

    if (hasAccess(accessKeys?.weeklyRegisteredStudents)) {
      getWeeklyRegisteredStudent();
    }
    getStudentList();

  }, [])

  useEffect(() => {
    if (hasAccess(accessKeys?.getGraphOfActiveStudentAndTest)) {
      getChartByGraph();
    }
  }, [date])


  let postData = {
    "startDate": dateReturn(date?.startDate, "yyyy-mm-dd"),
    "endDate": dateReturn(date?.endDate, "yyyy-mm-dd")
  }

  function onDateChange(p) {
    let newDate = { startDate: p.startDate._d, endDate: p.endDate._d }
    setDate(newDate);
    return;
  }

  async function getTotalRegisteredStudent() {
    let resp = await getApi(urlApi.totalRegistration);
    setIsFetch((prevState) => ({
      ...prevState,
      totalRegistration: true
    }));
    if (resp.responseCode === 200) {
      setTotalRegistration(resp.data);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function getTodayActiveUser() {
    let resp = await getApi(urlApi.todayActiveStudent);
    setIsFetch((prevState) => ({
      ...prevState,
      todayActiveUser: true
    }));
    if (resp.responseCode === 200) {
      setTodayActiveUser(resp.data);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function todayEnrollTestCount() {
    let resp = await getApi(urlApi.todayEnrolledTestCount);
    setIsFetch((prevState) => ({
      ...prevState,
      todayEnrollTest: true
    }));
    if (resp.responseCode === 200) {
      setTodayEnrollTest(resp.data);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function pendingTaskTodayCount() {
    let resp = await getApi(urlApi.todayPendingTask);
    setIsFetch((prevState) => ({
      ...prevState,
      pendingTaskToday: true
    }));
    if (resp.responseCode === 200) {
      setPendingTaskToday(resp.data);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function getWeeklyRegisteredStudent() {
    let resp = await getApi(urlApi.weeklyRegisteredStudent);
    setIsFetch((prevState) => ({
      ...prevState,
      weeklyRegisteredStudent: true
    }));
    if (resp.responseCode === 200) {
      setWeeklyRegisteredStudent(resp.data?.weeklyData);
    } else {
      toast.error(resp.message);
    }
    return;
  }


  async function getChartByGraph() {
    let resp = await postApi(urlApi.getChartBy, postData);
    setIsFetch((prevState) => ({
      ...prevState,
      chartByGraph: true
    }));
    if (resp.responseCode === 200) {
      setChartBy(resp.data);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function getStudentList() {
    let url = urlApi?.studentList + "?page=" + currentPage + "&limit=" + itemPerPage;
    let resp = await getApi(url);
    setIsFetch((prevState) => ({
      ...prevState,
      studentList: true
    }));
    if (resp.responseCode === 200) {
      setStudentList({
        data: resp?.data?.value,
        count: resp?.data?.count
      })
    } else {
      toast.error(resp.message);
    }
    return;
  }


  const columns = useMemo(() => {
    return (
      [
        {
          name:
            <div className='font-semibold'>
              SL No
            </div>,
          center: true,
          width: "80px",
          cell: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage),
        },
        {
          name:
            <div className='font-semibold'>
              Name
            </div>,
          selector: row => row?.name,
          wrap: true,
          width: "200px",
          cell: row =>
          (hasAccess(accessKeys?.getStudentProfile) ?
            <Link to={`/students/student-profile/${row?._id}`} >
              <div className='flex items-center gap-2 p-[10px]'>
                <img className='w-[40px] h-[40px] rounded-full object-contain' src={row?.profilePic ?? "null"} alt={row?.teacherName}
                  onError={({ currentTarget }) => { addDefaultImg(currentTarget) }}
                />
                <p className='font-medium text-sm text-primary-blue'>{row.name}</p>
              </div>
            </Link> :
            <>
              <div className='flex items-center gap-2 p-[10px]'>
                <img className='w-[40px] h-[40px] rounded-full object-contain' src={row?.profilePic ?? "null"} alt={row?.teacherName}
                  onError={({ currentTarget }) => { addDefaultImg(currentTarget) }}
                />
                <p className='font-medium text-sm text-primary-blue'>{row.name}</p>
              </div>
            </>
          )

        },
        {
          name:
            <div className='font-semibold'>
              Status
            </div>,
          center: true,
          selector: row => row.status,
          cell: row =>
            <div className={`w-[70px] ${row.status == 1 ? "bg-primary-blue" : "bg-primary-red"} rounded-xl flex justify-center p-2 text-white-color font-normal cursor-default`}>
              {
                row?.status == 1 ? <p>{row?.statusString}</p> : <p>{row?.statusString}</p>
              }
            </div>
        },
        {
          name:
            <div className='font-semibold'>
              Mobile No
            </div>,
          center: true,
          selector: row => row?.mobileNumber,
        },
        {
          name:
            <div className='font-semibold'>
              ID No
            </div>,
          center: true,
          selector: row => row?.ID ?? "---"
        },
        {
          name:
            <div className='font-semibold'>
              Email ID
            </div>,
          selector: row => row.emailId,
        },
        {
          name:
            <div className='font-semibold'>
              Batch
            </div>,
          selector: row => row.batch,
        },
        {
          name:
            <div className='font-semibold'>
              Category
            </div>,
          center: true,
          selector: row => row.categoryString,
        }
      ])
  }, [studentList])

  return (
    <Layout>
      <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 gap-3 px-2 mt-2'>
        <div className='md:col-span-2 px-2'>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>

            {hasAccess(accessKeys?.todayRegisteredStudents) &&
              <>
                {isFetch?.totalRegistration ? <DashboardCard
                  cardName={"Total Registrations"}
                  cardNumber={totalRegistration?.registeredStudents || 0}
                  cardNavIcon={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/totalRegistrationNavIcon.svg"}
                  cardIcon={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/totalRegistrationIcon.svg"}
                  cardColor={'#FFF2E5'}
                /> : <Card color={"#FFF2E5"} />}
              </>}

            {hasAccess(accessKeys?.todayActiveStudents) && <>
              {isFetch?.todayActiveUser ? <DashboardCard
                cardName={"Today active users"}
                cardNumber={(todayActiveUser?.activeStudents || 0) + "/" + (todayActiveUser?.totalStudents || 0)}
                cardNavIcon={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/totalActiveUserarrowIcon.svg"}
                cardIcon={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/totalActiveUserIcon.svg"}
                cardColor={'#EAE7FF'}
              /> : <Card color={"#EAE7FF"} />}
            </>}

            {hasAccess(accessKeys?.todayEnrolledTests) && <>
              {isFetch?.todayEnrollTest ? <DashboardCard
                cardName={"Tests Enrolled Today"}
                cardNumber={todayEnrollTest?.todayEnrolledTests || 0}
                cardNavIcon={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/totalEnrollTestarrowIcon.svg"}
                cardIcon={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/todayEnrollTestIcon.svg"}
                cardColor={'#F9FFEC'}
              /> : <Card color={"#F9FFEC"} />}
            </>}

            {hasAccess(accessKeys?.todayPendingTasks) && <>
              {isFetch?.pendingTaskToday ? <DashboardCard
                cardName={"Pending Task Today"}
                cardNumber={pendingTaskToday?.todayPendingTasks || 0}
                cardNavIcon={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/pendingTaskTodayarrowIcon.svg"}
                cardIcon={process.env.PUBLIC_URL + "/Assets/Images/dashboardIcons/pendingTaskTodayicon.svg"}
                cardColor={'#FFE3EF'}
              /> : <Card color={"#FFE3EF"} />}
            </>}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4 gap-3'>
            {hasAccess(accessKeys?.getGraphOfActiveStudentAndTest) && <>
              {isFetch?.chartByGraph ?
                <div className='bg-white-color p-2 shadow-xl rounded-2xl col-span-2 h-[450px]'>
                  <div className='flex items-center gap-2'>
                    <p className='font-bold text-md'>Chart by</p>
                    <DateRange onApplyClick={(p) => onDateChange(p)} startDate={date?.startDate} endDate={date?.endDate} />
                  </div>
                  <ChartByGraph data={chartBy} />
                </div>
                :
                <div className='bg-white-color p-2 shadow-xl rounded-2xl col-span-2 h-[450px]'>
                  <DashboardSkeleton />
                </div>}
            </>}

            {hasAccess(accessKeys?.weeklyRegisteredStudents) && <>
              {isFetch?.weeklyRegisteredStudent ?
                <div className='h-fit border bg-white-color p-3 shadow-xl rounded-2xl'>
                  <WeeklyOverViewGraph data={weeklyRegisteredStudent} />
                </div>
                :
                <WeeklyOverviewSkeleton />}
            </>}
          </div>
          {isFetch?.studentList ? <div className='mt-4 shadow-xl mb-3'>
            <div className='h-auto w-full bg-white-color rounded-tr-3xl rounded-tl-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
              <div className='font-semibold text-base sm:w-auto order-[1]'>
                Student Data
              </div>
            </div>
            <Table
              columns={columns}
              data={studentList?.data}
            />
          </div> : <StudentDataSkeleton />}
        </div>


        {(hasAccess(accessKeys?.todayActiveStudents) && hasAccess(accessKeys?.getPendingTasksByDate)) && <div className=''>
          {hasAccess(accessKeys?.todayActiveStudents) && <div className='bg-white-color rounded-3xl shadow-xl'>
            <StudentActivityGraph activeStudent={todayActiveUser?.activeStudents || 0} totalStudent={todayActiveUser?.totalStudents || 0} />
          </div>}
          {hasAccess(accessKeys?.getPendingTasksByDate) && <div className='mt-4 shadow-xl object-fill'>
            {/* <img className='w-fill ' src={cal} alt='' /> */}
            <Calender />
          </div>}
        </div>}
      </div>
    </Layout>
  )
}

export default DashBoard