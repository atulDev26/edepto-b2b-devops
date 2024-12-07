export const TOKEN = () => {
    return localStorage.getItem("edepto-b2b-token");
}

export const ALL_LANGUAGE = () => {
    return localStorage.getItem("languages");
}

export const STATES = () => {
    return localStorage.getItem("states");
}

export const USER_DATA = () => {
    return localStorage.getItem("userData");
}

export const ACCESS_LIST = () => {
    return JSON.parse(localStorage.getItem('access-list')) || [];
}


