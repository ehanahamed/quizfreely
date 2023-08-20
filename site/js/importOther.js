/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

document
  .getElementById(ui.elements.importOther.button)
  .addEventListener("click", function () {
    var data = [];
    var rows;
    if (
      document.getElementById(ui.elements.importOther.rowDelimiter).value == ""
    ) {
      /* split by newline if blank */
      rows = document
        .getElementById(ui.elements.importOther.data)
        .value.split("\n");
    } else {
      rows = document
        .getElementById(ui.elements.importOther.data)
        .value.split(
          document.getElementById(ui.elements.importOther.rowDelimiter).value
        );
    }
    for (var i = 0; i < rows.length; i++) {
      data.push(
        rows[i].split(
          document.getElementById(ui.elements.importOther.termDelimiter).value
        )
      );
    }
    /* make default studyset first */
    sessionData.studySetData = studySet.make();
    /* add imported data to studyset */
    sessionData.studySetData.data = data;
    /* load it into the table, with noTitle param as true */
    edit.load(true);
    sections.changeTo("edit");
  });
