/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var alerts = {
    init: function () {
        alerts.clear();
    },
    clear: function () {
        elements.alerts.successImport.classList.add("hide");
        elements.alerts.errorImport.classList.add("hide");
        elements.alerts.flashcardsEnd.classList.add("hide");
    },
    show: function (alert) {
        elements.alerts[alert].classList.remove("hide");
    }
}
