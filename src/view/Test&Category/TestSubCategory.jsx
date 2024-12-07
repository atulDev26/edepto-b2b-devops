import _ from "lodash"
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Table from '../../Components/DataTable/Table'
import DeleteConformationModal from '../../Components/DeleteConformationModal/DeleteConformationModal'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import Pagination from '../../Components/Pagination/Pagination'
import PopOver from '../../Components/PopOver/PopOver'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import CreateSubCategoryModal from '../../Components/Test&CategoryComponents/TestSubCategoryComponents/CreateSubCategoryModal'
import EditSubCategoryModal from '../../Components/Test&CategoryComponents/TestSubCategoryComponents/EditSubCategoryModal'
import Layout from '../../Layout/Layout'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { hasAccess } from "../../utils/StaticData/accessList"
import { accessKeys } from "../../utils/accessKeys.utils"
import SectionInfoCard from "../../Components/SectionInfoCard/SectionInfoCard"



const TestSubCategory = () => {
  const { state } = useLocation();
  const { categoryId } = useParams();
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState(null);
  const [sort, setSort] = useState(null)
  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState({
    data: [],
    count: 0,
  })
  const [resetFilter, setResetFilter] = useState(false);
  const [accesses] = useState({
    add: hasAccess(accessKeys?.addSubCategory),
    edit: hasAccess(accessKeys?.editSubCategory),
    delete: hasAccess(accessKeys?.deleteSubCategory),
    getById: hasAccess(accessKeys?.getSubCategoryById),
  });

  useEffect(() => {
    if (hasAccess(accessKeys?.getSubCategories)) {
      getTestSubCategory();
    }

  }, [currentPage, filter, search, sort])

  async function getTestSubCategory() {
    loadingShow();
    let url = urlApi.getSubCategory + categoryId + "?page=" + currentPage + "&limit=" + itemPerPage;
    if (search) {
      url = url + "&search=" + search;
    }
    if (filter) {
      url = url + "&filter=" + filter;
    }
    if (sort) {
      url = url + "&sort=" + sort;
    }
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setTableData({
        data: resp?.data?.value,
        count: resp?.data?.count,
      })
    } else {
      toast.error(resp.message);
    }
    return;
  }

  async function handleDeleteSubCategory(subCategoryId) {
    loadingShow();
    let resp = await getApi(urlApi.deleteSubCategory + categoryId + '/' + subCategoryId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      getTestSubCategory();
    } else {
      toast.error(resp.message);
    }
    return;
  }

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  function statusDropDown(event) {
    if (event === "All") {
      setFilter(null)
      setSort(null);
    } if (event === "Most Test") {
      setSort("testCount,DESC");
      setFilter(null)
    } if (event === "Least Test") {
      setSort("testCount,ASC");
      setFilter(null)
    } if (event === "New SubCategory") {
      setSort("_id,DESC");
      setFilter(null)
    } if (event === "Old SubCategory") {
      setSort("_id,ASC");
      setFilter(null)
    } if (event === "Active") {
      setSort(null);
      setFilter(1)
    } if (event === "Inactive") {
      setSort(null);
      setFilter(2)
    }
    getTestSubCategory();
    setResetFilter(false);
    return;
  }

  function resetFilters() {
    setResetFilter(true);
    setSearch(null);
    setCurrentPage(1);
    setFilter(null);
    document.getElementById("subcategory-search-field").value = "";
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
            Sub Category
          </div>,
        selector: row => row?.subCategory?.subCategoryName,
        width: "200px",
        grow: 1.5,
        cell: row => (
          hasAccess(accessKeys?.getSubCategoryById) ? <Link to={{ pathname: "/test-&-categories/add-test-section/" + categoryId + "/" + row?.subCategory?._id }} state={state}>
            <div className='flex items-center gap-2 p-[10px]' >
              <img className='min-w-[40px] w-[40px] h-[40px] rounded-full' src={row?.subCategory?.icon} alt='sc' onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
              }} />
              <p className=''>{row?.subCategory?.subCategoryName}</p>
            </div>
          </Link> :
            <div className='flex items-center gap-2 p-[10px]' >
              <img className='min-w-[40px] w-[40px] h-[40px] rounded-full' src={row?.subCategory?.icon} alt='sc' onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
              }} />
              <p className=''>{row?.subCategory?.subCategoryName}</p>
            </div>
        )
      },
      {
        name:
          <div className='font-semibold'>
            Test Count
          </div>,
        grow: 1,
        center: true,
        selector: row => row?.subCategory?.testCount,
        cell: row => row?.subCategory?.testCount,
      },
      {
        name:
          <div className='font-semibold'>
            Language
          </div>,
        center: true,
        selector: row => <PopOver data={row?.subCategory?.languages} />,
        cell: row => <PopOver data={row?.subCategory?.languages} />
      },
      {
        name:
          <div className='font-semibold'>
            Status
          </div>,
        center: true,
        cell: row =>
          <div className={`w-[70px] ${row?.subCategory?.status === true ? "bg-primary-blue" : "bg-primary-red"} rounded-xl flex justify-center p-2 text-white-color font-normal cursor-default`}>
            {
              row?.subCategory?.status === true ? <p>Active</p> : <p>Inactive</p>
            }
          </div>,
      },
      {
        name:
          <div className='font-semibold'>
            Action
          </div>,
        center: true,
        omit: !(accesses?.edit || accesses?.delete || accesses?.getById),
        cell: row =>
          <div className='flex items-center gap-2 cursor-pointer'>
            {hasAccess(accessKeys?.editSubCategory) && <EditSubCategoryModal categoryId={categoryId} data={row?.subCategory} callback={() => getTestSubCategory()} />}
            {hasAccess(accessKeys?.getSubCategoryById) && <Link to={"/test-&-categories/add-test-section/" + categoryId + "/" + row?.subCategory?._id}>
              <i className="fa fa-eye fa-lg text-primary-blue cursor-pointer" aria-hidden="true" ></i>
            </Link>}
            {hasAccess(accessKeys?.deleteSubCategory) && <DeleteConformationModal onclick={() => { handleDeleteSubCategory(row?.subCategory?._id); getTestSubCategory() }} content={<p>Are you Sure You Want to Delete ?</p>} heading={"Warning !!!"} />}
          </div>,
      }
    ])
  }, [tableData, accesses]);

  function onSearch(searchData) {
    if (searchData.length === 0) {
      setSearch(null);
      setCurrentPage(1);
      getTestSubCategory();
      return;
    }
    if (searchData) {
      setCurrentPage(1);
      setSearch(searchData);
      getTestSubCategory();
    } else {
      toast.error("Invalid Search!!!")
    }
    return;
  }

  const functionDebounce = _.debounce((e) => onSearch(document.getElementById("subcategory-search-field")?.value.trim()), 500);

  return (
    <Layout>
      {hasAccess(accessKeys?.getCategoryCards) && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 mb-3">
        <SectionInfoCard cardTitle={"No. of Categories"} prefixNumber={state?.categoryCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />

        <SectionInfoCard cardTitle={"Total Tests"} prefixNumber={state?.totalTests} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />

        <SectionInfoCard cardTitle={"Total Question"} prefixNumber={state?.totalQuestions} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />

        <SectionInfoCard cardTitle={"Today Tests"} prefixNumber={state?.todayTestCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />

        <SectionInfoCard cardTitle={"Today Questions"} prefixNumber={state?.todayQuestionCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/todayPassAssign.svg"} />
      </div>}
      <div className="flex items-start">
        <div className='w-full ease-in duration-200'>
          <div className='h-auto w-full bg-white-color rounded-2xl p-3 flex flex-wrap justify-between items-center gap-2'>
            {hasAccess(accessKeys?.addSubCategory) && <div className='font-semibold flex flex-col sm:flex-col md:flex-row gap-3 text-base sm:w-auto order-[1]'>
              <CreateSubCategoryModal categoryId={categoryId} callback={() => getTestSubCategory()} />
            </div>}
            {hasAccess(accessKeys?.getSubCategories) &&
              <>
                <div className='search-container w-full sm:w-full md:w-1/2 order-[3] sm:order-[2]'>
                  <SearchInputField width={"100%"} bgColor={"#ffffff"} onChange={(e) => functionDebounce(e)} inputId={"subcategory-search-field"} onClick={() => onSearch(document.getElementById("subcategory-search-field")?.value.trim())} />
                </div>
                <div className='flex min-w-[230px] justify-center sm:justify-start sm:min-w-[0px] filter-container items-center gap-3 order-[2] sm:order-[3]'>
                  <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
                    options={["All", "Most Test", "Least Test", "New SubCategory", "Old SubCategory", "Active", "Inactive"]}
                    defaultOption={"Filter"} reset={resetFilter} />
                  <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
                </div>
              </>
            }
          </div>
        </div>
      </div>
      <div className="flex items-start mt-4">
        <div className='w-full ease-in duration-200'>
          <div className='h-auto w-full bg-white-color rounded-t-2xl p-3 flex flex-wrap justify-between items-center'>
            <div className='font-semibold flex flex-col sm:flex-col md:flex-row gap-3 text-base sm:w-auto order-[1]'>
              Sub Categories Listing
            </div>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        data={tableData?.data}
        customPagination={<Pagination />}
      />
      <div className='shadow-md w-full ease-in duration-200'>
        <Pagination onPageChanges={onPageChange}
          totalItems={tableData?.count}
          itemPerPage={itemPerPage}
          currentPage={currentPage}
        />
      </div>
    </Layout>
  )
}

export default TestSubCategory