const getPaddedMonth = date => {
    return ("0" + (date.getMonth() + 1)).slice(-2)
}
const getPaddedDay = date => {
    return ("0" + this.getDate()).slice(-2)
}
