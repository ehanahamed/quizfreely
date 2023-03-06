/* save html table content into js array */
function saveTable(id) {
    table = document.getElementById(id);
    array = [];
    for (var i = 0; i < table.rows.length; i++) {
        rows = table.rows[i].children;
        row = [];
        for (var i2 = 0; i2 < rows.length; i2++) {
            row.push(rows[i2].innerText);
        }
        array.push( );
    }
    return array;
}
