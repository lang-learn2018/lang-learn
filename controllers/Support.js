exports.getCurrDateFormatted = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return `${year}-${month}-${day}`;
}
exports.getCurrentTimeFormatted = function () {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return `${hour}:${minute}:${second}`;
}
/**
 *
 * adds current date to the end of the stringified array of dates;
 * if length of array more than MAX_ARR_CAPACITY, removes first
 * array date-element;
 * @param dates
 * @return strigified array of dates with max length == MAX_ARR_CAPACITY
 */
exports.addCurrentDate = function (dates) {
    const MAX_ARR_CAPACITY = 7;
    var currentDate = new Date();
    var dates = JSON.parse(dates);
    if (dates.length > MAX_ARR_CAPACITY) {
        dates.shift();
    }
    dates.push(currentDate);
    dates = JSON.stringify(dates);
    return dates;
};











