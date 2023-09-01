/*
  Quizfreely
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/LICENSE.txt
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
