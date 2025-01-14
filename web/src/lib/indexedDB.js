export function openIndexedDB(callback) {
    var dbReq = window.indexedDB.open("quizfreelydata", 3);
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
        if (db.objectStoreNames.contains("studysetprogress") == false) {
            /* autoincrement is false, so we give the id for each record ourselves, because that id corresponds with the studyset id */
            var scoresObjectStore = db.createObjectStore("studysetprogress", { keyPath: "studyset_id", autoIncrement: false });
        }
        /*if (db.objectStoreNames.contains("scores") == false) {
            var scoresObjectStore = db.createObjectStore("scores", { keyPath: "id", autoIncrement: true });
            scoresObjectStore.createIndex("studyset_id_idx", "studyset_id")
        }*/
    };
    dbReq.onsuccess = function (event) {
        callback(event.target.result);
    };
}
