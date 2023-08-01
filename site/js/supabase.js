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

if (states) {
  supabaseClient.auth.getSession().then(function (result) {
    if (result.data.session === null) {
      states.newUser(true);
    } else if (result.data.session !== null) {
      states.newUser(false);
    }
  });
}
