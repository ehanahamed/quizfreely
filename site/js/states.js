/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

var states = {
  newUser: function (isNewUser) {
    /* hide and show depending on state (all pages) */
    if (isNewUser === true) {
      for (var i = 0; i < ui.elements.states.newUser.length; i++) {
        ui.elements.states.newUser[i].classList.remove("hide");
      }
      for (var i2 = 0; i2 < ui.elements.states.user.length; i2++) {
        ui.elements.states.user[i2].classList.add("hide");
      }
    } else if (isNewUser === false) {
      for (var i3 = 0; i3 < ui.elements.states.newUser.length; i3++) {
        ui.elements.states.newUser[i3].classList.add("hide");
      }
      for (var i4 = 0; i4 < ui.elements.states.user.length; i4++) {
        ui.elements.states.user[i4].classList.remove("hide");
      }
    }
    if (ui.states) {
      /* first check if page-specific functions exist */
      /* then run page specific functions */
      ui.states.newUser(isNewUser);
    }
  },
  newToThemes: function (isNewToThemes) {
    if (isNewToThemes === true) {
      for (var i5 = 0; i < ui.elements.states.newToThemes.length; i++) {
        ui.elements.states.newToThemes[i].classList.remove("hide");
      }
    } else if (isNewToThemes === false) {
      for (var i6 = 0; i < ui.elements.states.newToThemes.length; i++) {
        ui.elements.states.newToThemes[i].classList.add("hide");
      }
    }
  }
};
