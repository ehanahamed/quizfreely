/*
  Quizfreely
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.com/LICENSE.txt
*/

var exportLocal = {
  save: function() {
    document.getElementById(
      ui.elements.links.exportLocal.newUserDownload
    ).href = exportLocal.makeBlobUrl(
      JSON.stringify(sessionData.studySetData),
      "application/json"
    );
    document.getElementById(ui.elements.links
        .exportLocal.userDownload)
      .href =
      exportLocal.makeBlobUrl(
        JSON.stringify(sessionData.studySetData),
        "application/json"
      );
    document.getElementById(
        ui.elements.links.exportLocal.newUserDownload
      ).download = sessionData.studySetData.name +
      ".json";
    document.getElementById(
        ui.elements.links.exportLocal.userDownload
      ).download = sessionData.studySetData.name +
      ".json";
  },
  makeBlobUrl: function(content, mimetype) {
    return URL.createObjectURL(new Blob([content], {
      type: mimetype
    }));
  },
};
