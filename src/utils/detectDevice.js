export const detectDevice = () => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/windows phone|windows nt/i.test(userAgent)) {
        return "Desktop";
    }
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    else {
        return "unknown";
    }
}