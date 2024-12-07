import { IconCertificate } from '@tabler/icons-react'
import React from 'react'
import { Link } from 'react-router-dom'
import EditSection from './EditSection'
import { loadingHide, loadingShow } from '../../../utils/gloabalLoading'
import { getApi } from '../../../api/callApi'
import { urlApi } from '../../../api/urlApi'
import { toast } from 'sonner'
import DeleteConformationModal from '../../DeleteConformationModal/DeleteConformationModal'
import { hasAccess } from '../../../utils/StaticData/accessList'
import { accessKeys } from '../../../utils/accessKeys.utils'

const SectionCard = ({ name, testCount, orderby, sectionId, categoryIdPlusSubCategoryId, shortName, callback, state, propLink, isEdit }) => {
  async function handleDeleteCategory() {
    loadingShow();
    let resp = await getApi(urlApi.deleteTestSection + categoryIdPlusSubCategoryId + "/" + sectionId);
    loadingHide();
    if (resp.responseCode === 200) {
      toast.success(resp.message);
      if (callback) {
        callback()
      }
    } else {
      toast.error(resp.message);
    }
    return;
  }
  return (
    <div className='w-full bg-white-color shadow-sm rounded-lg hover:bg-slate-100 cursor-pointer'>
      <div className='w-full flex justify-between items-center gap-2 rounded-t-lg bg-[#FFE6D0] px-3 py-2'>
        <div className='flex justify-between items-center gap-2'>
          <IconCertificate className='text-[#FFA95C]' />
          <p className='font-semibold text-base text-menu-text-color flex-wrap'>{name}</p>
        </div>
        {isEdit && <div className='flex gap-2'>
          {hasAccess(accessKeys?.editSection) && <EditSection categoryIdPlusSubCategoryIdPlusSectionId={categoryIdPlusSubCategoryId + "/" + sectionId} name={name} shortName={shortName} orderby={orderby} callback={callback} />}
          {hasAccess(accessKeys?.deleteSection) && <DeleteConformationModal onclick={() => { handleDeleteCategory() }} content={<p>Are you Sure You Want to Delete ?</p>} heading={"Warning !!!"} />}
        </div>}
      </div>
      <Link to={!propLink ? { pathname: "/test-&-categories/test-listing/" + categoryIdPlusSubCategoryId + "/" + sectionId } : propLink} state={state} as="/test">
        <div className='p-3'>
          <p className='font-extrabold text-4xl'>{testCount}</p>
          <div className='flex justify-between items-center gap-2'>
            <div className='flex gap-3 mt-2'>
              <p className='font-medium text-sm text-menu-text-color'>Test Add in Last 30 Days </p>
              <p className='text-sm text-menu-text-color font-semibold'>+10</p>
            </div>
            <div>
              <p className='w-fit h-fit text-xs rounded-lg px-1 py-1 bg-[#96C237] text-white-color'>OB:<span className='font-extrabold text-black'>{orderby}</span></p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default SectionCard