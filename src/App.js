import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import PrivateRoute from '../src/Routes/PrivateRoute';
import './App.css';
import Loading from './Components/GlobalLoading/GlobalLoading';
import SplashScreen from './Components/SplashScreen/SplashScreen';
import { } from './utils/StaticData/accessList';
import { accessKeys } from './utils/accessKeys.utils';
import Activity from './view/Activity/Activity';
import BannerPop from './view/Banner&Pop/BannerPop';
import DashBoard from './view/Dashboard/DashBoard';
import ExamPass from './view/ExamPass/ExamPass';
import FeedbackSupport from './view/Feedback&Support/FeedbackSupport';
import Invoices from './view/Invoices/Invoices';
import Login from './view/Login/Login';
import NotFound from './view/NotFound/NotFound';
import Notification from './view/Notification/Notification';
import PricePlan from './view/Price&Plan/PricePlan';
import Settings from './view/Settings/Settings';
import SignUp from './view/SignUp/SignUp';
import AssignPass from './view/Students/AssignPass/AssignPass';
import SingleDayAnalysis from './view/Students/SingleDayAnalysis';
import StudentEnrolledTest from './view/Students/StudentEnrolledTest';
import StudentProfile from './view/Students/StudentProfile';
import StudentReport from './view/Students/StudentReport';
import Students from './view/Students/Students';
import CalenderData from './view/TaskList/CalenderData';
import Teachers from './view/Teachers/Teachers';
import AddTestSection from './view/Test&Category/AddTestSection';
import QuestionAndSolution from './view/Test&Category/QuestionAndSolution';
import SectionGroup from './view/Test&Category/SectionGroup';
import TestCategory from './view/Test&Category/TestCategory';
import TestListing from './view/Test&Category/TestListing';
import TestSubCategory from './view/Test&Category/TestSubCategory';
import TopPerformer from './view/TopPerformer/TopPerformer';
import UpcomingExam from './view/UpcomingExam/UpcomingExam';

import React from 'react';
import { USER_DATA } from './api/localStorageKeys';
import EdeptoQuestionAndSolution from './view/Test&Category/EdeptoTestSeries/EdeptoQuestionAndSolution';
import EdeptoTestListing from './view/Test&Category/EdeptoTestSeries/EdeptoTestListing';
import EdeptoTestSection from './view/Test&Category/EdeptoTestSeries/EdeptoTestSection';
import EdeptoTestSeries from './view/Test&Category/EdeptoTestSeries/EdeptoTestSeries';

const App = () => {
  let profileData = JSON.parse(USER_DATA());
  return (
    <>
      <Loading />
      <Toaster duration={3000} richColors position={'top-right'} visibleToasts={4} />
      <Routes>

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.todayRegisteredStudents, accessKeys?.todayActiveStudents, accessKeys?.todayEnrolledTests, accessKeys?.todayPendingTasks, accessKeys?.weeklyRegisteredStudents, accessKeys?.getGraphOfActiveStudentAndTest, accessKeys?.getPendingTasksByDate]} />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getTeachers]} />}>
          <Route path="/teachers" element={<Teachers />} />
        </Route>

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getStudentList]} />}>
          <Route path='/students/'>
            <Route index element={<Students />} />
            <Route path="student-profile/:studentId" element={<StudentProfile />} />
            <Route path='assign-pass/:studentName/:studentId' element={<AssignPass />} />
            <Route path='single-day-analysis/:student_id/:date' element={<SingleDayAnalysis />} />
            <Route path="enrolled-test/:studentId" element={<StudentEnrolledTest />} />
            <Route path="student-report/:studentId/:testId" element={<StudentReport />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getAllPass]} />}>
          <Route path="/exam-pass" element={<ExamPass />} />
        </Route>

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getCategories]} />}>
          <Route path='/test-&-categories/'>
            <Route index element={<TestCategory />} />
            <Route path="test-subcategory/:categoryId" element={<TestSubCategory />} />
            <Route path="add-test-section/:categoryId/:subCategoryId" element={<AddTestSection />} />
            <Route path="test-listing/:categoryId/:subCategoryId/:sectionId" element={<TestListing />} />
            <Route path="question-and-solution/:testId" element={<QuestionAndSolution />} />
            <Route path='section-group/:section_id' element={<SectionGroup />} />
            <Route path="edepto-test-subcategory" element={<EdeptoTestSeries />} />
            <Route path="edepto-test-section/:subCategoryId" element={<EdeptoTestSection />} />
            <Route path="edepto-test-listing/:subCategoryId/:sectionId" element={<EdeptoTestListing />} />
            <Route path="edepto-question-and-solution/:testId" element={<EdeptoQuestionAndSolution />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getUpcomingTests]} />}>
          <Route path="/upcoming-exam" element={<UpcomingExam />} />
        </Route>

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getTopPerformer]} />}>
          <Route path="/top-performer" element={<TopPerformer />} />
        </Route>

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getIssues]} />}>
          <Route path="/feedback-&-support" element={<FeedbackSupport />} />
        </Route>

        {/* <Route path="/all-blog" element={<AllBlog />} /> */}

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getNotifications]} />}>
          <Route path="/notification" element={<Notification />} />
        </Route>

        <Route path="/setting" element={<Settings />} />

        <Route element={<PrivateRoute accessKeyList={[accessKeys?.getBanners, accessKeys?.getPopups]} />}>
          <Route path="/banner-popup" element={<BannerPop />} />
        </Route>

        {/* <Route element={<PrivateRoute accessKeyList={[accessKeys?.getCalendarMonthData, accessKeys?.getCompareMonthData]} />}> */}
        <Route path="/task-list" element={<CalenderData />} />
        {/* </Route> */}


        <Route path="/price-&-plan" element={<PricePlan />} />

        <Route path="/invoices" element={<Invoices />} />
        <Route path="/activity" element={<Activity />} />


        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/no-access" element={<div>No Access</div>} />
      </Routes>
    </>
  );
}

export default App;
