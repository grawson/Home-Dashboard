export const getPaddedMonth = (date: Date) => {
    return ('0' + (date.getMonth() + 1)).slice(-2);
};
export const getPaddedDay = (date: Date) => {
    return ('0' + date.getDate()).slice(-2);
};

export const getNextDayOfWeek = (date: Date, dayOfWeek: number) => {
    const resultDate = new Date(date.getTime());

    resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));

    return resultDate;
};

export const getFormattedDateForYINR = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const formattedDate = year + '-' + month + '-' + day;

    return formattedDate;
};
