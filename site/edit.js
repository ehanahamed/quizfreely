/* save html table content into js array */
function saveTable(id) {
    table = document.getElementById(id);
    data = [];
    for (var i = 0; i < table.rows.length; i++) {
        console.log(i);
    }
    return data
}
