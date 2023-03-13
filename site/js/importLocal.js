/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var importLocal = {
    init: function () {
        elements.inputs.importLocal.file.onchange = function () {
            importLocal.input();
        };
    },
    input: function () {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            edit.load(event.target.result);
            sections.changeTo("edit");
        };
        fileReader.readAsText(elements.inputs.importLocal.file.files[0]);
    }
};
