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

/*
Prompt user to create username if username is null
*/
supabaseClient.auth.getSession().then(
  function (result) {
    if (result.data.session !== null) {
      if (result.data.session.user.data.hasOwnProperty("username") === false) {
        var newDiv = document.createElement("div");
        newDiv.innerHTML = "<div class='modal'><div class='content'><h2>Create a Username</h2><p>Finish setting up your account by creating a username!</p><a href='./setusername.html' class='button'>Set Username</button></div></div>"
        document.body.appendChild(newDiv);
      }
  }
});
