import React from 'react'
import DataTable from 'react-data-table-component'
import Pagination from '../Pagination/Pagination'

const Table = ({ columns, data, customPagination, conditionalRowStyles, currentPage, handlePerRowsChange,
  handlePageChange, }) => {
  const tableCustomStyles = {
    headRow: {
      style: {
        backgroundColor: "var(--table-header-bg)",
      },
    },
    // cells: {
    //   style: {
    //     whiteSpace: "nowrap",
    //     wordWrap: "wrap"
    //   }
    // }
  }
  return (
    <DataTable
      columns={columns}
      data={data}
      paginationServer
      customStyles={tableCustomStyles}
      conditionalRowStyles={conditionalRowStyles}
      // onChangeRowsPerPage={(newPerPage, page) => handlePerRowsChange(newPerPage, page)}
      // onChangePage={(page, total) => handlePageChange(page)}
      highlightOnHover
      // pagination
      paginationDefaultPage={currentPage}
      // paginationComponent={(props) => { return <Pagination  {...props}/> }}
    />
  )
}

export default Table