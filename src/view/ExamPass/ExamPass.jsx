import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import DateRange from '../../Components/DateRangeFilter/DateRange'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import AddPassModal from '../../Components/ExamPassComponents/AddPassModal'
import ExamPassCards from '../../Components/ExamPassComponents/ExamPassCards'
import SectionInfoCard from '../../Components/SectionInfoCard/SectionInfoCard'
import Layout from '../../Layout/Layout'
import { getApi, postApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { dateReturn } from '../../utils/commonFunction/dateTimeConverter'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'


let filter = null;
const ExamPass = () => {
  const [passAnalysis, setPassAnalysis] = useState({});
  const [resetFilter, setResetFilter] = useState(false);
  const [passList, setPassList] = useState([])
  const [date, setDate] = useState({});


  useEffect(() => {
    if (hasAccess(accessKeys?.totalPassDetails)) {
      getPassAnalysis();
    }
  }, [])

  useEffect(() => {
    if (hasAccess(accessKeys?.getAllPass)) {
      getAllPass();
    }
    return (() => {
      setPassAnalysis({});
      filter = null;
    });
  }, [date]);

  let postData = {
    "startDate": dateReturn(date?.startDate, "yyyy-mm-dd"),
    "endDate": dateReturn(date?.endDate, "yyyy-mm-dd")
  }
  function onDateChange(p) {
    let newDate = { startDate: p.startDate._d, endDate: p.endDate._d }
    setDate(newDate);
    return;
  }

  async function getPassAnalysis() {
    loadingShow();
    let resp = await getApi(urlApi.passAnalysis);
    loadingHide();
    if (resp.responseCode === 200) {
      setPassAnalysis(resp?.data);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function getAllPass() {
    loadingShow();
    let resp;
    let url = urlApi.getallPass;
    if (filter) {
      url = url + "?filterByIsActive=" + filter;
    }
    if (date?.startDate && date?.endDate) {
      resp = await postApi(url, postData);
    } else {
      resp = await postApi(url, {});
    }
    loadingHide();
    if (resp.responseCode === 200) {
      setPassList(resp?.data?.value);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  function statusDropDown(event) {
    if (event === "Active") {
      filter = "true";
    } if (event === "Inactive") {
      filter = "false";
    } if (event === "All") {
      filter = null;
    }
    getAllPass();
    setResetFilter(false);
    return;
  }
  function resetFilters() {
    setResetFilter(true);
    setDate({});
    getAllPass();
    filter = null;
    return;
  }
  return (
    <Layout>
      {hasAccess(accessKeys?.totalPassDetails) && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2" >
        <SectionInfoCard cardTitle={"Total Pass"} prefixNumber={passAnalysis?.totalPassCount || 0} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />
        <SectionInfoCard cardTitle={"New Pass"} prefixNumber={passAnalysis?.newPassCount || 0} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/newPassIcon.svg"} />
        <SectionInfoCard cardTitle={"Total Pass Assign"} prefixNumber={passAnalysis?.totalPassPurchasedCount || 0} suffixNumber={passAnalysis?.totalPassPurchasedAmount || 0} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />
        <SectionInfoCard cardTitle={"Today Pass Assign"} prefixNumber={passAnalysis?.todayPassPurchasedCount || 0} suffixNumber={passAnalysis?.totalPassPurchasedAmount || 0} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/todayPassAssign.svg"} />
      </div>}

      <div className='h-auto w-full bg-white-color rounded-2xl mt-3 p-3 flex flex-wrap shadow-sm justify-between items-center'>
        {hasAccess(accessKeys?.addPass) && <div className='font-semibold text-base sm:w-auto  order-[1]'>
          <AddPassModal callback={() => getAllPass()} />
        </div>}
        <div className='search-container mt-2 sm:mt-2 md:m-0 xl:m-0 w-full sm:w-full md:w-1/2 order-[3] sm:order-[2]'>
        </div>
        {hasAccess(accessKeys?.getAllPass) && <div className='flex  items-center gap-[40px] order-[2] sm:order-[3]'>
          <DateRange onApplyClick={(p) => onDateChange(p)} startDate={date?.startDate} endDate={date?.endDate} />
          <div className='flex filter-container items-center mb-[10px] gap-3 order-[2] sm:order-[3]'>
            <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
              options={["All", "Active", "Inactive", "Most Added", "New", "Old", "Most Test", "Least Test"]}
              defaultOption={"Filter"} reset={resetFilter} />
            <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
          </div>
        </div>}
      </div>
      {passList?.length ? <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 p-2'>
        {
          passList && passList?.map((item, index) => {
            return (
              <ExamPassCards key={index} item={item} callback={() => getAllPass()} />
            )
          })
        }
      </div> :
        <div className='flex justify-center items-center mt-5'>
          <p className='text-primary-red'>No Data Found !!</p>
        </div>
      }
    </Layout>
  )
}

export default ExamPass