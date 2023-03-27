/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var elements = {
    sections: {
        load: document.getElementById("sectionLoad"),
        importOptions: document.getElementById("sectionImportOptions"),
        actionOptions: document.getElementById("sectionActionOptions"),
        edit: document.getElementById("sectionEdit"),
        exportOptions: document.getElementById("sectionExportOptions"),
        exportLocal: document.getElementById("sectionExportLocal"),
        reviewOptions: document.getElementById("sectionReviewOptions"),
        flashcards: document.getElementById("sectionFlashcards")
    },
    buttons: {
        make: document.getElementById("buttonMake"),
        importOptions: document.getElementById("buttonImportOptions"),
    },
    inputs: {
        importLocal: {
            file: document.getElementById("inputImportLocalFile")
        },
        edit: {
            name: document.getElementById("inputEditName"),
            table: document.getElementById("inputEditTable")
        }
    },
    links: {
        exportLocal: {
            download: document.getElementById("linkExportLocalDownload")
        }
    },
    alerts: {
        successImport: document.getElementById("alertSuccessImport"),
        errorImport: document.getElementById("alertErrorImport"),
        flashcardsEnd: document.getElementById("alertFlashcardsEnd")

    },
    flashcards: {
        card: document.getElementById("flashcardsCard"),
        cardFront: document.getElementById("flashcardsCardFront"),
        cardBack: document.getElementById("flashcardsCardBack")
    }
}