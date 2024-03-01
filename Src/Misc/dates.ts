const FormatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    return month + '/' + day + '/' + year;
}

//Add days to given date without mutating original variable
const AddDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return new Date(result);
}