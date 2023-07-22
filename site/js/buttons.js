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
      /* IMPORTANT: line below clears the old data from table before displaying data in it */
      //document.getElementById("mainActionsTable") = "<thead> <tr> <th>Term</th> <th>Definition</th> </tr> </thead> <tbody> <tr> <td> <button onclick='buttons.open.edit();'> Edit </button> </td> <td></td> </tr> </tbody>";
      /*
        IMPORTANT: the string above has the inner html of a table found in dashboard.html
        if the HTML of the table is updated there, update it here too!
      */
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
      /* IMPORTANT:
        after the screen switches to sections.changeTo("open") and ...mainActionsSave").classList.remove("hide") (the code above),
        the edit section will still have the current study set inside of its table, it will just be hidden,
        if the user goes back to the edit screen without refreshing, it will load the study set again, and the table will be duplicated

        to prevent this,
        the code below clears/resets the table
      */
      document.getElementById("inputEditTable").innerHTML = "<thead> <tr> <th>Term</th> <th>Definition</th> <th>Actions</th> </tr> </thead> <tbody> <tr> <td> <div class='flex'> <button onclick='buttons.edit.add();'> <i class='nf nf-oct-plus'></i> Add row </button> <button id='buttonEditDone' class='alt' onclick='buttons.edit.done()' > <i class='nf nf-oct-check'></i> Done </button> </div> </td> <td></td> <td></td> </tr> </tbody>";
      /* IMPORTANT: the string above has the inner html of the table found in dashboard.html */
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
