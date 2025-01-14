export const fancyTimestamp = {
    hours: 0, /* 24 or 12, any other value will use locale's default */
    format: function (dateStringOrObj) {
        var dateObj = new Date(dateStringOrObj)
        var now = new Date();
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var intlDate = new Intl.DateTimeFormat(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
        var intlTimeOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        if (fancyTimestamp.hours == 24) {
            intlTimeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            };
        } else if (fancyTimestamp.hours == 12) {
            intlTimeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
        }
        var intlTime = new Intl.DateTimeFormat(
            undefined,
            intlTimeOptions
        );
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
}
