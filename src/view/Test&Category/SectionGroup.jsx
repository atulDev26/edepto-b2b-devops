import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../Layout/Layout'
import AddSectionGroup from '../../Components/Test&CategoryComponents/TestListing/SectionGroup/AddSectionGroup'
import { useLocation, useParams } from 'react-router-dom'
import { loadingHide, loadingShow } from '../../utils/gloabalLoading'
import { urlApi } from '../../api/urlApi'
import { getApi } from '../../api/callApi'
import { toast } from 'sonner'
import Table from '../../Components/DataTable/Table'
import ConformationModal from '../../Components/ConformationModal/ConformationModal'
import { IconTrash } from '@tabler/icons-react'
import { hasAccess } from '../../utils/StaticData/accessList'
import { accessKeys } from '../../utils/accessKeys.utils'

const SectionGroup = () => {
  const { state } = useLocation();
  const { section_id } = useParams();
  const [sectionData, setSectionData] = useState([]);
  const [accesses] = useState({
    deleteSectionGroup: hasAccess(accessKeys?.deleteSectionGroup)
  });

  useEffect(() => {
    if (hasAccess(accessKeys?.getSectionGroups)) {
      getSectionData();
    }
  }, [])

  async function getSectionData() {
    loadingShow();
    let url = urlApi.getSectionGroup + section_id;
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      setSectionData(resp.data.sectionGroup);
    } else {
      toast.error(resp.message);
    }
    return;
  }
  async function handleRemoveGroup(group_id) {
    loadingShow();
    let url = urlApi.deleteSectionGroup + section_id + "/" + group_id;
    let resp = await getApi(url);
    loadingHide();
    if (resp.responseCode === 200) {
      getSectionData()
      setSectionData([])
    } else {
      toast.error(resp.message);
    }
    return;
  }
  const columns = useMemo(() => {
    return ([
      {
        name: "S.No",
        width: "60px",
        cell: (row) => 1,
      },
      {
        name: "Group Name",
        cell: row => (
          <>
            <p className='m-0'>{row?.groupName}</p>
          </>
        ),
      },
      {
        name:
          <div>
            <p className='m-0'>Option Name</p>
            <span style={{ color: "Green" }}>Section Name / Section Number</span>
          </div>,
        cell: row => (
          <>
            <div>
              {row?.sectionOptions?.map((option, index) => (
                <p key={index}>{option.sectionName}/<span>{option.sectionNumber}</span></p>
              ))}
            </div>
          </>
        ),
      },
      {
        name: "Action",
        omit: !accesses?.deleteSectionGroup,
        cell: row => (
          <>
            {hasAccess(accessKeys?.deleteSectionGroup) && <ConformationModal components={<IconTrash size={22} className='text-primary-red' />} handleOperation={() => handleRemoveGroup(row?._id)} text={"Delete"} />}
          </>
        ),
      },
    ])
  }, [accesses, sectionData])
  return (
    <Layout>
      {hasAccess(accessKeys?.addSectionGroup) && <AddSectionGroup sectionId={section_id} data={state} callback={() => { getSectionData() }} />}
      <br />
      <Table columns={columns} data={sectionData} />
    </Layout>
  )
}

export default SectionGroup