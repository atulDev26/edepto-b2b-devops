import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

const Pagination = ({ onPageChanges, totalItems, itemPerPage,currentPage }) => {
    const totalPages = Math.ceil(totalItems / itemPerPage);
    const [cur, setCur] = useState();

    useEffect(() => {
        setCur(currentPage);
    }, [currentPage])

    function next() {
        if (cur < totalPages) {
            setCur((prevCur) => prevCur + 1);
            onPageChanges(cur + 1);
        }
    }

    function back() {
        if (cur > 1) {
            setCur((prevCur) => prevCur - 1);
            onPageChanges(cur - 1);
        }
    }
    function handlePageClick(page) {
        setCur(page);
        onPageChanges(page);
    }

    const renderPageNumbers = () => {
        let startPage = Math.max(cur - 2, 1);
        let endPage = Math.min(cur + 2, totalPages);
        const pages = [];

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageClick(i)}
                    className={`py-1 border-2 font-semibold border-r-0 border-indigo-600 text-sm w-10 ${cur === i && "bg-primary-blue  border-2 border-indigo-600 text-white"}`}
                    style={{
                        color: cur === i ? "white" : "var(--primary-blue)",
                        borderRight: ((i !== endPage) && cur !== i) && "1px solid #E4EAF0",
                    }}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex justify-center rounded-b-xl">
            <div
                className="w-fit flex justify-center bg-white rounded-3xl my-3 md:m-2"
                style={{
                    border: "2px solid #E4EAF0",
                }}
            >
                <button
                    onClick={() => back()}
                    className=" py-1 px-2 rounded-l-3xl hover:bg-primary-blue hover:text-white "
                    style={{
                        borderRight: "1px solid #E4EAF0",
                    }}
                >
                    <IconChevronLeft stroke={1.5} size={18} />
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => next()}
                    className="px-2 py-1 rounded-r-3xl hover:bg-primary-blue hover:text-white"
                    style={{
                        borderLeft: "1px solid #E4EAF0",
                    }}
                >
                    <IconChevronRight stroke={1.5} size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
