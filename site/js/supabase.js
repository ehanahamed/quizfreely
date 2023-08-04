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
      supabaseClient
        .from("studyset")
        .select()
        .eq("name", studySetName)
        .then(function (result) {
          if (result.data.length === 0) {
            returnFunction(false);
          } else if (result.data.length > 0) {
            returnFunction(true);
          }
        });
    }
  });
}

function updateStudySet() {
  supabaseClient
    .from("studyset")
    .update({ json: sessionData.studySetData })
    .eq("name", sessionData.studySetData.name)
    .then();
  if (sessionData.studySetData.settings.public === true) {
    supabaseClient.auth.getUser().then(function (result) {
      userId = result.data.user.id;
    });

    supabaseClient
      .from("explore")
      .select()
      .eq("user_id", userId)
      .eq("name", sessionData.studySetData.name)
      .then(
        function (result) {
          if (result.data.length === 0) {
            supabaseClient
              .from("explore")
              .insert({
                user_id: userId,
                name: sessionData.studySetData.name,
                json: sessionData.studySetData,
              })
              .then();
          } else {
            supabaseClient
              .from("explore")
              .update({ json: sessionData.studySetData })
              .eq("name", sessionData.studySetData.name)
              .then();
          }
        }
      )
  } else {
    /* if its not public in settings, but the set is in explore from a previous save, delete it from explore */
    supabaseClient
      .from("explore")
      .delete()
      .eq("user_id", userId)
      .eq("name", sessionData.studySetData.name)
      .then();
  }
}

function getNickname(returnFunction) {
  supabaseClient.auth.getSession().then(function (result) {
    if (
      result.data.session.user.user_metadata.hasOwnProperty(
        "quizfreelyNickname"
      ) === true
    ) {
      returnFunction(result.data.session.user.user_metadata.quizfreelyNickname);
    } else if (result.data.session.user.app_metadata.provider === "email") {
      returnFunction(
        result.data.session.user.email
          .replace("quizfreelyuser", "")
          .replace("@ehan.dev", "")
      );
    } else if (
      result.data.session.user.user_metadata.hasOwnProperty("name") === true
    ) {
      returnFunction(result.data.session.user.user_metadata.name);
    }
  });
}
