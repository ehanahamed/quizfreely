/*
  Quizfreely
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.com/LICENSE.txt
*/

var pocketbase = new PocketBase("http://127.0.0.1:8090")

pocketbase.collection('users').authRefresh().then(
  function (result) {
    console.log(result);
  }
)

if (typeof states !== "undefined") {
  console.log(pocketbase.authStore.isValid());
  /*.then(function (result) {
    if (result.data.session === null) {
      states.newUser(true);
    } else if (result.data.session !== null) {
      states.newUser(false);
    }
  });*/
}
