/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var sections = {
    changeTo: function (section) {
        elements.sections.dashboard.classList.add("hide");
        elements.sections.actionOptions.classList.add("hide");
        elements.sections.edit.classList.add("hide");
        elements.sections.exportOptions.classList.add("hide");
        elements.sections.flashcards.classList.add("hide");
        elements.sections[section].classList.remove("hide");
    }
}
