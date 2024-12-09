function openIndexedDB(callback) {
    var dbReq = window.indexedDB.open("quizfreelydata", 2);
    dbReq.onerror = function (event) {
        console.error("IndexedDB no worky");
        alert("IndexedDB no worky :(");
        console.error(dbReq.error);
    };
    dbReq.onupgradeneeded = function (event) {
        var db = event.target.result;
        if (db.objectStoreNames.contains("studysets") == false) {
          var studysetsObjectStore = db.createObjectStore("studysets", { keyPath: "id", autoIncrement: true });
          studysetsObjectStore.createIndex("title_idx", "title");
        }
        if (db.objectStoreNames.contains("scores") == false) {
            var scoresObjectStore = db.createObjectStore("scores", { keyPath: "id", autoIncrement: true });
            scoresObjectStore.createIndex("studyset_id_idx", "studyset_id")
        }
    };
    dbReq.onsuccess = function (event) {
        callback(event.target.result);
    };
}
