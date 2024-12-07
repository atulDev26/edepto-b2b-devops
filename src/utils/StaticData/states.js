import { toast } from "sonner";
import { getApi } from "../../api/callApi";
import { urlApi } from "../../api/urlApi";

export const getStates = async () => {
    const resp = await getApi(urlApi.states);
    if (resp.responseCode === 200) {
        localStorage.setItem("states", JSON.stringify(resp?.data));
    } else {
        toast.error(resp?.message)
    }
    return;
}