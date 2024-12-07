import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import SectionInfoCard from '../../Components/SectionInfoCard/SectionInfoCard'
import AddCategoryModal from '../../Components/Test&CategoryComponents/AddCategoryModal'
import CategoryCards from '../../Components/Test&CategoryComponents/CategoryCards'
import Layout from '../../Layout/Layout'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import _ from "lodash"
import Pagination from '../../Components/Pagination/Pagination'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs'
import { Link } from 'react-router-dom'

const TestCategory = () => {
  const [itemPerPage] = useState(18);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsDetails, setCardDetails] = useState({});
  const [search, setSearch] = useState(null);
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState(null);
  const [category, setCategory] = useState({
    data: [],
    count: 0,
  });
  const [resetFilter, setResetFilter] = useState(false);

  useEffect(() => {
    if (hasAccess(accessKeys?.getCategories)) {
      getCategory();
    }
    if (hasAccess(accessKeys?.getCategoryCards)) {
      categoryCardsDetails();
    }
  }, [currentPage, sort, filter, search, resetFilter])

  async function getCategory() {
    loadingShow();
    let url = urlApi.getCategory + "?page=" + currentPage + "&limit=" + itemPerPage;
    if (search) {
      url = url + "&search=" + search;
    }
    if (filter) {
      url = url + "&filter=" + filter;
    } if (sort) {
      url = url + "&sort=" + sort;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp && resp.responseCode === 200) {
      setCategory({
        data: resp?.data?.value,
        count: resp.data?.count,
      });
    } else {
      toast.error(resp?.message);
    }
    return;
  }

  async function categoryCardsDetails() {
    loadingShow();
    let url = urlApi.categoryCards;
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setCardDetails(resp.data);
    } else {
      toast.error(resp.message);
    }
    return;
  }

  function statusDropDown(event) {
    if (event === "All") {
      setFilter(null);
      setSort(null);
    } else if (event === "Order ASC") {
      setSort("orderBy,ASC");
      setFilter(null);
    } else if (event === "Order DESC") {
      setSort("orderBy,DESC");
      setFilter(null);
    } else if (event === "New Category") {
      setSort("_id,DESC");
      setFilter(null);
    } else if (event === "Old Category") {
      setSort("_id,ASC");
      setFilter(null);
    } else if (event === "Active") {
      setSort(null);
      setFilter(1);
    } else if (event === "Inactive") {
      setSort(null);
      setFilter(2);;
    }
    // getCategory();
    setCurrentPage(1);
    setResetFilter(false);
    return;
  }

  function resetFilters() {
    setResetFilter(true);
    setSearch(null);
    setCurrentPage(1);
    setSort(null);
    setFilter(null);
    document.getElementById("category-search-field").value = "";
    return;
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  function onSearch(searchData) {
    if (searchData.length === 0) {
      setSearch(null);
      setCurrentPage(1);
      return;
    }
    if (searchData) {
      setCurrentPage(1);
      setSearch(searchData);
    } else {
      toast.error("Invalid Search!!!")
    }
    return;
  }

  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("category-search-field")?.value.trim()), 500);

  return (
    <Layout>
      {hasAccess(accessKeys?.getCategoryCards) && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 mb-3">
        <SectionInfoCard cardTitle={"No. of Categories"} prefixNumber={cardsDetails?.categoryCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />

        <SectionInfoCard cardTitle={"Total Tests"} prefixNumber={cardsDetails?.totalTests} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />

        <SectionInfoCard cardTitle={"Total Question"} prefixNumber={cardsDetails?.totalQuestions} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />

        <SectionInfoCard cardTitle={"Today Tests"} prefixNumber={cardsDetails?.todayTestCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />

        <SectionInfoCard cardTitle={"Today Questions"} prefixNumber={cardsDetails?.todayQuestionCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/todayPassAssign.svg"} />
      </div>}

      {hasAccess(accessKeys?.getCategories) && <div className='h-auto w-full bg-white-color rounded-2xl mt-3 p-3 flex flex-wrap shadow-sm justify-between items-center gap-2'>
        <div className='font-semibold text-base sm:w-auto  order-[1]'>
          {hasAccess(accessKeys?.addCategory) && <AddCategoryModal callback={() => getCategory()} />}
        </div>
        <div className='search-container w-full sm:w-full md:w-1/2 lg:w-1/2 my-2 order-[3] sm:order-[2]'>
          <SearchInputField width={"100%"} bgColor={"#ffffff"} onChange={(e) => functionDebounce(e)} inputId={"category-search-field"} onClick={() => onSearch(document.getElementById("category-search-field")?.value.trim())} />
        </div>
        <div className='flex min-w-[190px] justify-start sm:justify-start md:justify-start lg:justify-center filter-container items-center gap-3 order-[2] sm:order-[3]'>
          <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
            options={["All", "Order ASC", "Order DESC", "New Category", "Old Category", "Active", "Inactive"]}
            defaultOption={"Filter"} reset={resetFilter} />
          <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
        </div>
      </div>}
      <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 p-2'>
        {category?.data?.length ?
          <>
            {
              category?.data?.map((item, index) => {
                return (
                  <div key={index}>
                    <CategoryCards data={item?.category} callback={() => { getCategory(); categoryCardsDetails() }} cardDetails={cardsDetails} />
                  </div>
                )
              })
            }
          </> : <p className='text-red-400 flex justify-center items-center mt-4'>No Category Found</p>}
        <div className={`w-full shadow-sm rounded-xl p-[10px] hover:bg-slate-200 bg-[#e2e6ec]`}>
          <div className="grid grid-cols-2 justify-between items-center">
            <p className="flex gap-2 items-center">
              Order:{""}
              <span className="flex justify-center items-center w-[33px] h-[21px] bg-primary-green rounded-full text-white-color font-semibold text-xs">
                {0}
              </span>
            </p>
          </div>
          <Link to={"edepto-test-subcategory"}>
            <div className="mt-2 bg-[#F3F8FF] p-2 rounded-md">
              <img className="h-[85px] min-w-full object-contain rounded-xl" src={process.env.PUBLIC_URL + "/Assets/Images/edepto.svg"} alt="text" />
            </div>
            <p className="font-bold text-base text-center p-2">{"Edepto Test Series"}</p>
          </Link>
        </div>
      </div>
      <Pagination onPageChanges={onPageChange} totalItems={category?.count}
        itemPerPage={itemPerPage} currentPage={currentPage} />
    </Layout>
  )
}

export default TestCategory