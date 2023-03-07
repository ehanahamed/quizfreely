
function editAddButton() {
    var table = document.getElementById("editTable");
    var row = table.insertRow(table.rows.length - 1);
    var cellTerm = row.insertCell(0);
    var cellDef = row.insertCell(1);
    cellTerm.innerHTML = "<input type='text' placeholder='Term'></input>";
    cellDef.innerHTML = "<textarea rows='1' placeholder='Definition'></textarea>";
    console.log(saveTable("editTable"));
}

/* save html table content into js array */
function saveTable(id) {
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
