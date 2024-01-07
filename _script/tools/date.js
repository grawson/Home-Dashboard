exports.getPaddedMonth = date => {
    return ("0" + (date.getMonth() + 1)).slice(-2)
}
exports.getPaddedDay = date => {
    return ("0" + date.getDate()).slice(-2)
}
