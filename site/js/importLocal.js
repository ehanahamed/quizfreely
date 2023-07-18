/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

ui.inputs.importLocal.file.addEventListener("change", function () {
  importLocal.input();
});

var importLocal = {
  input: function () {
    var fileReader = new FileReader();
    fileReader.addEventListener("load", function (event) {
      sessionData.importLocal.fileData = event.target.result;
      /*alerts.clear();
            if (studySet.validate(sessionData.importLocal.fileData) === true) {
                alerts.show("successImport");*/
      studySet.load(sessionData.importLocal.fileData);
      localStorage.setItem(
        "currentStudyset",
        JSON.stringify(sessionData.studySetData)
      );
      sessionData.flashcards.index = 0;
      flashcards.load(sessionData.flashcards.index);
      sections.changeTo("open");
      document.getElementById("mainActionsStudysettitle").innerText =
        sessionData.studySetData.name;
      for (var i = 0; i < sessionData.studySetData.data.length; i++) {
        var newRow = document
          .getElementById("mainActionsTable")
          .insertRow(
            document.getElementById("mainActionsTable").rows.length - 1
          );
        newRow.insertCell(0).innerHTML = sessionData.studySetData.data[i][0];
        newRow.insertCell(1).innerHTML = sessionData.studySetData.data[i][1];
      }
      document.getElementById("mainActionsSave").classList.add("hide");
      /*
            } else {
                alerts.show("errorImport");
            }*/
    });
    fileReader.readAsText(ui.inputs.importLocal.file.files[0]);
  },
};
