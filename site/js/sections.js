/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var sections = {
    init: function () {
        elements.sections.load.style.display = "block";
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