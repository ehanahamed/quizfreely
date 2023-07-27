/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var sections = {
  changeTo: function (section) {
    ui.elements.sections.dashboard.classList.add("hide");
    ui.elements.sections.open.classList.add("hide");
    ui.elements.sections.edit.classList.add("hide");
    ui.elements.sections[section].classList.remove("hide");
  },
};
