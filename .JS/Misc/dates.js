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
