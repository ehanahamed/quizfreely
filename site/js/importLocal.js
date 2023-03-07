/*!
Quizfreely (https://quizfreely.ehan.dev)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var importLocal = {
  wtfdoinamethis: function () {
    const [file] = document.querySelector("input[type=file]").files;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        // this will then display a text file
        content.innerText = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsText(file);
    }
  }
}