/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var edit = {
    make: function () {
        sessionData.studySetData = studySet.make();
        edit.add();
    },
    load: function () {
        edit.makeTableFromArray(sessionData.studySetData.data, elements.inputs.edit.table);
    },
    add: function() {
        var newIndex = elements.inputs.edit.table.rows.length - 1;
        var newRow = elements.inputs.edit.table.insertRow(elements.inputs.edit.table.rows.length - 1);
        newRow.insertCell(0).innerHTML = "<input type='text' placeholder='Term'></input>";
        newRow.insertCell(1).innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
        var actions = newRow.insertCell(2);
        actions.innerHTML = "<button>X</button><button>/\\</button><button>\\/</button>";
        actions.children[0].addEventListener("click", function (event) { edit.remove(event.target.parentElement.parentElement.rowIndex) });
        actions.children[1].addEventListener("click", function (event) { edit.move(event.target.parentElement.parentElement.rowIndex, "up")});
        actions.children[2].addEventListener("click", function (event) { edit.move(event.target.parentElement.parentElement.rowIndex, "down")});
    },
    save: function () {
            sessionData.studySetData.name = elements.inputs.edit.name.value;
            sessionData.studySetData.data = edit.makeArrayFromTable(elements.inputs.edit.table);
            exportLocal.save();
    },
    remove: function (index) {
        elements.inputs.edit.table.deleteRow(index);
    },
    move: function (index, dir) {
        if (dir === "up") {
            console.log("moved (not really) " + index + " up")
        } else if (dir === "down") {
            console.log("moved (not really) " + index + " down")
        }
    },
    makeArrayFromTable: function (element) {
        var tableArray = [];
        for (var i = 1; i < element.rows.length - 1; i++) {
            var row = [];
            var tableCells = element.rows[i].children;
            
            row.push(tableCells[0].children[0].value);
            row.push(tableCells[1].children[0].value);

            tableArray.push(row);
        }
        return tableArray;
    },
    makeTableFromArray: function (array, table) {
        for (var i = 0; i < array.length; i++) {
            var row = array[i];
            
            edit.add();

            table.rows[i + 1].children[0].children[0].value = row[0]
            table.rows[i + 1].children[1].children[0].value = row[1]
        }
    },
}
