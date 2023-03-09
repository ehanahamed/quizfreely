/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var sections = {
    init: function () {
        var sectionLoad = document.getElementById("load");
        var sectionImportOptions = document.getElementById("importOptions");
        var sectionImportLocal = document.getElementById("importLocal")
        var sectionEdit = document.getElementById("edit");
        var sectionExport = document.getElementById("export");

        sectionLoad.style.display = "block";
        sectionImportOptions.style.display = "none";
        sectionImportLocal.style.display = "none";
        sectionEdit.style.display = "none";
        sectionExport.style.display = "none";
    },
    buttons: {
        create: function () {
            edit.create();

            sectionLoad.style.display = "none";
            sectionImportOptions.style.display = "none";
            sectionImportLocal.style.display = "none";
            sectionEdit.style.display = "block";
            sectionExport.style.display = "none";
        },
        importOptions: function () {
            sectionLoad.style.display = "none";
            sectionImportOptions.style.display = "block";
            sectionImportLocal.style.display = "none";
            sectionEdit.style.display = "none";
            sectionExport.style.display = "none";
        },
        importLocal: function () {
            sectionLoad.style.display = "none";
            sectionImportOptions.style.display = "none";
            sectionImportLocal.style.display = "block";
            sectionEdit.style.display = "none";
            sectionExport.style.display = "none";
        }
    }
}