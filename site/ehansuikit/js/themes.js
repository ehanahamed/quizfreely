/*!
  design.ehan.dev
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://design.ehan.dev/LICENSE.txt
*/

function setTheme(theme) {
  document.documentElement.classList.remove(
    "auto",
    "purpleish",
    "snow",
    "owl",
    "blurple",
    "cat",
    "catdim"
  );
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
}

/* run function with localStorage to set to last used theme */
if (localStorage.getItem("theme")) {
  setTheme(localStorage.getItem("theme"));
} else {
  setTheme("auto")
}
