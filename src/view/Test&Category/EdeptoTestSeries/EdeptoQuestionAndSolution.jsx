import React, { useEffect, useMemo, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import Table from '../../../Components/DataTable/Table';
import DropDown from '../../../Components/DropDown/DropDown';
import ResetFilter from '../../../Components/DropDown/ResetFilter';
import Pagination from '../../../Components/Pagination/Pagination';
import SeeQuestion from '../../../Components/Test&CategoryComponents/QuestionAndSolution/SeeQuestion';
import SeeSolution from '../../../Components/Test&CategoryComponents/QuestionAndSolution/SeeSolution';
import Layout from '../../../Layout/Layout';
import { calculateSerialNumber } from '../../../utils/commonFunction/serialNumber';
import { getLanguageCodefromString, getLanguageIdFromString, getLanguageStringFromId } from '../../../utils/getDataFromId';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';

const EdeptoQuestionAndSolution = () => {
    const { state } = useLocation();
    const { testId } = useParams();
    const [filter, setFilter] = useState("");
    const [resetFilter, setResetFilter] = useState(false);
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
        getSections();
    }, [])

    useEffect(() => {
        getSolution();
    }, [])

    useEffect(() => {
        getQuestion();
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

    function statusDropDown(event) {
        setFilter(event);
        setResetFilter(false);
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
        let resp = await getApi(urlApi.getEdeptoTestSectionById + testId);
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
        let url = urlApi.getEdeptoTestQuestions + testId + "?page=" + currentPage + "&limit=" + itemPerPage + "&sectionNumber=" + parseInt(localSectionNumber)
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
        let url = urlApi.getEdeptoTestSolutions + testId;
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
                                <div className='flex gap-2'>
                                    <SeeQuestion selectedLang={selectedLanguage?.code || "en"} questionData={row?.sections?.questions?.[selectedLanguage?.code]?.value ? row?.sections?.questions?.[selectedLanguage?.code] : row?.sections?.questions?.en}
                                        testId={testId}
                                        sectionId={selectedSubSectionId ? selectedSubSectionId : question?.sections?._id}
                                        questionId={row?.sections?.questions?._id}
                                        callback={() => { getQuestion({ subSectionId: selectedSubSectionId }); getSolution(); getSections() }} />
                                    <SeeSolution
                                        selectedLang={selectedLanguage?.code || "en"}
                                        sectionId={selectedSubSectionId ? selectedSubSectionId : question?.sections?._id}
                                        questionId={row?.sections?.questions?._id}
                                        testId={testId}
                                        solutions={solutionData || []}
                                        editData={row}
                                        callback={() => { getQuestion({ subSectionId: selectedSubSectionId }); getSolution(); getSections() }}
                                    />
                                </div>
                            }
                        </div>
                    )
                },
            ]
        )
    }, [question, selectedLanguage?.code])
    return (
        <Layout>
            <div className='h-auto w-full bg-white-color rounded-2xl mt-3 p-3 flex flex-wrap shadow-sm justify-between items-center'>
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
                                        {question?.data?.length > 0 ?
                                            <Table columns={columns} data={question?.data} /> : null
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

export default EdeptoQuestionAndSolution