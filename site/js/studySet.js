/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

var studySet = {
  make: function () {
    return {
      quizfreely: "Quizfreely",
      name: "",
      creator: "",
      settings: {
        public: false,
      },
      data: [],
    };
  },
  load: function (importContent) {
    sessionData.studySetData = JSON.parse(importContent);
  },
  validate: function (importContent) {
    function isJson(string) {
      try {
        JSON.parse(string);
      } catch (error) {
        return false;
      }
      return true;
    }
    if (
      isJson(importContent) === true &&
      JSON.parse(importContent).quizfreely === "Quizfreely"
    ) {
      return true;
    } else {
      return false;
    }
  },
  /*
  Example

  {
    quizfreely: "Quizfreely",
    name: "Some Name",
    creator: "Someone",
    settings: {
      "debug": false,
    },
    metadata: "20230307",
    data: [
      ["term","definition"],
      ["there are","arrays in this array for each row of the table"]
    ]
  }
  
  */
  open: function () {
    /* reset/rehide "i am saved" popup */
    ui.elements.open.saveDone.classList.add("hide");
    /* IMPORTANT: line below clears the old data from table before displaying data in it */
    document.getElementById("mainActionsTable").innerHTML =
      "<thead> <tr> <th>Term</th> <th>Definition</th> </tr> </thead> <tbody> <tr> <td> <button onclick='buttons.open.edit();'> Edit </button> </td> <td></td> </tr> </tbody>";
    /*
      IMPORTANT: the string above has the inner html of a table found in dashboard.html
      if the HTML of the table is updated there, update it here too!
    */
    sessionData.flashcards.index = 0;
    flashcards.load(sessionData.flashcards.index);
    sections.changeTo("open");
    document.getElementById("mainActionsStudysettitle").innerText =
      sessionData.studySetData.name;
    for (var i = 0; i < sessionData.studySetData.data.length; i++) {
      var newRow = document
        .getElementById("mainActionsTable")
        .insertRow(document.getElementById("mainActionsTable").rows.length - 1);
      newRow.insertCell(0).innerText = sessionData.studySetData.data[i][0];
      newRow.insertCell(1).innerText = sessionData.studySetData.data[i][1];
    }
    /* IMPORTANT:
      after the screen switches to sections.changeTo("open") and ...mainActionsSave").classList.remove("hide") (the code above),
      the edit section will still have the current study set inside of its table, it will just be hidden,
      if the user goes back to the edit screen without refreshing, it will load the study set again, and the table will be duplicated

      to prevent this,
      the code below clears/resets the table
    */
    ui.elements.edit.table.innerHTML =
      "<thead> <tr> <th class='center'>Term</th> <th class='center'>Definition</th> <th class='center'>Actions</th> </tr> </thead> <tbody> <tr> <td> <div class='flex'> <button onclick='buttons.edit.add();'> <i class='nf nf-oct-plus'></i> Add row </button> </div> </td> <td></td> <td></td> </tr> </tbody>";
    /* IMPORTANT: the string above has the inner html of the table found in dashboard.html */
    ui.elements.edit.settings.public.true.checked = sessionData.studySetData.settings.public;
  },
  getSettings: function () {
    return {
      public: (ui.elements.edit.settings.public.true.checked === true)
    };
  },
};
