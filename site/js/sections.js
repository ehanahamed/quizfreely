/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var sections = {
    init: function () {
        elements.sections.load.style.display = "block";
        elements.sections.importOptions.style.display = "none";
        elements.sections.actionOptions.style.display = "none";
        elements.sections.edit.style.display = "none";
        elements.sections.exportOptions.style.display = "none";
        elements.sections.exportLocal.style.display = "none";
        elements.sections.reviewOptions.style.display = "none";
        elements.sections.flashcards.style.display = "none";
    },
    changeTo: function (section) {
        elements.sections.load.style.display = "none";
        elements.sections.importOptions.style.display = "none";
        elements.sections.actionOptions.style.display = "none";
        elements.sections.edit.style.display = "none";
        elements.sections.exportOptions.style.display = "none";
        elements.sections.exportLocal.style.display = "none";
        elements.sections.reviewOptions.style.display = "none";
        elements.sections.flashcards.style.display = "none";
        elements.sections[section].style.display = "block";
    }
}
