import React from "react";
import { Link } from "react-router-dom";
import EditCategoryModal from "./EditCategoryModal";
import { loadingHide, loadingShow } from "../../utils/gloabalLoading";
import { getApi } from "../../api/callApi";
import { urlApi } from "../../api/urlApi";
import { toast } from "sonner";
import DeleteConformationModal from "../DeleteConformationModal/DeleteConformationModal";
import { hasAccess } from "../../utils/StaticData/accessList";
import { accessKeys } from "../../utils/accessKeys.utils";

const CategoryCards = ({ data, callback, cardDetails }) => {
  async function handleDeleteCategory() {
    loadingShow();
    let resp = await getApi(urlApi.deleteCategory + data?._id);
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
    <>
      <div className={`w-full shadow-sm rounded-xl p-[10px] hover:bg-slate-200 
      ${!data?.status ? "bg-[#e2e6ec]" : "bg-white-color"}`}>
        <div className="grid grid-cols-2 justify-between items-center">
          <p className="flex gap-2 items-center">
            Order:{""}
            <span className="flex justify-center items-center w-[33px] h-[21px] bg-primary-green rounded-full text-white-color font-semibold text-xs">
              {data?.orderBy}
            </span>
          </p>
          <div className="w-full flex justify-end gap-2">
            {hasAccess(accessKeys?.editCategory) && <span className="w-[25px] h-[25px] bg-[#F5F6F8] rounded-full text-center">
              <EditCategoryModal data={data} callback={callback} />
            </span>}
            {hasAccess(accessKeys?.deleteCategory) && <span className="w-[25px] h-[25px] text-center bg-[#F5F6F8] rounded-full">
              <DeleteConformationModal onclick={() => { handleDeleteCategory() }} content={<p>Are you Sure You Want to Delete ?</p>} heading={"Warning !!!"} />
            </span>}
          </div>
        </div>
        <Link to={{ pathname: "test-subcategory/" + data?._id }} state={cardDetails}>
          <div className="mt-2 bg-[#F3F8FF] p-2 rounded-md">
            <img className="h-[85px] min-w-full object-contain rounded-xl" src={data?.icon} alt="text" />
          </div>
          <p className="font-bold text-base text-center p-2">{data?.categoryName}</p>
        </Link>
      </div>
    </>
  );
};
export default CategoryCards;
