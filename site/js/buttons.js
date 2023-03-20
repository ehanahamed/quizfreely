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
}
