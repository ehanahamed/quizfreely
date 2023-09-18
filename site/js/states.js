/*
  Quizfreely
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/LICENSE.txt
*/

var states = {
  newUser: function (isNewUser) {
    states.current.isNewUser = isNewUser;
    /* hide and show depending on state (all pages) */
    if (isNewUser === true) {
      if (ui.elements.states.newUser) {
        for (var i = 0; i < ui.elements.states.newUser.length; i++) {
          document
            .getElementById(ui.elements.states.newUser[i])
            .classList.remove("hide");
        }
      }
      if (ui.elements.states.user) {
        for (var i = 0; i < ui.elements.states.user.length; i++) {
          document
            .getElementById(ui.elements.states.user[i])
            .classList.add("hide");
        }
      }
    } else if (isNewUser === false) {
      if (ui.elements.states.newUser) {
        for (var i = 0; i < ui.elements.states.newUser.length; i++) {
          document
            .getElementById(ui.elements.states.newUser[i])
            .classList.add("hide");
        }
      }
      if (ui.elements.states.user) {
        for (var i = 0; i < ui.elements.states.user.length; i++) {
          document
            .getElementById(ui.elements.states.user[i])
            .classList.remove("hide");
        }
      }
    }
    if (ui.states) {
      /* first check if page-specific functions exist */
      /* then run page specific functions */
      ui.states.newUser(isNewUser);
    }
  },
  isSetMine: function (isSetMine) {
    states.current.isSetMine = isSetMine;
    if (isSetMine === true) {
      if (ui.elements.states.setIsMine) {
        for (var i = 0; i < ui.elements.states.setIsMine.length; i++) {
          document
            .getElementById(ui.elements.states.setIsMine[i])
            .classList.remove("hide");
        }
      }
      if (ui.elements.states.setIsNotMine) {
        for (var i = 0; i < ui.elements.states.setIsNotMine.length; i++) {
          document
            .getElementById(ui.elements.states.setIsNotMine[i])
            .classList.add("hide");
        }
      }
    } else if (isSetMine === false) {
      if (ui.elements.states.setIsMine) {
        for (var i = 0; i < ui.elements.states.setIsMine.length; i++) {
          document
            .getElementById(ui.elements.states.setIsMine[i])
            .classList.add("hide");
        }
      }
      if (ui.elements.states.setIsNotMine) {
        for (var i = 0; i < ui.elements.states.setIsNotMine.length; i++) {
          document
            .getElementById(ui.elements.states.setIsNotMine[i])
            .classList.remove("hide");
        }
      }
    }
  },
  isSetLarge: function (isSetLarge) {
    states.current.isSetLarge = isSetLarge;
    if (isSetLarge) {
      if (ui.elements.states.setIsLarge) {
        for (var i = 0; i < ui.elements.states.setIsLarge.length; i++) {
          document
            .getElementById(ui.elements.states.setIsLarge[i])
            .classList.remove("hide");
        }
      }
      if (ui.elements.states.setIsNotLarge) {
        for (var i = 0; i < ui.elements.states.setIsNotLarge.length; i++) {
          document
            .getElementById(ui.elements.states.setIsNotLarge[i])
            .classList.add("hide");
        }
      }
    } else if (isSetLarge === false) {
      if (ui.elements.states.setIsLarge) {
        for (var i = 0; i < ui.elements.states.setIsLarge.length; i++) {
          document
            .getElementById(ui.elements.states.setIsLarge[i])
            .classList.add("hide");
        }
      }
      if (ui.elements.states.setIsNotLarge) {
        for (var i = 0; i < ui.elements.states.setIsNotLarge.length; i++) {
          document
            .getElementById(ui.elements.states.setIsNotLarge[i])
            .classList.remove("hide");
        }
      }
    }
  },
  current: {},
};
