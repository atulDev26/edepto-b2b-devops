import { IconTrash } from '@tabler/icons-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import ConformationModal from '../../Components/ConformationModal/ConformationModal'
import Table from '../../Components/DataTable/Table'
import DropDown from '../../Components/DropDown/DropDown'
import ResetFilter from '../../Components/DropDown/ResetFilter'
import Pagination from '../../Components/Pagination/Pagination'
import SectionInfoCard from '../../Components/SectionInfoCard/SectionInfoCard'
import AddLanguage from '../../Components/Test&CategoryComponents/QuestionAndSolution/AddLanguage'
import AddQuestion from '../../Components/Test&CategoryComponents/QuestionAndSolution/AddQuestion'
import AddQuestionInOtherLang from '../../Components/Test&CategoryComponents/QuestionAndSolution/AddQuestionInOtherLang'
import AddSection from '../../Components/Test&CategoryComponents/QuestionAndSolution/AddSection'
import BulkQuestionAdd from '../../Components/Test&CategoryComponents/QuestionAndSolution/BulkQuestionAdd'
import EditQuestion from '../../Components/Test&CategoryComponents/QuestionAndSolution/EditQuestion'
import EditSection from '../../Components/Test&CategoryComponents/QuestionAndSolution/EditSection'
import EditSolution from '../../Components/Test&CategoryComponents/QuestionAndSolution/EditSolution'
import Layout from '../../Layout/Layout'
import { getApi } from '../../api/callApi'
import { urlApi } from '../../api/urlApi'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'
import { calculateSerialNumber } from '../../utils/commonFunction/serialNumber'
import { getLanguageCodefromString, getLanguageIdFromString, getLanguageStringFromId } from '../../utils/getDataFromId'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'

const QuestionAndSolution = () => {
    const { state } = useLocation();
    const { testId } = useParams();
    const [languageFilter, setLanguageFilter] = useState(false)
    const [selectedSubSectionId, setSelectedSubSectionId] = useState("");
    const [question, setQuestion] = useState({
        data: [],
        count: 0,
    });
    const [itemPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [sections, setSections] = useState([]);
    const [sectionNumber, setSectionNumber] = useState(null);
    const [solutionData, setSolutionData] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState({
        id: "650153f818634aa486e1abd9",
        name: "English",
        code: "en"
    });


    const storeLanguage = JSON.parse(localStorage.getItem("question-language"));
    let language = storeLanguage?.map((lang, index) => {
        return getLanguageStringFromId(lang);
    });

    useEffect(() => {
        if (hasAccess(accessKeys?.getTestSections)) {
            getSections();
        }
    }, [])

    useEffect(() => {
        if (hasAccess(accessKeys?.getSolutionsForTest)) {
            getSolution();
        }
    }, [])

    useEffect(() => {
        if (sections?.length && hasAccess(accessKeys?.getQuestions)) {
            getQuestion();
        }
    }, [sectionNumber, currentPage, sections])

    const onPageChange = (page) => {
        setCurrentPage(page);
        return;
    };

    const handleLanguageChange = (e) => {
        setLanguageFilter(false)
        let langCode = getLanguageCodefromString(e);
        setSelectedLanguage({
            id: getLanguageIdFromString(langCode),
            name: e,
            code: langCode
        });
        return;
    }
    function resetFilters() {
        getSections();
        getSolution();
        if (sections?.length) {
            getQuestion();
        }
        return;
    }

    async function getSections() {
        loadingShow();
        let resp = await getApi(urlApi.getSections + testId);
        loadingHide();
        if (resp.responseCode == 200) {
            setSections(resp?.data?.sections);
            setSelectedSubSectionId(resp?.data?.sections[0]?._id);
        }
        else {
            toast.error(resp.message)
        }
        return;
    }

    async function getQuestion({ subSectionId = null } = {}) {
        let localSectionNumber = sectionNumber ?? sections[0]?.sectionNumber;
        loadingShow();
        let url = urlApi.getQuestion + testId + "?page=" + currentPage + "&limit=" + itemPerPage + "&sectionNumber=" + parseInt(localSectionNumber)
        let resp = await getApi(url);
        loadingHide();
        if (resp.responseCode === 200) {
            setQuestion({
                data: resp?.data?.value,
                count: resp?.data?.total
            });
            setSelectedSubSectionId(subSectionId ? subSectionId : resp?.data?.value[0]?.sections._id);
        }
        else {
            toast.error(resp.message);
        }
        return;
    }

    async function getSolution() {
        loadingShow();
        let url = urlApi.getSolution + testId;
        let resp = await getApi(url);
        loadingHide();
        if (resp.responseCode == 200) {
            setSolutionData(resp?.data?.sections);
        }
        else {
            toast.error(resp.message)
        }
        return;
    }

    async function handleDelete(sectionId, questionId) {
        loadingShow();
        let url = urlApi.deleteQuestion + testId + "/" + sectionId + "/" + questionId;
        let resp = await getApi(url);
        loadingHide();
        if (resp.responseCode == 200) {
            toast.success(resp.message);
            getQuestion({ subSectionId: selectedSubSectionId });
        }
        else {
            toast.error(resp.message)
        }
        return;
    }

    const columns = useMemo(() => {
        return (
            [
                {
                    name: "Sno",
                    width: "60px",
                    cell: (_, rowIndex) => calculateSerialNumber(rowIndex, currentPage, itemPerPage)
                },
                {
                    name: "Question",
                    cell: row => (
                        <p className="m-0 py-3" dangerouslySetInnerHTML={{ __html: row?.sections?.questions?.[selectedLanguage?.code]?.value ?? row?.sections?.questions?.en?.value }}></p>
                    )
                },
                {
                    name: "Action",
                    width: "200px",
                    center: "center",
                    selector: row =>
                    (

                        <div className='p-2'>
                            {
                                (!row?.sections?.questions?.[selectedLanguage?.code] || row?.sections?.questions?.[selectedLanguage?.code]?.options?.length === 0) ?
                                    (hasAccess(accessKeys?.updateQuestionByLanguage) && <AddQuestionInOtherLang
                                        editData={row?.sections?.questions?._id}
                                        testNameId={testId}
                                        sectionId={selectedSubSectionId ? selectedSubSectionId : question?.sections?._id}
                                        dropDownData={language}
                                        selectedLang={selectedLanguage?.code}
                                        questionId={row?.sections?.questions?.[selectedLanguage?.code]?.value ? row?.sections?.questions?.[selectedLanguage?.code] : row?.sections?.questions?.en}
                                        testId={testId}
                                        callback={() => getQuestion({ subSectionId: selectedSubSectionId })}
                                        question={<p className="m-0 py-3"
                                            dangerouslySetInnerHTML={{ __html: row?.sections?.questions?.[selectedLanguage?.code]?.value ?? row?.sections?.questions?.en?.value }}></p>}
                                    />)
                                    :
                                    (<div className='flex gap-2'>
                                        <EditQuestion selectedLang={selectedLanguage?.code || "en"} questionData={row?.sections?.questions?.[selectedLanguage?.code]?.value ? row?.sections?.questions?.[selectedLanguage?.code] : row?.sections?.questions?.en}
                                            testId={testId}
                                            sectionId={selectedSubSectionId ? selectedSubSectionId : question?.sections?._id}
                                            questionId={row?.sections?.questions?._id}
                                            callback={() => { getQuestion({ subSectionId: selectedSubSectionId }); getSolution(); getSections() }}
                                        />
                                        {(hasAccess(accessKeys?.getSolutionsForTest) && hasAccess(accessKeys?.updateQuestionData)) && <EditSolution
                                            selectedLang={selectedLanguage?.code || "en"}
                                            sectionId={selectedSubSectionId ? selectedSubSectionId : question?.sections?._id}
                                            questionId={row?.sections?.questions?._id}
                                            testId={testId}
                                            solutions={solutionData || []}
                                            editData={row}
                                            callback={() => { getQuestion({ subSectionId: selectedSubSectionId }); getSolution(); getSections() }}
                                        />}
                                        {hasAccess(accessKeys?.deleteQuestion) && <ConformationModal components={<IconTrash size={22} className='text-primary-red' />} handleOperation={() => handleDelete(selectedSubSectionId ? selectedSubSectionId : question?.sections?._id, row?.sections?.questions?._id)} text={"Delete"} />}
                                    </div>)
                            }
                        </div>
                    )
                },
            ]
        )
    }, [question, selectedLanguage?.code])


    return (
        <Layout>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 mb-3">
                <SectionInfoCard cardTitle={"No. of Categories"} prefixNumber={state?.categoryCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />
                <SectionInfoCard cardTitle={"Total Tests"} prefixNumber={state?.totalTests} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />
                <SectionInfoCard cardTitle={"Total Question"} prefixNumber={state?.totalQuestions} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPassAssignIcon.svg"} />
                <SectionInfoCard cardTitle={"Today Tests"} prefixNumber={state?.todayTestCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/totalPass.svg"} />
                <SectionInfoCard cardTitle={"Today Questions"} prefixNumber={state?.todayQuestionCount} Icon={process.env.PUBLIC_URL + "/Assets/Images/ExamPassIcons/todayPassAssign.svg"} />
            </div>

            <div className='h-auto w-full bg-white-color rounded-2xl mt-3 p-3 flex flex-wrap shadow-sm justify-between items-center'>
                <div className='flex justify-center items-center gap-2 font-semibold text-base sm:w-auto order-[1]'>
                    {hasAccess(accessKeys?.addTestSection) && <AddSection testId={testId} callback={() => { getSections() }} />}
                    {
                        (hasAccess(accessKeys?.addLanguage) && (sections?.length != 0)) &&
                        <AddLanguage testId={testId} callback={() => { getQuestion({ subSectionId: selectedSubSectionId }); getSections() }} />
                    }
                    {(hasAccess(accessKeys?.updateSectionData) && (sections?.length != 0)) && <EditSection testId={testId} sectionGroup={sections} callback={() => { getSections() }} />}
                </div>
                <div className='flex filter-container items-center gap-3 order-[2] sm:order-[3]'>
                    <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
                </div>
            </div>
            <div className='p-2 bg-white-color mt-3'>
                {sections?.length > 0 &&
                    <Tabs
                        defaultActiveKey={sectionNumber ? sectionNumber : sections[0]?.sectionNumber}
                        className="mb-3"
                        onSelect={(key) => {
                            setCurrentPage(1);
                            setSectionNumber(key);
                            setSelectedLanguage({
                                id: "650153f818634aa486e1abd9",
                                name: "English",
                                code: "en"
                            })
                            setLanguageFilter(true);
                        }}
                    >
                        {
                            sections?.map((item, index) => {
                                return (
                                    <Tab onClick={() => {
                                        setSelectedSubSectionId(item?._id);
                                    }}
                                        eventKey={item?.sectionNumber}
                                        title={
                                            <>
                                                <p className='m-0'>{item?.sectionName}&nbsp;({item?.sectionNumber})</p>
                                            </>
                                        }
                                        key={index}>
                                        <div className="w-[40%] mb-3">
                                            <DropDown
                                                onclick={handleLanguageChange}
                                                options={language}
                                                defaultOption={selectedLanguage?.name}
                                                dropDownId={"dropDownId"}
                                                reset={languageFilter}
                                            />
                                        </div>
                                        {
                                            selectedLanguage?.code === "en" && (
                                                <div className='mb-3 flex gap-3'>
                                                    {hasAccess(accessKeys?.addQuestion) &&
                                                        <>
                                                            <AddQuestion testNameId={testId} sectionId={item?._id} selectedLang={selectedLanguage?.code || "en"} callback={() => { getQuestion({ subSectionId: selectedSubSectionId }); getSolution(); getSections() }} />
                                                            <BulkQuestionAdd testId={testId} sectionId={item?._id} selectedLang={selectedLanguage?.code || "en"} callback={() => { getQuestion({ subSectionId: selectedSubSectionId }); getSolution(); getSections() }} />
                                                        </>

                                                    }
                                                </div>
                                            )
                                        }
                                        {(hasAccess(accessKeys?.getQuestions) && (question?.data?.length > 0)) ?
                                            (<Table columns={columns} data={question?.data} />) : null
                                        }
                                        <Pagination onPageChanges={onPageChange}
                                            totalItems={question?.count}
                                            itemPerPage={itemPerPage}
                                            currentPage={currentPage}
                                        />
                                    </Tab>
                                )
                            })
                        }
                    </Tabs>}
            </div>
        </Layout>
    )
}

export default QuestionAndSolution