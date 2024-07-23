exports.getPaddedMonth = date => {
	return ('0' + (date.getMonth() + 1)).slice(-2);
};
exports.getPaddedDay = date => {
	return ('0' + date.getDate()).slice(-2);
};

exports.getNextDayOfWeek = (date, dayOfWeek) => {
	const resultDate = new Date(date.getTime());

	resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));

	return resultDate;
};

exports.getFormattedDateForYINR = date => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');

	const formattedDate = year + '-' + month + '-' + day;

	return formattedDate;
};
