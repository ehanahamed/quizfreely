function fancyTimestamp(dateObj) {
    var now = new Date();
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var intlDate = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    });
    var intlTime = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
    var intlRelative = new Intl.RelativeTimeFormat(undefined, {
        numeric: "auto"
    });
    if (
        now.getFullYear() == dateObj.getFullYear() &&
        now.getMonth() == dateObj.getMonth() &&
        now.getDate() == dateObj.getDate()
    ) {
        return intlRelative.format(0, "days") + " " + intlTime.format(dateObj);
    } else if (
        yesterday.getFullYear() == dateObj.getFullYear() &&
        yesterday.getMonth() == dateObj.getMonth() &&
        yesterday.getDate() == dateObj.getDate()
    ) {
        return intlRelative.format(-1, "day") + " " + intlTime.format(dateObj);
    } else {
        return intlDate.format(dateObj);
    }
}
