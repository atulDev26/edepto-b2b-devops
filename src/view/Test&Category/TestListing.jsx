import _ from "lodash"
import React, { useEffect, useMemo, useState } from 'react'
import { Badge, Tab, Tabs } from 'react-bootstrap'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Table from '../../Components/DataTable/Table'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import Pagination from '../../Components/Pagination/Pagination'
import PopOver from '../../Components/PopOver/PopOver'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import SectionInfoCard from '../../Components/SectionInfoCard/SectionInfoCard'
import AddSubSection from '../../Components/Test&CategoryComponents/TestListing/AddSubSection'
import AddTest from '../../Components/Test&CategoryComponents/TestListing/AddTest'
import EditStatus from '../../Components/Test&CategoryComponents/TestListing/EditStatus'
import EditSubSection from '../../Components/Test&CategoryComponents/TestListing/EditSubSection'
import EditTest from '../../Components/Test&CategoryComponents/TestListing/EditTest'
import Layout from '../../Layout/Layout'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import { dateTimeConverter, getSecondToHourMin } from '../../utils/commonFunction/dateTimeConverter'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import ViewExamCutOff from "../../Components/Test&CategoryComponents/TestListing/ViewExamCutOff"


const TestListing = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { categoryId, subCategoryId, sectionId } = useParams();
  const [resetFilter, setResetFilter] = useState(false);
  const [resetSort, setResetSort] = useState(false);
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("");
  const [subSectionListing, setSubSectionListing] = useState([]);
  const [sort, setSort] = useState(null);
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState(null);
  const [testList, setTestList] = useState({
    data: [],
    count: 0,
  });

  const [accesses] = useState({
    getGroup: hasAccess(accessKeys?.getSectionGroups)
  })

  let categoryIdPlusSubCategoryIdPluseSectionId = categoryId + "/" + subCategoryId + "/" + sectionId;

  useEffect(() => {
    if (hasAccess(accessKeys?.getSubSections)) {
      getSubSection();
    }
  }, [])

  useEffect(() => {
    if (hasAccess(accessKeys?.getTestsBySectionId)) {
      getTestList({ key: activeTab });
    }
  }, [currentPage, search, sort, filter, activeTab, resetFilter, resetSort]);


  function resetFilters() {
    setResetFilter(true);
    setResetSort(true);
    setFilter(null);
    setSearch(null);
    setActiveTab("");
    setSort(null);
    document.getElementById("testList-search-field").value = null;
    return;
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  async function getSubSection() {
    loadingShow();
    let resp = await getApi(urlApi.testListing + categoryIdPlusSubCategoryIdPluseSectionId);
    loadingHide();
    if (resp.responseCode === 200) {
      setSubSectionListing(resp?.data?.subSections);
    } else {
      toast.error(resp.message);
    }
  }

  async function getTestList({ key = null } = {}) {
    loadingShow();
    let url = urlApi.getTest + sectionId + "?page=" + currentPage + "&limit=" + itemPerPage;
    if (key) {
      url = url + "&filterBySubSection=" + key
    }
    if (search) {
      url = url + "&search=" + search;
    }
    if (sort) {
      url = url + "&sort=" + sort;
    }
    if (filter) {
      url = url + "&filterByIsActive=" + filter;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setTestList({
        data: resp?.data?.value,
        count: resp?.data?.count,
      });
    } else {
      toast.error(resp.message);
      setTestList({
        data: resp?.data?.value,
        count: resp?.data?.count,
      });
    }
    return;
  }

  function handleClick(dataForShare) {
    localStorage.setItem("question-language", JSON.stringify(dataForShare?.languages));
    navigate(("/test-&-categories/question-and-solution/" + dataForShare?._id), { state: state });
    return;
  };


  function handleSectionGroup(sectionGroup) {
    navigate("/test-&-categories/section-group/" + sectionGroup?._id, { state: { sections: sectionGroup?.sections } });
  };

  function statusDropDown(event) {
    if (event === "All") {
      setFilter(null);
    }
    if (event === "Active") {
      setFilter(1);
    } if (event === "Inactive") {
      setFilter("0");
    } if (event === "Future") {
      setFilter(2);
    }
    setResetFilter(false);
    return;
  }

  function sortDropDown(event) {
    if (event === "All") {
      setSort(null)
    } if (event === "TotalMarks ASC") {
      setSort("totalMarks,ASC");
    } if (event === "TotalMarks DESC") {
      setSort("totalMarks,DESC");
    } if (event === "Duration ASC") {
      setSort("duration,ASC");
    } if (event === "Duration DESC") {
      setSort("duration,DESC");
    } if (event === "CreatedAt ASC") {
      setSort("createdAt,ASC");
    } if (event === "CreatedAt DESC") {
      setSort("createdAt,DESC");
    } if (event === "AvailableIn ASC") {
      setSort("availableIn,ASC");
    } if (event === "AvailableIn DESC") {
      setSort("availableIn,DESC");
    }
    setResetSort(false);
    return;
  }

  const columns = useMemo(() => {
    return ([
      {
        name:
          <div className='font-semibold'>
            SL No
          </div>,
        center: true,
        grow: 0.2,
        cell: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage),
      },
      {
        name:
          <div className='font-semibold'>
            Test Name
          </div>,
        cell: row => <div className='text-primary-blue cursor-pointer' onClick={() => handleClick(row)}>{row?.testName}</div>
      },
      {
        name:
          <div className='font-semibold'>
            Total Marks
          </div>,
        width: "100px",
        cell: row => row?.totalMarks
      },
      {
        name:
          <div className='font-semibold'>
            Total Time
            (hh/mm)
          </div>,
        width: "100px",
        cell: row => getSecondToHourMin(row?.duration)
      },
      {
        name:
          <div className='font-semibold'>
            Language
          </div>,
        center: true,
        cell: row => <PopOver data={row?.languages} />
      },
      {
        name:
          <div className='font-semibold'>
            Status
          </div>,
        cell: row => <div className='flex gap-2'>
          <div>
            {
              row?.isActive === 0 ? <Badge bg='danger'>Inactive</Badge> : row?.isActive === 1 ? <Badge bg='info'>Active</Badge> : <Badge bg='secondary'>Future</Badge>
            }
          </div>
          {hasAccess(accessKeys?.updateTestStatus) && <div>
            <EditStatus data={row} callback={() => getTestList({ key: activeTab })} />
          </div>}
        </div>
      },
      {
        name: "Time",
        cell: (row) => (
          <div className='py-2 flex flex-col gap-2'>
            <p className="m-0" style={{ fontWeight: "600" }}>Created At:&nbsp;<span style={{ fontWeight: "500" }}>{dateTimeConverter(row.createdAt || "---")}</span></p>
            <p className="m-0" style={{ fontWeight: "600" }}>Updated At:&nbsp;<span style={{ fontWeight: "500" }}>{dateTimeConverter(row.updatedAt || "---")}</span></p>
            {row.availableIn && <p className="m-0" style={{ fontWeight: "600" }}>Available In:&nbsp;<span style={{ fontWeight: "500" }}>{row.availableIn || "---"}</span></p>}
          </div>
        )
      },
      {
        name: "Action",
        cell: (row) => (
          <div className="flex gap-2 items-center flex-wrap">
            {hasAccess(accessKeys?.updateTest) && <EditTest testData={row} callback={() => getTestList({ key: activeTab })} />}
            {hasAccess(accessKeys?.getTestById) && <i className="fa fa-eye fa-lg text-table-buttons-color cursor-pointer" aria-hidden="true"
              onClick={() => handleClick(row)}></i>}
          </div>
        )
      },
      {
        name: "Exam Cutoff",
        center: true,
        width: '140px',
        cell: row => (
          <ViewExamCutOff data={row?.examCutOffs} ID={row?._id} callback={() => getTestList({ key: activeTab })} />
        )
      },
      {
        name: "Section Group",
        omit: !accesses?.getGroup,
        cell: row => (
          <>
            {accesses?.getGroup && <button className="bg-inherit text-primary-blue font-semibold py-2 shadow-xl px-2 rounded-xl flex-wrap "
              style={{
                border: '1px solid var(--primary-blue)'
              }} onClick={() => { handleSectionGroup(row) }}>Section Group</button>}
          </>

        )
      }
    ])
  }, [testList, accesses])

  function handleTabSelect(selectedTab) {
    setCurrentPage(1);
    setActiveTab(selectedTab);
    if (selectedTab == "") {
      setSearch(null);
      setSort(null);
      setFilter(null);
      document.getElementById("testList-search-field").value = null;
    } else {
      setSearch(null);
      setSort(null);
      setFilter(null);
      document.getElementById("testList-search-field").value = null;
    }
    return;
  };

  function onSearch(searchData) {
    if (searchData?.length === 0) {
      setSearch(null);
      setCurrentPage(1);
      return;
    }
    if (searchData) {
      setActiveTab("");
      setCurrentPage(1);
      setSearch(searchData);
    } else {
      toast.error("Invalid Search!!!")
    }
    return;

  }

  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("testList-search-field")?.value.trim()), 500);

  return (
    <Layout>
      {hasAccess(accessKeys?.getCategoryCards) && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 mb-3">
        <SectionInfoCard cardTitle={"No. of Categories"} prefixNumber={state?.categoryCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />

        <SectionInfoCard cardTitle={"Total Tests"} prefixNumber={state?.totalTests} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />

        <SectionInfoCard cardTitle={"Total Question"} prefixNumber={state?.totalQuestions} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />

        <SectionInfoCard cardTitle={"Today Tests"} prefixNumber={state?.todayTestCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />

        <SectionInfoCard cardTitle={"Today Questions"} prefixNumber={state?.todayQuestionCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/todayPassAssign.svg"} />
      </div>}

      <div className='h-auto w-full bg-white-color rounded-2xl mt-3 p-3 flex flex-wrap shadow-sm justify-between items-center'>
        {hasAccess(accessKeys?.addSubSection) && <div className='flex justify-center items-center gap-2 font-semibold text-base sm:w-auto order-[1] mb-2'>
          <AddSubSection callback={() => getSubSection()} categoryIdPlusSubCategoryIdPluseSectionIds={categoryIdPlusSubCategoryIdPluseSectionId} />
        </div>}
        <div className='search-container w-full sm:w-full md:w-[50%] order-[3] sm:order-[2] '>
          <SearchInputField width={"100%"} bgColor={"#ffffff"} inputId={"testList-search-field"} onClick={() => onSearch(document.getElementById("testList-search-field")?.value.trim())} onChange={(e) => functionDebounce(e)} />
        </div>
        <div className='flex filter-container items-center gap-3 order-[2] sm:order-[3]'>
          <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
        </div>
      </div>
      {/* <Breadcrumbs /> */}
      <div className='h-auto mt-4 w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
        <div className='font-semibold text-base sm:w-full order-[1] flex justify-between items-center gap-2'>
          Test Listing
          <div className='flex items-center gap-2'>
            <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
              options={["All", "Active", "Inactive", "Future"]}
              defaultOption={"Filter"} reset={resetFilter} />

            <SingleDropDownFilter onclick={(e) => { sortDropDown(e) }}
              options={["All", "TotalMarks ASC", "TotalMarks DESC", "Duration DESC", "Duration ASC", "CreatedAt ASC", "CreatedAt DESC", "AvailableIn ASC", "AvailableIn DESC"]}
              defaultOption={"SortBy"} reset={resetSort} />
          </div>
        </div>
      </div>
      <div className='w-full border' />
      <div className='p-2 bg-white-color '>
        {
          subSectionListing?.length != 0 &&
          <Tabs
            id=""
            activeKey={activeTab}
            onSelect={(k) => { handleTabSelect(k); setCurrentPage(1) }}
            className="mb-3"
          >
            <Tab eventKey="" title="All">
              <Table
                columns={columns}
                data={testList?.data}
              />
              <div className='shadow-md w-full ease-in duration-200'>
                <Pagination onPageChanges={onPageChange}
                  totalItems={testList?.count}
                  itemPerPage={itemPerPage}
                  currentPage={currentPage}
                />
              </div>
            </Tab>

            {
              subSectionListing?.map((item, index) => {
                return (
                  <Tab eventKey={item?.subSection?._id} title={item?.subSection?.name} key={item?.subSection?._id}>
                    <div className='flex gap-2 px-2 py-2 rounded-2xl'>
                      {hasAccess(accessKeys?.editSubSection) && <EditSubSection data={item} categoryId={categoryId} subCategoryId={subCategoryId} sectionIds={sectionId} subSectionId={activeTab} callback={() => getSubSection()} />}
                      {hasAccess(accessKeys?.addNewTest) && <AddTest categoryId={categoryId} subCategoryId={subCategoryId} sectionIds={sectionId} subSectionId={activeTab} callback={() => getTestList({ key: activeTab })} />}
                    </div>
                    <Table
                      columns={columns}
                      data={testList?.data}
                    />
                    <div className='shadow-md w-full ease-in duration-200'>
                      <Pagination onPageChanges={onPageChange}
                        totalItems={testList?.count}
                        itemPerPage={itemPerPage}
                        currentPage={currentPage} />
                    </div>
                  </Tab>
                )
              })
            }
          </Tabs>
        }
      </div>
    </Layout>
  )
}

export default TestListing