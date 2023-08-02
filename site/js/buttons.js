/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

var buttons = {
  load: {
    make: function () {
      edit.make();
      sections.changeTo("edit");
    },
  },
  open: {
    edit: function () {
      edit.load();
      sections.changeTo("edit");
      //alerts.clear();
    },
    flashcards: function () {
      sessionData.flashcards.index = 0;
      flashcards.load(sessionData.flashcards.index);
      sections.changeTo("flashcards");
    },
  },
  edit: {
    add: function () {
      edit.add();
    },
    done: function () {
      /* the snippet below usually has sessionData.studySetData = ..., in this case, that line is in edit.js's edit.save() funciton, which is called/ran below */
      edit.save();
      isStudySetCopy(sessionData.studySetData.name, function (isStudySetCopy) {
        if (isStudySetCopy === true) {
          ui.elements.edit.studySetIsCopy.classList.remove("hide");
          ui.elements.edit.studySetIsCopyButtons.update.addEventListener(
            "click",
            function () {
              /* code here is also (1) */
              /* updateStudySet() & isStudySetCopy() are in js/supabase.js */
              updateStudySet();
              studySet.open();
            }
          );
          ui.elements.edit.studySetIsCopyButtons.back.addEventListener(
            "click",
            function () {
              ui.elements.edit.studySetIsCopy.classList.add("hide");
            }
          )
        } else if (isStudySetCopy === false) {
          /* is also here (1) */
          studySet.open();
          /* NOT including next line (1) */
          document.getElementById("mainActionsSave").classList.remove("hide");
        }
      });
    },
  },
  save: {},
  flashcards: {
    flip: function () {
      flashcards.flip();
    },
    prev: function () {
      flashcards.prev();
    },
    next: function () {
      flashcards.next();
    },
  },
};
