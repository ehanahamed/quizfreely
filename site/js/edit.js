/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var edit = {
    create: function () {
        studySetData = studySet.create();
    },
    add: function() {
        var newRow = elements.inputs.edit.table.insertRow(elements.inputs.edit.table.rows.length - 1);
        newRow.insertCell(0).innerHTML = "<input type='text' placeholder='Term'></input>";
        newRow.insertCell(1).innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
    },
    save: function () {
            studySetData.name = elements.inputs.edit.name.value;
            studySetData.set = arrayFromTable(elements.inputs.edit.table);
    },
    arrayFromTable: function (element) {
        tableData = element.rows
        tableDataArray = []
        for (var i = 1; i < tableData.length - 1; i++) {
            tableRows = tableData[i].children
            row = []
            for (var i2 = 0; i2 < tableRows.length; i2++) {
                row.push(tableRows[i2].children[0].value);
            }
            tableDataArray.push(row)
        }
        return tableDataArray
    },
}
