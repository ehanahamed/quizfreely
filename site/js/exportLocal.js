/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

var exportLocal = {
  save: function () {
    ui.elements.links.exportLocal.download.href = exportLocal.makeBlobUrl(
      JSON.stringify(sessionData.studySetData),
      "application/json"
    );
    ui.elements.links.exportLocal.download.download =
      sessionData.studySetData.name + ".json";
  },
  makeBlobUrl: function (content, mimetype) {
    return URL.createObjectURL(new Blob([content], { type: mimetype }));
  },
};
