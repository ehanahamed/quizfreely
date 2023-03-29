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
        var newRow = elements.inputs.edit.table.insertRow(elements.inputs.edit.table.rows.length - 1);
        newRow.insertCell(0).innerHTML = "<input type='text' placeholder='Term'></input>";
        newRow.insertCell(1).innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
        newRow.insertCell(2).innerHTML = "<button onclick='edit.remove("+newRow.index+")'>X ("+newRow.index+")</button>";
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
            
            /* code below is for only two columns */
            row.push(tableCells[0].children[0].value);
            row.push(tableCells[1].children[0].value);
            
            /* code below is for infinite columns */
            /*
            for (var i2 = 0; i2 < tableCells.length; i2++) {
                row.push(tableCells[i2].children[0].value);
            }
            */

            tableArray.push(row);
        }
        return tableArray;
    },
    makeTableFromArray: function (array, table) {
        for (var i = 0; i < array.length; i++) {
            var row = array[i];
            var newRow = table.insertRow(table.rows.length - 1);

            /* code below is for only two columns */
            var newCell = newRow.insertCell(0);
            newCell.innerHTML = "<input type='text' placeholder='Term'></input>";
            newCell.children[0].value = row[0];
            var newCell = newRow.insertCell(1);
            newCell.innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
            newCell.children[0].value = row[1];

            /* code below is for infinite columns*/
            /*
            for (var i2 = 0; i2 < row.length; i2++) {
                var newCell = newRow.incertCell(i2);
                newCell.innerHTML = "html goes here";
                newCell.children[0].value = row[0];
            }
            */
        }
    },
}
