import { IconBell, IconBook2, IconCash, IconCertificate, IconClipboardList, IconClockCheck, IconHome, IconHours24, IconMessageDots, IconPictureInPictureTop, IconReceipt, IconSchool, IconSettingsCog, IconUserShield, IconUsers, IconZoomCode } from '@tabler/icons-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import "./SideMenu.css"
import Logout from './Logout'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import { USER_DATA } from '../../api/localStorageKeys'

const SideMenu = () => {
  const userData = JSON.parse(USER_DATA());
  const menuItems = [
    (hasAccess(accessKeys?.todayRegisteredStudents) || hasAccess(accessKeys?.todayActiveStudents) || hasAccess(accessKeys?.todayEnrolledTests) || hasAccess(accessKeys?.todayPendingTasks) || hasAccess(accessKeys?.weeklyRegisteredStudents) || hasAccess(accessKeys?.getGraphOfActiveStudentAndTest) || hasAccess(accessKeys?.getPendingTasksByDate)) && { path: '/dashboard', icon: <IconHome />, text: 'Dashboard' },
    hasAccess(accessKeys?.getTeachers)
    && { path: '/teachers', icon: <IconUserShield />, text: 'Teachers' }
    ,
    hasAccess(accessKeys?.getStudentList)
    && { path: '/students', icon: <IconUsers />, text: 'Students' }
    ,
    // (hasAccess(accessKeys?.getAllPass)
    //   && ({ path: '/exam-pass', icon: <IconCertificate />, text: 'Exam Pass' })
    // ),
    (hasAccess(accessKeys?.getCategories)
      && ({ path: '/test-&-categories', icon: <IconSchool />, text: 'Test & Category' })
    ),
    (hasAccess(accessKeys?.getUpcomingTests) &&
      ({ path: '/upcoming-exam', icon: <IconZoomCode />, text: 'Upcoming Exams' })
    ),
    (hasAccess(accessKeys?.getTopPerformer) &&
      ({ path: '/top-performer', icon: <IconMessageDots />, text: 'Top Performers' })
    ),
    (hasAccess(accessKeys?.getIssues) &&
      ({ path: '/feedback-&-support', icon: <IconHours24 />, text: 'Feedback & Support' })
    ),
    (hasAccess(accessKeys?.getNotifications) &&
      ({ path: '/notification', icon: <IconBell />, text: 'Notification' })
    ),
    { path: '/setting', icon: <IconSettingsCog />, text: 'Setting' },
    ((hasAccess(accessKeys?.getBanners) || hasAccess(accessKeys?.getPopups))
      && ({ path: '/banner-popup', icon: <IconPictureInPictureTop />, text: 'Banner & Popup' })
    ),
    { path: '/task-list', icon: <IconClipboardList />, text: 'Task List' },
    (userData?.isHOI &&
      ({ path: '/price-&-plan', icon: <IconCash />, text: 'Price & Plan' })),
    { path: '/invoices', icon: <IconReceipt />, text: 'Invoices' },
    { path: 'https://blog.edepto.in/', icon: <IconBook2 />, text: 'Blogs' },
    { path: '/activity', icon: <IconClockCheck />, text: 'Activity' },
  ].filter(Boolean);
  return (
    <nav className='flex flex-col gap-[6px] sm:gap-[6px] md:gap-[6px]'>
      {menuItems?.map((menuItem, index) => (
        <NavLink key={index} to={menuItem?.path} target={menuItem?.text == "Blogs" && "_blank"} className={({ isActive }) =>
          isActive
            ? 'relative before:content-[""] before:absolute before:left-0 before:h-full before:w-[10px] before:bg-primary-red bg-primary-blue text-white px-4 py-2 flex items-center'
            : 'relative bg-transparent text-menu-text-color px-4 py-2 flex items-center'
        }>
          <div className='flex items-center gap-2'>
            {menuItem.icon}
            {menuItem.text}
          </div>
        </NavLink>
      ))}
      <Logout />
    </nav>
  )
}

export default SideMenu