/* save html table content into js array */
function table_to_array(param) {
    pt1 = document.getElementById(param).rows;
    pt2 = [];
    for (var i = 0; i < pt1.length; i++) {
        el = pt1[i].children;
        el2 = [];
        for (var i2 = 0; i2 < el.length; i2++) {
            el2.push(el[i2].innerText);
        }
        pt2.push(el2);
    }
    return pt2;
}
