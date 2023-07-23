const { createClient } = supabase;
const supabaseClient = createClient(
  "https://okejqkisolxqgkgwwlbz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZWpxa2lzb2x4cWdrZ3d3bGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3NDE1MTgsImV4cCI6MjAwMTMxNzUxOH0.T8f_3fPAYnWdzguPonQZCAFmbAN-mTLQB3_EW9pjkis"
);

var newUserUi = [];
var userUi = [];

supabaseClient.auth.getSession().then(function (result) {
  if (result.data.session === null) {
    for (var i = 0; i < newUserUi.length; i++) {
      document.getElementById(newUserUi[i]).classList.remove("hide");
    }
    for (var i2 = 0; i2 < userUi.length; i2++) {
      document.getElementById(userUi[i2]).classList.add("hide");
    }
  } else if (result.data.session !== null) {
    for (var i3 = 0; i3 < newUserUi.length; i3++) {
      document.getElementById(newUserUi[i3]).classList.add("hide");
    }
    for (var i4 = 0; i4 < userUi.length; i4++) {
      document.getElementById(userUi[i4]).classList.remove("hide");
    }
  }
});
