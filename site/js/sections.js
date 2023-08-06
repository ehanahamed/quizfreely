/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

var sections = {
  changeTo: function (section) {
    document
      .getElementById(ui.elements.sections.dashboard)
      .classList.add("hide");
    document.getElementById(ui.elements.sections.open).classList.add("hide");
    document.getElementById(ui.elements.sections.edit).classList.add("hide");
    document
      .getElementById(ui.elements.sections[section])
      .classList.remove("hide");
  },
};
