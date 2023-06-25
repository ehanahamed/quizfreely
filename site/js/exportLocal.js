/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var exportLocal = {
  save: function () {
    ui.links.exportLocal.download.href = exportLocal.makeBlobUrl(JSON.stringify(sessionData.studySetData), "application/json");
    ui.links.exportLocal.download.download = sessionData.studySetData.name + ".json"
  },
  makeBlobUrl: function (content, mimetype) {
    return URL.createObjectURL(new Blob([content], { type: mimetype }));
  }
}
