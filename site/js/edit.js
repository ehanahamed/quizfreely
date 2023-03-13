/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var edit = {
    make: function () {
        studySetData = studySet.make();
    },
    add: function() {
        var newRow = elements.inputs.edit.table.insertRow(elements.inputs.edit.table.rows.length - 1);
        newRow.insertCell(0).innerHTML = "<input type='text' placeholder='Term'></input>";
        newRow.insertCell(1).innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
    },
    save: function () {
            studySetData.name = elements.inputs.edit.name.value;
            studySetData.set = edit.makeArrayFromTable(elements.inputs.edit.table);
    },
    makeArrayFromTable: function (element) {
        tableRows = element.rows
        tableArray = []
        for (var i = 1; i < tableRows.length - 1; i++) {
            tableCells = tableRows[i].children
            row = []
            for (var i2 = 0; i2 < tableCells.length; i2++) {
                row.push(tableCells[i2].children[0].value);
            }
            tableArray.push(row)
        }
        return tableDataArray
    },
}
