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
      for (var i = 0; i < ui.elements.states.user.length; i++) {
        ui.elements.states.user[i].classList.add("hide");
      }
    } else if (isNewUser === false) {
      for (var i = 0; i < ui.elements.states.newUser.length; i++) {
        ui.elements.states.newUser[i].classList.add("hide");
      }
      for (var i = 0; i < ui.elements.states.user.length; i++) {
        ui.elements.states.user[i].classList.remove("hide");
      }
    }
    if (ui.states) {
      /* first check if page-specific functions exist */
      /* then run page specific functions */
      ui.states.newUser(isNewUser);
    }
  },
  isSetMine: function (isSetMine) {
    if (isSetMine === true) {
      for (var i = 0; i < ui.elements.states.setIsMine.length; i++) {
        ui.elements.states.setIsMine[i].classList.remove("hide");
      }
      for (var i = 0; i < ui.elements.states.setIsNotMine.length; i++) {
        ui.elements.states.setIsNotMine[i].classList.add("hide");
      }
    } else if (isSetMine === false) {
      for (var i = 0; i < ui.elements.states.setIsMine.length; i++) {
        ui.elements.states.setIsMine[i].classList.add("hide");
      }
      for (var i = 0; i < ui.elements.states.setIsNotMine.length; i++) {
        ui.elements.states.setIsNotMine[i].classList.remove("hide");
      }
    }
  },
};
