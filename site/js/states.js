var states = {
    newUser: function (isNewUser) {
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
    }
  }
  