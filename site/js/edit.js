/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var edit = {
    make: function () {
        sessionData.studySetData = studySet.make();
        
        var newRow = elements.inputs.edit.table.insertRow(elements.inputs.edit.table.rows.length - 1);
        newRow.insertCell(0).innerHTML = "<input type='text' placeholder='Term' value='Type here!'></input>";
        newRow.insertCell(1).innerHTML = "<textarea rows='2' placeholder='Definition'>Type here! Drag the corner to resize.</textarea>";
    },
    load: function () {
        edit.makeTableFromArray(sessionData.studySetData.data, elements.inputs.edit.table);
    },
    add: function() {
        var newRow = elements.inputs.edit.table.insertRow(elements.inputs.edit.table.rows.length - 1);
        newRow.insertCell(0).innerHTML = "<input type='text' placeholder='Term'></input>";
        newRow.insertCell(1).innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
    },
    save: function () {
            sessionData.studySetData.name = elements.inputs.edit.name.value;
            sessionData.studySetData.data = edit.makeArrayFromTable(elements.inputs.edit.table);
            exportLocal.save();
    },
    makeArrayFromTable: function (element) {
        var tableArray = [];
        for (var i = 1; i < element.rows.length - 1; i++) {
            var row = [];
            var tableCells = element.rows[i].children;
            for (var i2 = 0; i2 < tableCells.length; i2++) {
                row.push(tableCells[i2].children[0].value);
            }
            tableArray.push(row)
        }
        return tableArray
    },
    makeTableFromArray: function (array, table) {
        for (var i = 0; i < array.length; i++) {
            var row = array[i]
            var newRow = table.insertRow(table.rows.length - 1);
            for (var i2 = 0; i2 < row.length; i2++) {
                if (i2 === 0) {
                    var newCell = newRow.insertCell(i2)
                    newCell.innerHTML = "<input type='text' placeholder='Term'></input>";
                    newCell.children[0].value = row[i2];
                } else {
                    var newCell = newRow.insertCell(i2)
                    newCell.innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
                    newCell.children[0].value = row[i2];
                }
            }
        }
    },
}
