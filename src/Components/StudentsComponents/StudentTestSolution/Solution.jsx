import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getApi } from '../../../api/callApi';
import { urlApi } from '../../../api/urlApi';
import { getLanguageCodefromString } from '../../../utils/getDataFromId';
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading';
import ResetFilter from '../../DropDown/ResetFilter';
import SingleDropDownFilter from '../../DropDown/SingleDropDownFilter';
import { IconChecks, IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { Dropdown } from 'react-bootstrap';

const Solution = ({ testId, studentId }) => {
    const [results, setResults] = useState([]);
    const [currentSection, setCurrentSection] = useState();
    const [resetFilter, setResetFilter] = useState(false);
    const [sectionNameDropDownFilter, setSectionNameDropDownFilter] = useState([]);
    const [defaultFilterDropDown, setDefaultFilterDropDown] = useState("");
    const [questions, setQuestions] = useState([]);
    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [language, setLanguage] = useState(null);
    const [filterByLanguage, setFilterByLanguage] = useState("en");
    const [filterSearch, setFilterSearch] = useState("All");


    useEffect(() => {
        getSolution();
    }, [resetFilter])


    useEffect(() => {
        if (sectionNameDropDownFilter.length > 0) {
            handleSectionChange(sectionNameDropDownFilter[0]);
        }
    }, [sectionNameDropDownFilter]);


    async function getSolution() {
        loadingShow();
        let resp = await getApi(urlApi.getTestSolution + testId);
        loadingHide();
        if (resp.responseCode === 200) {
            const firstSection = resp?.data[0]?.test?.sections[0]?.sectionName;
            setResults(resp?.data);
            setCurrentSection(resp?.data[0]?.sections[0]);
            setSectionNameDropDownFilter(resp?.data[0]?.test?.sections?.map(item => { return item?.sectionName }));
            // setDefaultFilterDropDown(resp?.data[0]?.test?.sections[0]?.sectionName)
            setDefaultFilterDropDown(firstSection);
            setLanguage(resp?.data[0]?.languages?.map(item => { return item?.language }))
        } else {
            toast.error(resp.message);
        }
        return;
    }

    function resetFilters() {
        setResetFilter(true);
        setFilterSearch("All");
        setFilterByLanguage("en");
        setExpandedQuestionIndex(null);
        handleSectionChange(sectionNameDropDownFilter[0]);
        return;
    }

    function handleSectionChange(selectedSectionName) {
        setFilterSearch("All");
        setFilterByLanguage("en");
        setExpandedQuestionIndex(null);
        const selectedSection = results[0]?.test?.sections?.find(section => section?.sectionName === selectedSectionName);
        setCurrentSection(selectedSection);
        setQuestions(selectedSection?.questions || []);
        setExpandedQuestionIndex(null);
        return;
    }

    function toggleQuestion(index) {
        setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
        setSelectedQuestion(questions[index]);
        if (questions[index]) {
            const userAnswer = results[0]?.sections[0]?.questions.find(q => q?.questionNumber === questions[index]?.questionNumber)?.answer;
            setUserAnswers(prevState => ({
                ...prevState,
                [index]: userAnswer
            }));
        }
        return;
    }

    function handleLangaugeChange(language) {
        setExpandedQuestionIndex(null);
        setFilterByLanguage(getLanguageCodefromString(language));
        return;
    }

    function getFilterData(filter) {
        setExpandedQuestionIndex(null);
        setFilterSearch(filter);
        const filteredQuestions = currentSection?.questions?.filter(question => {
            const userAnswerData = results[0]?.sections[0]?.questions?.find(q => q?.questionNumber === question?.questionNumber);
            switch (filter) {
                case 'All':
                    return true;
                case 'Attempted':
                    return userAnswerData?.isAnswered;
                case 'Unattempted':
                    return !userAnswerData?.isAnswered;
                case 'Marked':
                    return userAnswerData?.isMarked;
                case 'Marked & Answered':
                    return userAnswerData?.isMarked && userAnswerData?.isAnswered;
                case 'Unseen':
                    return !userAnswerData?.isViewed;
                default:
                    return true;
            }
        });
        setQuestions(filteredQuestions);
    }

    return (
        <>
            <div className='flex filter-container justify-end items-center gap-2'>
                <SingleDropDownFilter onclick={(e) => { handleSectionChange(e) }}
                    options={sectionNameDropDownFilter}
                    defaultOption={defaultFilterDropDown ? defaultFilterDropDown : "Filter"} reset={resetFilter} />
                <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
            </div>
            <div className='flex items-center'>
                <div className='sectionName w-fit px-3 font-semibold'>Test Question</div>
                <SingleDropDownFilter onclick={(e) => { handleLangaugeChange(e) }}
                    options={language}
                    defaultOption={"Select Language"} reset={resetFilter} />
            </div>
            <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-summary dropdown-menu-align-responsive-1" style={{ fontSize: '14px' }}>
                    {filterSearch || "Filter"} &nbsp;&nbsp;
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => { getFilterData("All") }} style={{ fontSize: '12px' }}>All</Dropdown.Item>
                    <Dropdown.Item onClick={() => { getFilterData("Attempted") }} style={{ fontSize: '12px' }}>Attempted</Dropdown.Item>
                    <Dropdown.Item onClick={() => { getFilterData("Unattempted") }} style={{ fontSize: '12px' }}>Unattempted</Dropdown.Item>
                    <Dropdown.Item onClick={() => { getFilterData("Marked") }} style={{ fontSize: '12px' }}>Marked</Dropdown.Item>
                    <Dropdown.Item onClick={() => { getFilterData("Marked & Answered") }} style={{ fontSize: '12px' }}>Marked & Answered</Dropdown.Item>
                    <Dropdown.Item onClick={() => { getFilterData("Unseen") }} style={{ fontSize: '12px' }}>Unseen</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <div className='questions-list mt-3'>
                {questions?.length ? questions?.map((question, index) => (
                    <div key={index} className='question-item cursor-pointer mb-2 bg-[#ECF3FF] p-2 rounded-2xl ' onClick={() => { toggleQuestion(index) }}>
                        <div className={`flex gap-2 justify-between items-center ${expandedQuestionIndex === index && "mb-3"}`}>
                            <div className='flex gap-2 items-center'>
                                <p className='min-w-[30px] min-h-[30px] w-[30px] h-[30px] rounded-full bg-[#024CC7] text-white-color flex items-center justify-center'>{index + 1}</p>
                                <p className={`mb-0 question-text-box  text-sm ${!expandedQuestionIndex === index && "text-[#5B687B]"}  ${expandedQuestionIndex === index && " font-bold text-[#024CC7]"}`} dangerouslySetInnerHTML={{ __html: question[filterByLanguage]?.value }}></p>
                            </div>
                            {expandedQuestionIndex === index ? <IconChevronDown /> : <IconChevronRight />}
                        </div>
                        {expandedQuestionIndex === index && (
                            <>
                                <hr />
                                <div className='question-details mt-2 p-2 bg-[#ECF3FF] rounded-lg'>
                                    <div className='answer w-[120px] px-3 font-semibold'>Answer:</div>
                                    {/* <p>Additional details for question {index + 1}</p> */}
                                    <div className='grid grid-cols-2 p-2'>
                                        {selectedQuestion[filterByLanguage]?.options?.map((item, optIndex) => {
                                            const isCorrect = optIndex + 1 === selectedQuestion.correctOption;
                                            const isUserAnswer = optIndex + 1 === userAnswers[index];
                                            return (
                                                <>
                                                    <div key={optIndex} className='p-2 px-2 py-2 justify-between items-center rounded-md mb-2 mr-2' style={{
                                                        border: '2px solid',
                                                        borderColor: isCorrect ? '#49A57A' : isUserAnswer ? '#FF0000' : '#F9F9F9',
                                                        backgroundColor: isCorrect ? '#D9FFED' : isUserAnswer ? '#FFCCCC' : '#F9F9F9'
                                                    }}>
                                                        <div className='flex gap-2 items-center'>
                                                            <p dangerouslySetInnerHTML={{ __html: "0" + (optIndex + 1) }}
                                                                style={{
                                                                    padding: "4px",
                                                                    color: "white",
                                                                    borderRadius: "5px",
                                                                    backgroundColor: isCorrect ? '#49A57A' : '#334155'
                                                                }}
                                                            ></p>
                                                            <p dangerouslySetInnerHTML={{ __html: item?.value }}></p>
                                                            {isCorrect && <IconChecks className='text-[#49A57A]' />}
                                                        </div>
                                                    </div>
                                                    {/* <p dangerouslySetInnerHTML={{ __html: selectedQuestion.solution[filterByLanguage]}}></p>   */}
                                                </>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>

                        )}
                    </div>
                )) : <p className='nodataFound text-red-500 font-semibold text-center mb-3'>No Data Found</p>}
            </div>


        </>

    )
}

export default Solution