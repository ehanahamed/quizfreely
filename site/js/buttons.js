/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
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
    edit: {
        add: function () {
            edit.add();
        },
        done: function() {
            edit.save();
            sections.changeTo("exportOptions");
        }
    }
}
