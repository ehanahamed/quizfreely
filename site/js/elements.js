/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var elements = {
    sections: {
        load: document.getElementById("sectionLoad"),
        importOptions: document.getElementById("sectionImportOptions"),
        importLocal: document.getElementById("sectionImportLocal"),
        edit: document.getElementById("sectionEdit"),
        exportOptions: document.getElementById("sectionExportOptions"),
        exportLocal: document.getElementById("sectionExportLocal")
    },
    buttons: {
        make: document.getElementById("buttonMake"),
        importOptions: document.getElementById("buttonImportOptions"),
        exportOptions: {
            download: document.getElementById("buttonExportOptionsDownload")
        }
    },
    inputs: {
        importLocal: {
            file: document.getElementById("inputImportLocalFile")
        },
        edit: {
            name: document.getElementById("inputEditName"),
            table: document.getElementById("inputEditTable")
        }
    }
}