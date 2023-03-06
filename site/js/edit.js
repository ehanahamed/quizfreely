/* save html table content into js array */
function saveTable(id) {
    tableRows = document.getElementById(id).rows
    tableData = []
    for (var i = 1; i < tableRows.length - 1; i++) {
        rows = tableRows[i].children
        row = []
        for (var i2 = 0; i2 < rows.length; i2++) {
            row.push(rows[i2].children[0].innerHTML);
        }
        tableData.push(row)
    }
    return tableData
}
