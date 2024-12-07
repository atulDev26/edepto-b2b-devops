import { toast } from "sonner";
import { getApi } from "../../api/callApi";
import { urlApi } from "../../api/urlApi";
import { loadingHide, loadingShow } from "../gloabalLoading"
import { ACCESS_LIST } from "../../api/localStorageKeys";

export const getAccessData = async (teacherId) => {
  loadingShow();
  let resp = await getApi(urlApi.getAccess + teacherId)
  loadingHide();
  if (resp.responseCode === 200) {
    localStorage.setItem("access-list", JSON.stringify(resp?.data))
  }
}

// access checking
export const hasAccess = (functionName) => {
  let accessList = ACCESS_LIST() || [];
  if (functionName) {
    for (const item of accessList) {
      if (item?.function == functionName) {
        if (item?.access == "granted") {
          return true;
        } else {
          return false;
        }
      }
    }
  } else {
    return false;
  }
};
