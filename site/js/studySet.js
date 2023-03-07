/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var studySet = {
  create: function (metadata) {
    return {
      quizfreely: "Quizfreely",
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
      set: []
    }
  },
}
