function openIndexedDB(callback) {
    var dbReq = window.indexedDB.open("quizfreelydata");
    dbReq.onerror = function (event) {
        console.error("IndexedDB no worky");
        alert("IndexedDB no worky :(");
    };
    dbReq.onupgradeneeded = function (event) {
        var db = event.target.result;
        if (db.objectStoreNames.contains("studysets") == false) {
          var studysetsObjectStore = db.createObjectStore("studysets", { keyPath: "id", autoIncrement: true });
          studysetsObjectStore.createIndex("title_idx", "title");
        }
    };
    dbReq.onsuccess = function (event) {
        callback(event.target.result);
    };
}
