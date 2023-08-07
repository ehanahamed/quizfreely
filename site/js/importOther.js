/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

document.getElementById(ui.elements.importOther.button).addEventListener(
  "click",
  function () {
    var data = [];
    var rows = document.getElementById(ui.elements.importOther.data).value.split(
      document.getElementById(ui.elements.importOther.rowDelimiter).value
    );
    for (var i = 0; i < rows.length; i++) {
      data.push(
        rows[i].split(
          document.getElementById(ui.elements.importOther.termDelimiter).value
        )
      );
    }
    sessionData.studySetData = {
      quizfreely: "Quizfreely",
      name: "",
      settings: {
        public: false,
      },
      data: data
    };
    edit.load(true);
  }
)
