/*!
Quizfreely (https://quizfreely.ehan.dev)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var exportLocal = {
  save: function () {
    elements.buttons.exportLocal.download.href = exportLocal.makeBlobUrl(JSON.stringify(studySetData), "application/json");
  },
  makeBlobUrl: function (content, mimetype) {
    return URL.createObjectURL(new Blob([content], { type: mimetype }));
  }
}
