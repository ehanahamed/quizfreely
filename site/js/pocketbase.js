/*
  Quizfreely
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.com/LICENSE.txt
*/

var pocketbase = new PocketBase("https://test.pocketbase.io/")

if (pocketbase.authStore.isValid) {
  pocketbase.collection('users').authRefresh();
}

if (typeof states !== "undefined") {
  if (pocketbase.authStore.isValid) {
    states.newUser(false);
  } else {
    states.newUser(true);
  }
}
