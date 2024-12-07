import { toast } from "sonner";
import { getApi } from "../../api/callApi";
import { urlApi } from "../../api/urlApi";

export const getLanguages = async () => {
    const resp = await getApi(urlApi.languages);
    if (resp.responseCode === 200) {
        localStorage.setItem("languages", JSON.stringify(resp?.data));
    } else {
        toast.error(resp?.message)
    }
    return;
}