import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import SectionInfoCard from '../../Components/SectionInfoCard/SectionInfoCard';
import AddSection from '../../Components/Test&CategoryComponents/TestSection/AddSection';
import SectionCard from '../../Components/Test&CategoryComponents/TestSection/SectionCard';
import SectionCardInfo from '../../Components/Test&CategoryComponents/TestSection/SectionCardInfo';
import Layout from '../../Layout/Layout';
import { getApi } from '../../api/callApi';
import { urlApi } from '../../api/urlApi';
import { loadingHide, loadingShow } from '../../utils/gloabalLoading';
import { hasAccess } from '../../utils/StaticData/accessList';
import { accessKeys } from '../../utils/accessKeys.utils';

const AddTestSection = () => {
    const { state } = useLocation();
    const { categoryId, subCategoryId } = useParams();
    const [testSection, setTestSection] = useState({});
    const [subSectionDetails, setSubSectionDetails] = useState({});

    useEffect(() => {
        if (hasAccess(accessKeys?.getSections)) {
            getTestSection();
        }
        if (hasAccess(accessKeys?.getSubCategoryById)) {
            getSubCategoryinfo();
        }
    }, []);


    async function getTestSection() {
        loadingShow();
        let resp = await getApi(urlApi.getTestSection + categoryId + "/" + subCategoryId);
        loadingHide();
        if (resp.responseCode === 200) {
            setTestSection(resp.data);
        } else {
            toast.error(resp.message);
        }
        return;
    }

    async function getSubCategoryinfo() {
        loadingShow();
        let resp = await getApi(urlApi.getSubSectionDetails + categoryId + "/" + subCategoryId);
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
            {hasAccess(accessKeys?.getCategoryCards) && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 mb-3">
                <SectionInfoCard cardTitle={"No. of Categories"} prefixNumber={state?.categoryCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />

                <SectionInfoCard cardTitle={"Total Tests"} prefixNumber={state?.totalTests} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />

                <SectionInfoCard cardTitle={"Total Question"} prefixNumber={state?.totalQuestions} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />

                <SectionInfoCard cardTitle={"Today Tests"} prefixNumber={state?.todayTestCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />

                <SectionInfoCard cardTitle={"Todays Questions"} prefixNumber={state?.todayQuestionCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/todayPassAssign.svg"} />
            </div>}

            <div className='h-auto w-full bg-white-color rounded-2xl mt-3 p-3 flex flex-wrap shadow-sm justify-between items-center'>
                {hasAccess(accessKeys?.addSection) && <div className='font-semibold text-base sm:w-auto order-[1]'>
                    <AddSection categoryIdPlusSubCategoryId={categoryId + "/" + subCategoryId} callback={() => getTestSection()} />
                </div>}
            </div>
            <div className='bg-white-color h-auto w-full mt-3 rounded-2xl p-3'>
                {hasAccess(accessKeys?.getSubCategoryById) && <SectionCardInfo details={subSectionDetails?.subCategory} />}
                <div className='border border-b-slate-300 mb-3' />

                {
                    testSection?.sections?.length > 0 ?
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 '>
                            {
                                testSection?.sections?.map((item, index) => {
                                    return (
                                        <SectionCard key={index} name={item?.sections?.name} testCount={item?.sections?.testCount} orderby={item?.sections?.orderBy} sectionId={item?.sections?._id}
                                            shortName={item?.sections?.shortName}
                                            categoryIdPlusSubCategoryId={categoryId + "/" + subCategoryId} state={state} callback={() => getTestSection()}
                                            isEdit={true}
                                        />
                                    )
                                })
                            }
                        </div> : <p className='w-full py-6 text-center text-primary-red font-semibold text-sm'>No Data Found !!</p>
                }
            </div>
        </Layout>
    )
}

export default AddTestSection  