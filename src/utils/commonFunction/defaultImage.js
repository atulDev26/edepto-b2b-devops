import defaultImage from "./defaultImg.svg"

export const addDefaultImg = (ev) => {
    ev.onerror = null;
   ev.src = defaultImage;
}