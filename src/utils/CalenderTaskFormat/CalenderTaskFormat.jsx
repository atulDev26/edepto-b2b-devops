export const dateReturnForCalendar = (date) => {
    date = date.replace("Z", "");
    date = date + "+05:30"
    return date;
}