import React, { useState } from 'react'
import BlogInfoCards from '../../Components/AllBlog/BlogInfoCards'
import SingleDropDownFilter from '../../Components/DropDown/SingleDropDownFilter'
import SearchInputField from '../../Components/SearchInputField/SearchInputField'
import Layout from '../../Layout/Layout'
import ResetFilter from '../../Components/DropDown/ResetFilter'

const AllBlog = () => {
  const [filter, setFilter] = useState("");
  const [resetFilter, setResetFilter] = useState(false)
  
  function statusDropDown(event) {
    setFilter(event);
    setResetFilter(false);
    return;
  }
  function resetFilters() {
    setResetFilter(true);
    return;
  }
  return (
    <Layout>
      <div className='h-auto w-full bg-white-color rounded-2xl p-3 flex flex-wrap shadow-sm justify-between items-center'>
        <div className='font-semibold text-base sm:w-auto order-[1]'>
        All Blog
        </div>
        <div className='search-container mt-1 sm:mt-2 md:m-0 xl:m-0 w-full sm:w-full md:w-1/2 order-[3] sm:order-[2]'>
          <SearchInputField width={"100%"} bgColor={"#ffffff"} />
        </div>
        <div className='flex filter-container items-center mb-[10px] gap-3 order-[2] sm:order-[3]'>
          <SingleDropDownFilter onclick={(e) => { statusDropDown(e) }}
            options={["Option 1", "Option 2", "Option 3"]}
            defaultOption={"Filter"} reset={resetFilter} />
          <ResetFilter options={["Reset"]} onclick={() => resetFilters()} />
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 p-3'>
        {
          [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
            return (
              <BlogInfoCards key={index} />
            )
          })
        }
      </div>
    </Layout>
  )
}

export default AllBlog