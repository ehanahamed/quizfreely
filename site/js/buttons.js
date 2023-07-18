/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
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
      alerts.clear();
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
      edit.save();
      /* the snippet below usually has sessionData.studySetData = ..., in this case, that line is in edit.js's edit.save() funciton */
      sessionData.flashcards.index = 0;
      flashcards.load(sessionData.flashcards.index);
      sections.changeTo("open");
      document.getElementById(
        "mainActionsStudysettitle"
      ).innerText = sessionData.studySetData.name;
      for (
        var i = 0;
        i < sessionData.studySetData.data.length;
        i++
      ) {
        var newRow = document
          .getElementById("mainActionsTable")
          .insertRow(
            document.getElementById("mainActionsTable").rows
              .length - 1
          );
        newRow.insertCell(0).innerHTML =
          sessionData.studySetData.data[i][0];
        newRow.insertCell(1).innerHTML =
          sessionData.studySetData.data[i][1];
      }
      document.getElementById("mainActionsSave").classList.remove("hide");
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
