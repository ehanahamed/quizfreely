/*
downloadstuff work in progres thingy (https://quizlate.ehan.dev)

Copyright (c) 2022 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://projects.ehan.dev/Quizlate/LICENSE.txt
*/

var downloader = {
  makeBlob: function (content, mimetype) {
    return new Blob([content], { type: mimetype })
  },
  makeBlobUrl: function (content, mimetype, filename) {
    return URL.createObjectURL(new Blob([content], { type: mimetype }));
  }
}

// this is the mimetype for json btw: application/json
// use attribute "href" set to downloadUrl (downloadUrl is returned by this function)
// use attribute "download" set to filename, use attribute on download button ("a" tag)
