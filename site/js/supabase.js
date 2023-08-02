/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

const { createClient } = supabase;
const supabaseClient = createClient(
  "https://okejqkisolxqgkgwwlbz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZWpxa2lzb2x4cWdrZ3d3bGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3NDE1MTgsImV4cCI6MjAwMTMxNzUxOH0.T8f_3fPAYnWdzguPonQZCAFmbAN-mTLQB3_EW9pjkis"
);

if (typeof states !== "undefined") {
  supabaseClient.auth.getSession().then(function (result) {
    if (result.data.session === null) {
      states.newUser(true);
    } else if (result.data.session !== null) {
      states.newUser(false);
    }
  });
}

function isStudySetCopy(studySetName, returnFunction) {
  supabaseClient.auth.getSession().then(function (result) {
    if (result.data.session === null) {
      returnFunction(false);
    } else if (result.data.session !== null) {
      supabaseClient.from("studyset").select().eq("name", studySetName).then(
        function (result) {
          if (result.data.length === 0) {
            returnFunction(false);
          } else if (result.data.length > 0) {
            returnFunction(true);
          }
        }
      )
    }
  });
}

function updateStudySet() {
  supabaseClient.from("studyset").update({ json: sessionData.studySetData }).eq("name", sessionData.studySetData.name).then(
    function (result) {
      console.log("ran update() on " + sessionData.studySetData.name + "with result:")
      console.log(result);
    }
  )
}

function getNickname(returnFunction) {
  supabaseClient.auth.getSession().then(function (result) {
    if (result.data.session.user.user_metadata.hasOwnProperty("quizfreelyNickname") === true) {
      returnFunction(result.data.session.user.user_metadata.quizfreelyNickname);
    } else if (result.data.session.user.app_metadata.provider === "email") {
      returnFunction(result.data.user.email.replace("quizfreelyuser", "").replace("@ehan.dev", ""));
    } else if (result.data.session.user.user_metadata.hasOwnProperty("name") === true) {
      returnFunction(result.data.user.user_metadata.name);
    }
  });
}
