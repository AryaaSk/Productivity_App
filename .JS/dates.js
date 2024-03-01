"use strict";
const FormatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();
    return month + '/' + day + '/' + year;
};
const AddDays = (date, days) => {
    const result = date.setDate(date.getDate() + days);
    return new Date(result);
};
