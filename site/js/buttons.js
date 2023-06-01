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
    actionOptions: {
        edit: function () {
            studySet.load(sessionData.importLocal.fileData)
            edit.load();
            sections.changeTo("edit");
            alerts.clear();
        },
        flashcards: function () {
            studySet.load(sessionData.importLocal.fileData);
            sessionData.flashcards.index = 0;
            flashcards.load(sessionData.flashcards.index);
            sections.changeTo("flashcards");
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
    },
    flashcards: {
        flip: function () {
            flashcards.flip();
        },
        prev: function () {
            flashcards.prev();
        },
        next: function () {
            flashcards.next();
        }
    }
}
