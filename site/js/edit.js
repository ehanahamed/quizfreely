/*!
Quizfreely (https://quizfreely.ehan.dev/)
Copyright (c) 2022-2023 Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
See license file: https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var sectionLoad = document.getElementById("load");
var sectionImport = document.getElementById("import");
var sectionImportLocal = document.getElementById("importLocal");
var sectionEdit = document.getElementById("edit");
var sectionExport = document.getElementById("export");

var editName = document.getElementById("editName");

var edit = {
    create: function () {
        studySetData = studySet.create();
    },

    buttons: {
        add: function () {
            var table = document.getElementById("editTable");
            var row = table.insertRow(table.rows.length - 1);
            var cellTerm = row.insertCell(0);
            var cellDef = row.insertCell(1);
            cellTerm.innerHTML = "<input type='text' placeholder='Term'></input>";
            cellDef.innerHTML = "<textarea rows='2' placeholder='Definition'></textarea>";
        },
        done: function () {
            studySetData.name = editName.value;
            studySetData.set = getTableData("editTable");
            console.log(studySetData);

            sectionLoad.style.display = "none";
            sectionImport.style.display = "none";
            sectionEdit.style.display = "none";
            sectionExport.style.display = "block";
        }
    },
    getTableDataArray: function (id) {
        tableData = document.getElementById(id).rows
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
