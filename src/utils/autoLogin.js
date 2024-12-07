import { postApi } from "../api/callApi";
import { TOKEN } from "../api/localStorageKeys";
import { urlApi } from "../api/urlApi";
import { getAccessData } from "./StaticData/accessList";
import { getLanguages } from "./StaticData/languages";
import { getStates } from "./StaticData/states";
import { detectDevice } from "./detectDevice";
export const autoLogin = async (callback = null) => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.password && storedData.teacherId) {
        const { password, teacherId } = storedData;
        let device = detectDevice();
        let postData = { password: password, teacherId: teacherId, device: device }
        const resp = await postApi(urlApi.autoLogin, postData);
        if (resp.responseCode === 200) {
            localStorage.setItem("userData", JSON.stringify(resp?.data));
            await getStates();
            await getLanguages();
            await getAccessData(resp?.data?.teacherId);
            if (TOKEN()) {
                if (callback) {
                    callback();
                }
            }
            return;
        } if (resp.responseCode === 500) {
            window.location = "/login";
            return;
        }
    } else {
        window.location = "/login";
        return;
    }
}