/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var sections = {
  changeTo: function (section) {
    ui.sections.dashboard.classList.add("hide");
    ui.sections.open.classList.add("hide");
    ui.sections.edit.classList.add("hide");
    ui.sections.save.classList.add("hide");
    ui.sections[section].classList.remove("hide");
  },
};
