/**
 * Quizlate - serverlessDownload.js (https://quizlate.ehan.dev)
 *
 * Copyright (c) 2022 Ehan Ahamed and contributors
 * Licensed under the UPL-1.0 License
 * See license file: https://projects.ehan.dev/Quizlate/LICENSE.txt
**/

function serverlessDownload(content, mimetype, filename){
  var downloadPrompt = document.createElement('a')
  var downloadBlob = new Blob([content], {type: mimeType})
  var downloadUrl = URL.createObjectURL(downloadBlob)
  downloadPrompt.setAttribute('href', downloadUrl)
  downloadPrompt.setAttribute('download', filename)
  downloadPrompt.click()
}

// this is the mimetype for json btw: application/json
