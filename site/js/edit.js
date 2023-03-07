/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

function editAddButton() {
    var table = document.getElementById("editTable");
    var row = table.insertRow(table.rows.length - 1);
    var cellTerm = row.insertCell(0);
    var cellDef = row.insertCell(1);
    cellTerm.innerHTML = "<input type='text' placeholder='Term'></input>";
    cellDef.innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
}

/* save html table content into js array */
function getTableData(id) {
    tableRows = document.getElementById(id).rows
    tableData = []
    for (var i = 1; i < tableRows.length - 1; i++) {
        rows = tableRows[i].children
        row = []
        for (var i2 = 0; i2 < rows.length; i2++) {
            row.push(rows[i2].children[0].value);
        }
        tableData.push(row)
    }
    return tableData
}

function editDone() {
    studySetData.set = getTableData("editTable");
}
