/*
  Quizfreely
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.com/LICENSE.txt
*/

document
  .getElementById(ui.elements.inputs.importLocal.file)
  .addEventListener("change", function() {
    importLocal.input();
  });

var importLocal = {
  input: function() {
    var fileReader = new FileReader();
    fileReader.addEventListener("load", function(
    event) {
      sessionData.importLocal.fileData = event
        .target.result;
      /*alerts.clear();
            if (studySet.validate(sessionData.importLocal.fileData) === true) {
                alerts.show("successImport");*/
      studySet.load(sessionData.importLocal
        .fileData);
      studySet.open();
      document.getElementById("mainActionsSave")
        .classList.add("hide");
    });
    fileReader.readAsText(
      document.getElementById(ui.elements.inputs
        .importLocal.file).files[
        0]
    );
  },
};
