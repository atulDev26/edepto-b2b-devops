import { IconDots } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import AddBanner from '../../Components/Banner&Pop/AddBanner'
import AddPopup from '../../Components/Banner&Pop/AddPopup'
import Banner from '../../Components/Banner&Pop/Banner'
import Popup from '../../Components/Banner&Pop/Popup'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import Layout from '../../Layout/Layout'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { toast } from 'sonner'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import _ from "lodash"


const BannerPop = () => {
    const [bannerFilter, setBannerFilter] = useState(null);
    const [popUpFilter, setPopUpFilter] = useState(null);
    const [resetFilter, setResetFilter] = useState(false);
    const [itemPerPage] = useState(5);
    const [currentPageBanner, setCurrentPageBanner] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [bannerData, setBannerData] = useState({ data: [], count: 0 });
    const [popUpData, setPopUpData] = useState({ data: [], count: 0 });
    const [searchBanner, setSearchBanner] = useState(null);
    const [searchPopup, setSearchPopup] = useState(null);
    const [key, setKey] = useState(hasAccess(accessKeys?.getBanners) ? 'Banners' : 'Popups');

    useEffect(() => {
        if (key === 'Popups' && hasAccess(accessKeys?.getPopups)) {
            getPopUps();
        }
    }, [key, currentPage, popUpFilter, resetFilter, searchPopup]);

    useEffect(() => {
        if (key === 'Banners' && hasAccess(accessKeys?.getBanners)) {
            getBanners();
        }
    }, [key, currentPageBanner, bannerFilter, resetFilter, searchBanner]);

    const onPageChangeBanner = (page) => setCurrentPageBanner(page);
    const onPageChangePopup = (page) => setCurrentPage(page);

    const resetFilters = () => {
        setCurrentPage(1);
        setResetFilter(true)
        setBannerFilter(null);
        setPopUpFilter(null);
        // document.getElementById("bannerPopUp-search-field").value = null;
    };

    const fetchData = async (url, filter, search, setData) => {
        loadingShow();
        let filterUrl = url;
        if (filter) {
            filterUrl = `${filterUrl}&sort=${filter}`;
        }
        if (search) {
            filterUrl = `${filterUrl}&search=${search}`;
        }
        const resp = await getApi(filterUrl);
        loadingHide();
        if (resp.responseCode === 200) {
            setData({
                data: resp.data?.value,
                count: resp.data?.count
            });
        } else {
            toast.error(resp.message);
        }
    };

    const getBanners = () => fetchData(`${urlApi.getBanner}?page=${currentPageBanner}&limit=${itemPerPage}`, bannerFilter, searchBanner, setBannerData);

    const getPopUps = () => fetchData(`${urlApi.getPopup}?page=${currentPage}&limit=${itemPerPage}`, popUpFilter, searchPopup, setPopUpData);

    function bannerDropDown(event) {
        if (event === "All") {
            setBannerFilter(null);
        } if (event === "CreatedAt,DESC") {
            setBannerFilter("createdAt,DESC");
        } if (event === "CreatedAt,ASC") {
            setBannerFilter("createdAt,ASC");
        } if (event === "Order,DESC") {
            setBannerFilter("order,DESC");
        } if (event === "Order,ASC") {
            setBannerFilter("order,ASC");
        }
        setResetFilter(false);
        return;
    }

    function popUpDropDown(event) {
        if (event === "All") {
            setPopUpFilter(null);
        } if (event === "CreatedAt,DESC") {
            setPopUpFilter("createdAt,DESC");
        } if (event === "CreatedAt,ASC") {
            setPopUpFilter("createdAt,ASC");
        }
        setResetFilter(false);
        return;
    }

    return (
        <Layout>
            <div className='h-auto w-full bg-white-color rounded-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
                <div className='flex gap-2 items-center font-semibold text-base sm:w-auto order-[1]'>
                    {(key === "Banners" && hasAccess(accessKeys?.addBanner)) && <AddBanner callback={() => getBanners()} />}
                    {(key === "Popups" && hasAccess(accessKeys?.addPopup)) && <AddPopup callback={() => getPopUps()} />}
                </div>
                <div className='flex filter-container items-center mb-[10px] gap-3 order-[2] sm:order-[3]'>
                    {key === "Banners" && <SingleDropDownFilter onclick={(e) => { bannerDropDown(e) }}
                        options={["All", "CreatedAt,DESC", "CreatedAt,ASC", "Order,DESC", "Order,ASC"]}
                        defaultOption={"Filter"} reset={resetFilter} />}
                    {key === "Popups" && <SingleDropDownFilter onclick={(e) => { popUpDropDown(e) }}
                        options={["All", "CreatedAt,DESC", "CreatedAt,ASC"]}
                        defaultOption={"Filter"} reset={resetFilter} />}
                    <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
                </div>
            </div>

            <div className='h-auto mt-4 w-full bg-white-color rounded-tl-3xl rounded-tr-3xl p-3 flex flex-wrap shadow-sm justify-between items-center '>
                <div className='font-semibold text-base sm:w-auto order-[1]'>
                    Banner & Popup
                </div>
                <div className='flex filter-container items-center gap-3 order-[2] sm:order-[3]'>
                    {/* <IconDots size={24} /> */}
                </div>
            </div>
            <div className='w-full border' />
            <div className='p-2 bg-white-color'>
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => {
                        setKey(k);
                        setCurrentPage(1);
                        setPopUpFilter(null);
                        setBannerFilter(null);
                        setSearchPopup(null);
                        setSearchBanner(null);
                    }}
                    className="mb-3"
                >
                    {hasAccess(accessKeys?.getBanners) &&
                        <Tab eventKey="Banners" title="Banners">
                            <Banner
                                bannerData={bannerData}
                                currentPage={currentPageBanner}
                                itemPerPage={itemPerPage}
                                onPageChange={onPageChangeBanner}
                                callback={getBanners}
                            />
                        </Tab>}
                    {hasAccess(accessKeys?.getPopups) &&
                        <Tab eventKey="Popups" title="Popups">
                            <Popup
                                popUpData={popUpData}
                                currentPage={currentPage}
                                itemPerPage={itemPerPage}
                                onPageChange={onPageChangePopup}
                                callback={getPopUps}
                            />
                        </Tab>}
                </Tabs>
            </div>
        </Layout>
    )
}

export default BannerPop