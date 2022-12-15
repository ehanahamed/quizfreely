/**
 * Quizlate - serverlessDownload.js (https://quizlate.ehan.dev)
 *
 * Copyright (c) 2022 Ehan Ahamed and contributors
 * Licensed under the UPL-1.0 License
 * See license file: https://projects.ehan.dev/Quizlate/LICENSE.txt
**/

function serverlessDownload(content, mimetype, filename){
  var downloadBlob = new Blob([content], {type: mimeType});
  return URL.createObjectURL(downloadBlob);
}

// this is the mimetype for json btw: application/json
// use attribute "href" set to downloadUrl (downloadUrl is returned by this function)
// use attribute "download" set to filename, use attribute on download button ("a" tag)
