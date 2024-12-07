import { BASE_URL } from "./data.pnp";
export const urlApi = {
    //image Upload API
    uploadFile: BASE_URL + "file-service/upload/image",
    //static data
    languages: BASE_URL + "general/static/languages",
    states: BASE_URL + "general/static/states",

    // // access api
    // getAccess: BASE_URL + "general/access/get/",

    //Login api
    registerUser: BASE_URL + "primary/auth-service/auth/register",
    login: BASE_URL + "primary/auth-service/auth/login-otp",
    verifyOtp: BASE_URL + "primary/auth-service/auth/verify-otp",
    autoLogin: BASE_URL + "primary/auth-service/auth/auto-login",
    logOut: BASE_URL + "primary/teacher-service/teacher/logout",


    //Dashboard Api 
    totalRegistration: BASE_URL + "general/dashboard/registered-students",
    todayActiveStudent: BASE_URL + "general/dashboard/active-students",
    todayEnrolledTestCount: BASE_URL + "general/dashboard/enrolled-tests",
    todayPendingTask: BASE_URL + "general/dashboard/pending-tasks",
    weeklyRegisteredStudent: BASE_URL + "general/dashboard/weekly-registered-students",
    getChartBy: BASE_URL + "general/dashboard/weekly-analysis-graph",
    pendingTask: BASE_URL + "general/dashboard/pending-task-by-date",

    // Teachers Api
    getTeachers: BASE_URL + "general/teacher/verified-teachers",
    addTeachers: BASE_URL + "general/teacher/add-teacher",
    editTeacher: BASE_URL + "general/teacher/edit-profile/",
    teacherLoginHistory: BASE_URL + "general/teacher/login-histories/",
    activeTeachers: BASE_URL + "general/teacher/activate/",
    inactiveTeachers: BASE_URL + "general/teacher/deactivate/",
    importAllTeacher: BASE_URL + "file-service/upload/teacher-add-list",
    exportAllTeacher: BASE_URL + "general/teacher/export-teacher-list",

    // Student
    addStudents: BASE_URL + "general/student/add",
    studentList: BASE_URL + "general/student/list",
    studentProfileById: BASE_URL + "general/student/profile/",
    updateStudentProfile: BASE_URL + "general/student/update-profile/",
    activeStudent: BASE_URL + "general/student/activate/",
    deactiveStudent: BASE_URL + "general/student/deactivate/",
    monthlyCalender: BASE_URL + "general/calendar/month-data",
    compairData: BASE_URL + "general/calendar/compare-month-data",
    importAllStudent: BASE_URL + "file-service/upload/student-add-list",
    exportStudentList: BASE_URL + "general/student/export-list",
    pendingList: BASE_URL + "general/student/pending-student-list",

    // studentEnrolledTest
    getEnrolledTest: BASE_URL + "test-service/enrolled-test/get-all/",
    getAnalysis: BASE_URL + "test-service/enrolled-test/get-analysis/",
    getRankers: BASE_URL + "test-service/enrolled-test/get-rankers/",
    getTestSolution: BASE_URL + "test-service/enrolled-test/get-solutions/",

    // Assign Pass Api
    passList: BASE_URL + "general/my-pass/assign-pass-list/",
    assignPass: BASE_URL + "general/my-pass/assign-pass/",
    getPass: BASE_URL + "general/my-pass/my-passes/",
    editAssignPass: BASE_URL + "general/my-pass/edit-pass/",

    // institution
    registerInstitute: BASE_URL + "general/institute/register",
    //price&plan
    getPricePlan: BASE_URL + "general/price-and-plan/get-all",
    buyPlan: BASE_URL + "general/price-and-plan/purchase-plan/",

    //category
    addCategory: BASE_URL + "test-service/category/add",
    getCategory: BASE_URL + "test-service/category/categories",
    editCategory: BASE_URL + "test-service/category/edit/",
    deleteCategory: BASE_URL + "test-service/category/delete/",
    categoryCards: BASE_URL + "test-service/category/category-count",


    // sub-Categories
    addSubCategory: BASE_URL + "test-service/sub-category/add/",
    getSubCategory: BASE_URL + "test-service/sub-category/list/",
    editSubCategory: BASE_URL + "test-service/sub-category/edit/",
    deleteSubCategory: BASE_URL + "test-service/sub-category/delete/",

    //test-section
    addTestSection: BASE_URL + "test-service/section/add/",
    getTestSection: BASE_URL + "test-service/section/sections/",
    getSubSectionDetails: BASE_URL + "test-service/sub-category/by-id/",
    editTestSection: BASE_URL + "test-service/section/edit/",
    deleteTestSection: BASE_URL + "test-service/section/delete/",

    //testlisting 
    addTestListing: BASE_URL + "test-service/sub-section/add/",
    testListing: BASE_URL + "test-service/sub-section/sub-sections/",
    editTestListing: BASE_URL + "test-service/sub-section/edit/",
    // add section 
    addSectionGroup: BASE_URL + "test-service/test/add-section-group/",
    getSectionGroup: BASE_URL + "test-service/test/section-groups/",

    deleteSectionGroup: BASE_URL + "test-service/test/delete-section-group/",
    //test 

    addTest: BASE_URL + "test-service/test/add",
    getTest: BASE_URL + "test-service/test/tests/",
    editTest: BASE_URL + "test-service/test/edit/",
    updateTestStatus: BASE_URL + "test-service/test/update-status/",

    //question and solution
    getSections: BASE_URL + "test-service/test/sections/",
    updateSections: BASE_URL + "test-service/test/edit-section/",
    deleteSections: BASE_URL + "test-service/test/delete-section/",
    addLanguage: BASE_URL + "test-service/test/add-language/",
    addSection: BASE_URL + "test-service/test/add-section/",
    addQuestion: BASE_URL + "test-service/test/add-question/",
    getQuestion: BASE_URL + "test-service/test/questions/",
    addQuestionInOtherLanguage: BASE_URL + "test-service/test/update-question/",
    getSolution: BASE_URL + "test-service/test/solutions/",
    updateSolution: BASE_URL + "test-service/test/update-solution/",
    deleteQuestion: BASE_URL + "test-service/test/delete-question/",
    bulkQuestionAdd: BASE_URL + "file-service/upload/question-add-list",

    // pass
    getallPass: BASE_URL + "general/pass/passes",
    passAnalysis: BASE_URL + "general/pass/pass-analysis",
    addPass: BASE_URL + "general/pass/add",
    editPass: BASE_URL + "general/pass/edit/",
    getSubCategoryStatic: BASE_URL + "general/static/sub-categories/",

    //feedback and support 
    getSubmittedIssues: BASE_URL + "general/issue/submitted-issues",
    updateIssue: BASE_URL + "general/issue/update-status/",


    // Banner And PopUp
    addBanner: BASE_URL + "general/banner/add",
    getBanner: BASE_URL + "general/banner/banners",
    activeStatus: BASE_URL + "general/banner/activate/",
    deactiveStatus: BASE_URL + "general/banner/deactivate/",
    editBanner: BASE_URL + "general/banner/edit/",

    //popup
    addPopUp: BASE_URL + "general/popup/add",
    editPopUp: BASE_URL + "general/popup/edit/",
    getPopup: BASE_URL + "general/popup/popups",
    activePopup: BASE_URL + "general/popup/activate/",
    deactivePopUp: BASE_URL + "general/popup/deactivate/",

    // UpComing Exams 
    addUpComingTest: BASE_URL + "general/upcoming-test/add",
    getUpComingTest: BASE_URL + "general/upcoming-test/upcoming-tests",
    updateUpComingTest: BASE_URL + "general/upcoming-test/edit/",
    deleteUpComingTest: BASE_URL + "general/upcoming-test/delete/",

    //activity
    getActivity: BASE_URL + "general/activity/get-all",

    //todo
    addTodo: BASE_URL + "general/todo/add",
    getMyCalendarTask: BASE_URL + "general/todo/my-calendar-tasks",
    getOtherCalendarTask: BASE_URL + "general/todo/other-calendar-tasks",
    deleteTodo: BASE_URL + "general/todo/delete/",
    updateStatus: BASE_URL + "general/todo/update-status/",

    // topPerformer
    topPerformer: BASE_URL + "general/top-performer/lists",

    // settings for Teachers
    settingsData: BASE_URL + "general/teacher/profile",
    editTeachersProfile: BASE_URL + "general/teacher/edit-profile",

    // institute Data
    getInstituteData: BASE_URL + "general/institute/get-institute-data",
    updateInstituteData: BASE_URL + "general/institute/update-institute-data",

    // notification
    getNotification: BASE_URL + "general/notification/get-notifications",
    createNotification: BASE_URL + "general/notification/create-notification",
    sendNotification: BASE_URL + "general/notification/send-notification/",
    updateSchedule: BASE_URL + "general/notification/schedule-notification/",
    editNotification: BASE_URL + "general/notification/edit-notification/",
    deleteNotification: BASE_URL + "general/notification/delete-notification/",


    // pass assign toggle

    enrolledStudent: BASE_URL + "general/student/enroll/",
    revokeStudent: BASE_URL + "general/student/revoke/",

    //Access Details 
    getAccess: BASE_URL + "general/access/get/",
    updateAccessByTeacherId: BASE_URL + "general/access/update-access/",

    //price plan 
    customPlan: BASE_URL + "general/price-and-plan/mark-institute-interested",

    //EXAM CUTOFFS
    addExamCutOffs: BASE_URL + "test-service/test/add-examCutOffs/",
    updateExamCutOffs: BASE_URL + "test-service/test/update-examCutOffs/",

    //get Invoice
    getInvoice: BASE_URL + "general/invoice/invoice-list",
    getGst: BASE_URL + "general/institute/current-gst",

    //edepto test series list
    getTestSeries: BASE_URL + "general/test-series/sub-categories",
    getEdeptoTestSection: BASE_URL + "general/test-series/test-sections/",
    subCategoryDetailsById: BASE_URL + "general/test-series/sub-category-details/",
    getSubSectionDetailsById: BASE_URL + "general/test-series/test-sub-sections/",
    getTestBySectionsById: BASE_URL + "general/test-series/tests/",
    getEdeptoTestSectionById: BASE_URL + "general/test-series/test-inside-sections/",
    getEdeptoTestQuestions: BASE_URL + "general/test-series/questions/",
    getEdeptoTestSolutions: BASE_URL + "general/test-series/solutions/",

}