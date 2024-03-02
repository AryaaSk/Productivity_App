"use strict";
const FormatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    return month + '/' + day + '/' + year;
};
//Add days to given date without mutating original variable
const AddDays = (date, days) => {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return new Date(result);
};
function ConvertToFullDate(dateStr) {
    if (dateStr == "-") {
        return "-"; //nextIteration may be '-' for oneTime events
    }
    try {
        // Parse the string date into a Date object
        var dateParts = dateStr.split('/');
        var month = parseInt(dateParts[0], 10);
        var day = parseInt(dateParts[1], 10);
        var year = parseInt(dateParts[2], 10);
        var dateObj = new Date(year, month - 1, day); // month is zero-based in JavaScript
        // Array of month names
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // Construct the full written date
        var fullDate = monthNames[dateObj.getMonth()] + ' ' + dateObj.getDate() + ', ' + dateObj.getFullYear();
        return fullDate;
    }
    catch (error) {
        return "Invalid date format. Please provide the date in the format mm/dd/yyyy.";
    }
}
const GetNextDateOnDay = (currentDate, specificDaysAvailable) => {
    //need to find next day in the week; if specificDaysAvailable = [0, 3] then we are looking for the next Sunday or Wednesday
    const currentDayIndex = currentDate.getDay();
    let nextClosetDayDifference = Infinity; //default marker
    for (const dayIndex of specificDaysAvailable) {
        const difference = dayIndex - currentDayIndex;
        if (difference > 0 && difference < nextClosetDayDifference) {
            nextClosetDayDifference = difference;
        }
    }
    if (nextClosetDayDifference == Infinity) {
        nextClosetDayDifference = (7 - currentDayIndex) + specificDaysAvailable[0];
    }
    return AddDays(currentDate, nextClosetDayDifference);
};
