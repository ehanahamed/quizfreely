/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var buttons = {
    load: {
        make: function () {
            edit.make();
            sections.changeTo("edit");
        },
        importOptions: function () {
            sections.changeTo("importOptions")
        }
    },
    importOptions: {
        importLocal: function () {
            sections.changeTo("importLocal");
        },
    },
    importLocal: {
        fileSelect: function () {
            elements.inputs.importLocal.file.click();
        }
    },
    actionOptions: {
        edit: function () {
            edit.load(sessionData.importLocal.fileData);
            sections.changeTo("edit");
            alerts.clear();
        },
        review: function () {
            sections.changeTo("reviewOptions");
            alerts.clear();
        }
    },
    edit: {
        add: function () {
            edit.add();
        },
        done: function() {
            edit.save();
            sections.changeTo("exportOptions");
        }
    },
    exportOptions: {
        exportLocal: function () {
            sections.changeTo("exportLocal");
        },
    },
    reviewOptions: {
        flashcards: function () {
            studySet.load(sessionData.importLocal.fileData);
            
        }
    }
}
