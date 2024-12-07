import React, { useEffect, useState } from 'react'
import Layout from '../../../Layout/Layout'
import SectionCardInfo from '../../../Components/Test&CategoryComponents/TestSection/SectionCardInfo'
import SectionCard from '../../../Components/Test&CategoryComponents/TestSection/SectionCard'
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading'
import { getApi } from '../../../api/callApi'
import { urlApi } from '../../../api/urlApi'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'

const EdeptoTestSection = () => {
    const { subCategoryId } = useParams();
    const [testSection, setTestSection] = useState([]);
    const [subSectionDetails, setSubSectionDetails] = useState({});


    useEffect(() => {
        getTestSection();
        getSubCategoryDetails();
    }, []);

    async function getTestSection() {
        loadingShow();
        let resp = await getApi(urlApi.getEdeptoTestSection + subCategoryId);
        console.log(resp);
        loadingHide();
        if (resp.responseCode === 200) {
            setTestSection(resp.data?.testSections);
        } else {
            toast.error(resp.message);
        }
        return;
    }

    async function getSubCategoryDetails() {
        loadingShow();
        let resp = await getApi(urlApi.subCategoryDetailsById + subCategoryId);
        console.log(resp);
        loadingHide();
        if (resp.responseCode === 200) {
            setSubSectionDetails(resp.data);
        } else {
            toast.error(resp.message);
        }
        return;
    }
    return (
        <Layout>
            <div className='bg-white-color h-auto w-full mt-3 rounded-2xl p-3'>
                <SectionCardInfo details={subSectionDetails} />
                <div className='border border-b-slate-300 mb-3' />
                {
                    testSection?.length > 0 ?
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 '>
                            {
                                testSection?.map((item, index) => {
                                    return (
                                        <SectionCard
                                            key={index} name={item?.name}
                                            testCount={item?.paidTestCount}
                                            orderby={item?.orderBy}
                                            sectionId={item?._id}
                                            shortName={item?.shortName}
                                            propLink={{ pathname: "/test-&-categories/edepto-test-listing/" + subCategoryId + "/" + item?._id }}
                                            isEdit={false}
                                            categoryIdPlusSubCategoryId={subCategoryId} callback={() => getTestSection()} />
                                    )
                                })
                            }
                        </div> : <p className='w-full py-6 text-center text-primary-red font-semibold text-sm'>No Data Found !!</p>
                }
            </div>
        </Layout>
    )
}

export default EdeptoTestSection