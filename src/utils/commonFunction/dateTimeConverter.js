import dateFormat from "dateformat";
export const dateReturn = (date, format) => {
    if (!date) {
        return;
    } else
        return dateFormat(
            date.toLocaleString("en-US", {
                timeZone: "Asia/Calcutta",
            }),
            format
        );
}


//login Date conversions

export function formatDateString(dateString) {
    if (!dateString) {
        return;
    } else {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return `Thu May ${day} ${year} ${hours}:${minutes}:${seconds}`;
    }
}

// ip address configuration
export function convertIPv6toIPv4(ipv6) {
    const prefix = "::ffff:";
    if (ipv6.startsWith(prefix)) {
        return ipv6.substring(prefix.length);
    } else {
        return ipv6;
    }
}

//calculate duration between login and log out 
export function calculateDuration(loginTime, logoutTime) {
    if (!loginTime || !logoutTime) {
        return { hours: 0, minutes: 0, seconds: 0 };
    }
    const loginDate = new Date(loginTime);
    const logoutDate = new Date(logoutTime);
    if (isNaN(loginDate.getTime()) || isNaN(logoutDate.getTime())) {
        return { hours: 0, minutes: 0, seconds: 0 };
    }
    const diffMs = logoutDate - loginDate;
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}


//hours and min to second
export const getTimeConvert = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const totalSeconds = (hours * 3600) + (minutes * 60);
    return totalSeconds;
}

//second to hour min
export const getSecondToHourMin = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

// date-time
export const dateTimeConverter = (dateTime) => {
    if (dateTime) {
        let dateSplit = dateTime.split("T");
        let dateString = dateSplit[0];
        let timeString = dateSplit[1].split(".")[0];
        let finalDateTime = dateString + "\n" + timeString;
        return finalDateTime;
    } else {
        return " ";
    }
};

// extract date from dateString
export const extractDate = (inputDate) => {
    if (!inputDate) {
        return null;
    }
    const parts = inputDate?.split('T');
    const datePart = parts[0];
    return datePart;
}

// convert seconds into hours
export const convertSecondsToHours = (seconds) => {
    if (!seconds) return null;
    const avgDaily = seconds;
    const hoursPerDay = 24;
    const avgDailyInHours = Math.round(avgDaily * hoursPerDay);
    return avgDailyInHours + "Hrs";
}

//for format yyyymmdd T hh mm
export const getFormattedDateTime = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }
    const offsetMilliseconds = (-5 * 60 - 30) * 60 * 1000;
    const adjustedDate = new Date(date.getTime() + offsetMilliseconds);
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const hours = String(adjustedDate.getHours()).padStart(2, '0');
    const minutes = String(adjustedDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}


export const preparationCalenderSecondToHourMinSecForFraction = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const hourString = hours > 0 ? `${hours}h` : ''
    const minuteString = minutes > 0 ? `${minutes}m` : ''
    const secondString =
        remainingSeconds > 0 ? `${remainingSeconds?.toFixed(0)}s` : ''

    if (hours > 0) {
        return `${hourString}:${minuteString || '00m'} ${secondString && `:${secondString}`}`
    } else if (!hours && minutes > 0) {
        return `${minuteString} ${secondString && `:${secondString}`}`
    }

    return secondString
}

export const convertSecondIntoDayHourMinSec = (seconds) => {
    if (seconds && seconds != 0 && seconds > 0) {
        var days = Math.floor(seconds / (24 * 3600));
        var hours = Math.floor((seconds % (24 * 3600)) / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var remainingSeconds = seconds % 60;

        var result = "";
        if (days > 0) result += days + "d ";
        if (hours > 0) result += hours + "h ";
        if (minutes > 0) result += minutes + "m ";
        if (remainingSeconds > 0) result += remainingSeconds + "s";

        return result.trim();
    } else {
        return "--";
    }
}