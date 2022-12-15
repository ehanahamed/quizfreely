/**
 * Quizlate (https://quizlate.ehan.dev)
 *
 * Copyright (c) 2022 Ehan Ahamed and contributors
 * Licensed under the UPL-1.0 License
 * See license file: https://projects.ehan.dev/Quizlate/LICENSE.txt
**/

var studySet = {
  create: function (metadata) {
    return {
      quizlate: "Quizlate",
      metadata: metadata,
      name: "Study Set Name",
      creator: "Creator",
      description: "Description",
      settings: {
        debug: false,
        type: "generic",
        creator: true,
        vocab: false
      },
      set: [{
          term: "Example Term",
          term: "Example Definition"
        }
      ]
    }
  },
  validate: function (studySet) {
    if (studySet.quizlate !== "Quizlate") {
      return {
        valid: false,
        error: "Study Set imported is not in a Quizlate-generated format",
        debug: "Study Set imported contains valid JSON, but does not have correct value for the json key: `quizlate`. This likley means the imported JSON was not generated by Quizlate."
      }
    }
    if (studySet !== {
      metadata: metadata,
      name: name,
      creator: creator,
      description: description,
      settings: settings,
      set: set
    }) {
      return {
        valid: false,
        error: "Study Set imported is not supported. If you are using the Quizlate app, try installing the latest update."
        debug: "Study Set imported contains valid JSON, and has correct value for the json key: `quizlate`. However, the json contains extra keys and values that this version of Quizlet does not support. The Quizlate website automatically fetches the latest update from GitHub and is hosted using Netlify. The Quizlate app loads itself locally, so try updating to the latest version if you are using the app."
      }
    }
  }
}
