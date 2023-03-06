/* save html table content into js array */
function saveTable(id) {
    tableRows = document.getrowsementById(id).rows
    tableData = []
    for (var i = 0; i < tableRows.length; i++) {
        rows = tableRows[i].children
        row = []
        for (var j = 0; j < rows.length; j++) {
            row.push(rows[j].innerText);
        }
        tableData.push(row)
    }
    return tableData
}
