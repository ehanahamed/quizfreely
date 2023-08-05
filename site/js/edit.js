/*!
  Quizfreely (quizfreely.ehan.dev)
  Copyright (c) 2022-present Ehan Ahamed and contributors
  Licensed under the UPL-1.0 License
  https://quizfreely.ehan.dev/license
*/

var edit = {
  make: function () {
    sessionData.studySetData = studySet.make();
    edit.add();
  },
  load: function () {
    edit.makeTableFromArray(
      sessionData.studySetData.data,
      document.getElementById(ui.elements.inputs.edit.table)
    );
    document.getElementById(ui.elements.inputs.edit.name).value = sessionData.studySetData.name;
  },
  insert: function (index) {
    var newRow = document.getElementById(ui.elements.inputs.edit.table).insertRow(index);
    newRow.insertCell(0).innerHTML =
      "<input type='text' placeholder='Term'></input>";
    newRow.insertCell(1).innerHTML =
      "<textarea class='vertical' rows='2' placeholder='Definition'></textarea>";
    var actions = newRow.insertCell(2);
    actions.innerHTML =
      "<div class='flex center'><button> <i class='nf nf-cod-arrow_up'></i> Move Up </button><button> <i class='nf nf-cod-arrow_down'></i> Move Down </button><button class='red'> <i class='nf nf-fa-trash_o'></i> Remove </button></div>";
    actions.children[0].children[0].addEventListener("click", function (event) {
      edit.move(
        event.target.parentElement.parentElement.parentElement.rowIndex,
        event.target.parentElement.parentElement.parentElement.rowIndex - 1
      );
    });
    actions.children[0].children[1].addEventListener("click", function (event) {
      edit.move(
        event.target.parentElement.parentElement.parentElement.rowIndex,
        event.target.parentElement.parentElement.parentElement.rowIndex + 2
      );
    });
    actions.children[0].children[2].addEventListener("click", function (event) {
      edit.remove(
        event.target.parentElement.parentElement.parentElement.rowIndex
      );
    });
  },
  add: function () {
    edit.insert(document.getElementById(ui.elements.inputs.edit.table).rows.length - 1);
  },
  save: function () {
    if (document.getElementById(ui.elements.inputs.edit.name).value) {
      sessionData.studySetData.name = document.getElementById(ui.elements.inputs.edit.name).value;
    } else {
      sessionData.studySetData.name = "Untitled Study Set";
    }
    sessionData.studySetData.data = edit.makeArrayFromTable(
      document.getElementById(ui.elements.inputs.edit.table)
    );
    exportLocal.save();
  },
  remove: function (index) {
    document.getElementById(ui.elements.inputs.edit.table).deleteRow(index);
  },
  move: function (index, newIndex) {
    /*
        Note to self: make this readable later
        */
    if (
      index !== newIndex &&
      ((index > newIndex && index !== 1) || index < newIndex) &&
      ((index < newIndex &&
        index < document.getElementById(ui.elements.inputs.edit.table).rows.length - 2) ||
        index > newIndex)
    ) {
      edit.insert(newIndex);
      var newOldIndex;
      if (index > newIndex) {
        newOldIndex = index + 1;
      } else if (index < newIndex) {
        newOldIndex = index;
      }
      document.getElementById(ui.elements.inputs.edit.table).rows[
        newIndex
      ].children[0].children[0].value =
      document.getElementById(ui.elements.inputs.edit.table).rows[
          newOldIndex
        ].children[0].children[0].value;
        document.getElementById(ui.elements.inputs.edit.table).rows[
        newIndex
      ].children[1].children[0].value =
      document.getElementById(ui.elements.inputs.edit.table).rows[
          newOldIndex
        ].children[1].children[0].value;
      edit.remove(newOldIndex);
    }
  },
  makeArrayFromTable: function (element) {
    var tableArray = [];
    for (var i = 1; i < element.rows.length - 1; i++) {
      var row = [];
      var tableCells = element.rows[i].children;

      row.push(tableCells[0].children[0].value);
      row.push(tableCells[1].children[0].value);

      tableArray.push(row);
    }
    return tableArray;
  },
  makeTableFromArray: function (array, table) {
    for (var i = 0; i < array.length; i++) {
      var row = array[i];

      edit.add();

      table.rows[i + 1].children[0].children[0].value = row[0];
      table.rows[i + 1].children[1].children[0].value = row[1];
    }
  },
};
