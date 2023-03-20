/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var exportLocal = {
  save: function () {
    elements.links.exportLocal.download.href = exportLocal.makeBlobUrl(JSON.stringify(studySetData), "application/json");
    elements.links.exportLocal.download.download = studySetData.name + ".json"
  },
  makeBlobUrl: function (content, mimetype) {
    return URL.createObjectURL(new Blob([content], { type: mimetype }));
  }
}
