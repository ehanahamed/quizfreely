/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var studySet = {
  make: function (settings, metadata) {
    return {
      quizfreely: "Quizfreely",
      name: "",
      creator: "",
      settings: settings,
      metadata: metadata,
      data: []
    }
  },
  /*
  Example

  {
    quizfreely: "Quizfreely",
    name: "Some Name",
    creator: "Someone",
    settings: {
      "debug": false,
    },
    metadata: "20230307",
    data: [
      ["term","definition"],
      ["there are","arrays in this array for each row of the table"]
    ]
  }
  
  */
}
