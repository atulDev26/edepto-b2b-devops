import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../Layout/Layout'
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import { toast } from 'sonner';
import { urlApi } from '../../../api/urlApi';
import { getApi } from '../../../api/callApi';
import SearchInputField from '../../../Components/SearchInputField/SearchInputField';
import SingleDropDownFilter from '../../../Components/DropDown/SingleDropDownFilter';
import ResetFilter from '../../../Components/DropDown/ResetFilter';
import Table from '../../../Components/DataTable/Table';
import Pagination from '../../../Components/Pagination/Pagination';
import PopOver from '../../../Components/PopOver/PopOver';
import { calculateSerialNumber } from '../../../utils/commonFunction/serialNumber';
import { Link } from 'react-router-dom';
import _ from "lodash"

const EdeptoTestSeries = () => {
    const [itemPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState(null);
    const [search, setSearch] = useState(null);
    const [sort, setSort] = useState(null);
    const [tableData, setTableData] = useState({
        data: [],
        count: 0,
    })

    const [resetFilter, setResetFilter] = useState(false);

    useEffect(() => {
        getTestSubCategory();
    }, [currentPage, filter, search, sort])

    async function getTestSubCategory() {
        loadingShow();
        let url = urlApi.getTestSeries + "?page=" + currentPage + "&limit=" + itemPerPage;
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
        console.log(resp);
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
                selector: row => row?.subCategoryName,
                width: "200px",
                grow: 1.5,
                cell: row => (
                    //  <Link to={{ pathname: "/test-&-categories/add-test-section/" + categoryId + "/" + row?.subCategory?._id }} state={state}>
                    <div className='flex items-center gap-2 p-[10px]' >
                        <img className='min-w-[40px] w-[40px] h-[40px] rounded-full' src={row?.icon} alt='sc' onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = process.env.PUBLIC_URL + "/Assets/Images/edeptoicon.svg";
                        }} />
                        <p className=''>{row?.subCategoryName}</p>
                    </div>
                    //   </Link> 
                )
            },
            {
                name:
                    <div className='font-semibold'>
                        Test Count
                    </div>,
                grow: 1,
                center: true,
                selector: row => row?.freeTestCount || 0 + row?.paidTestCount || 0,
                cell: row => row?.freeTestCount || 0 + row?.paidTestCount || 0,
            },
            {
                name:
                    <div className='font-semibold'>
                        Language
                    </div>,
                center: true,
                selector: row => <PopOver data={row?.languages} />,
                cell: row => <PopOver data={row?.languages} />
            },
            {
                name:
                    <div className='font-semibold'>
                        Status
                    </div>,
                center: true,
                cell: row =>
                    <div className={`w-[70px] ${row?.status === true ? "bg-primary-blue" : "bg-primary-red"} rounded-xl flex justify-center p-2 text-white-color font-normal cursor-default`}>
                        {
                            row?.status === true ? <p>Active</p> : <p>Inactive</p>
                        }
                    </div>,
            },
            {
                name:
                    <div className='font-semibold'>
                        Action
                    </div>,
                center: true,
                cell: row =>
                    <div className='flex items-center gap-2 cursor-pointer'>
                        <Link to={"/test-&-categories/edepto-test-section/" + row?._id}>
                            <i className="fa fa-eye fa-lg text-primary-blue cursor-pointer" aria-hidden="true" ></i>
                        </Link>
                    </div>,
            }
        ])
    }, [tableData]);


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
            <div className="flex items-start">
                <div className='w-full ease-in duration-200'>
                    <div className='h-auto w-full bg-white-color rounded-2xl p-3 flex flex-wrap justify-between items-center gap-2'>
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

export default EdeptoTestSeries