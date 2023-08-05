/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

if (location.pathname.includes("explore") === true) {
  let urlParams = new URLSearchParams(document.location.search);
  let id = urlParams.get("id");
  supabaseClient
    .from("explore")
    .select()
    .eq("id", id)
    .then(function (result) {
      var thisStudySet = result.data[0];
      sessionData.studySetData = thisStudySet;
      studySet.open();
      document.getElementById("mainActionsSave").classList.add("hide");
      supabaseClient.auth.getSession().then(function (result) {
        if (result.data.session === null) {
          states.isSetMine(false);
        } else if (result.data.session !== null) {
          if (thisStudySet.user_id == result.data.session.user.id) {
            states.isSetMine(true);
          } else {
            states.isSetMine(false);
          }
        }
      });
    });
} else if (location.pathname.includes("explore") === false) {
  states.isSetMine(true);
}
