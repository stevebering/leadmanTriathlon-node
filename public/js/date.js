/**
 * Created by stevebering on 12/27/13.
 */
moment.duration.fn.format = function (zeros, twoDigit) {
    var hours = this.hours(), minutes = this.minutes(), seconds = this.seconds();
    var displayFormat = '', zerosFormat = twoDigit ? '00' : '0', padLeft = twoDigit ? -2 : -1;

    if (hours || zeros) {
        displayFormat += (zerosFormat + hours).slice(padLeft) + ':';
    }

    if (minutes || zeros) {
        displayFormat += (zerosFormat + minutes).slice(padLeft) + ':';
    }

    if (seconds || zeros) {
        displayFormat += (zerosFormat + seconds).slice(padLeft);
    }

    return $.trim(displayFormat);
}