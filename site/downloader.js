/*!
Quizfreely (https://quizfreely.ehan.dev)

Copyright (c) 2022 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var download = {
  makeBlob: function (content, mimetype) {
    return new Blob([content], { type: mimetype })
  },
  makeBlobUrl: function (content, mimetype, filename) {
    return URL.createObjectURL(new Blob([content], { type: mimetype }));
  }
}
