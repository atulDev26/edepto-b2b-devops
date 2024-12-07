export const calculateSerialNumber = (index,currentPage,itemPerPage) => {
    return (currentPage - 1) * itemPerPage + index + 1;
};