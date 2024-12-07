import { imageUploadApi } from "../../api/callApi";

export async function uploadImage(file, apiUrl) {
    try {
        let formData = new FormData();
        formData.append('image', file);
        let uploadApiResponse = await imageUploadApi(apiUrl, formData);
        return uploadApiResponse?.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}