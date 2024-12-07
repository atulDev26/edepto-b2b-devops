
export function getDateFromDateISOString(dateString) {
    if (!dateString) {
        return null;
    }
    const dateTime = new Date(dateString);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

