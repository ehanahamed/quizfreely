/*
  Quizfreely
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.com/LICENSE.txt
*/

var pb = new PocketBase("http://127.0.0.1:8090");

if (pb.authStore.isValid) {
  pb.collection("users").authRefresh();
}

if (typeof states !== "undefined") {
  if (pb.authStore.isValid) {
    states.newUser(false);
  } else {
    states.newUser(true);
  }
}
