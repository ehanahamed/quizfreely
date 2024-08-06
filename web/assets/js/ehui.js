/*
  EhUI
  Copyright (c) Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://ehui.ehan.dev/LICENSE.txt
*/

var ehui = {
  loadCss: function (url) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  },
  themes: [],
  theme: {
    sync: function (current, path, ext, update) {
      if (window.localStorage) {
        var theme = localStorage.getItem("theme");
        if (theme !== null && ehui.themes.includes(theme) && theme != current) {
          ehui.loadCss(path + theme + ext);
          if (update) {
            update(theme);
          }
        }
      }
    },
    set: function (theme) {
      if (window.localStorage) {
        localStorage.setItem("theme", theme)
      }
    }
  },  
}
