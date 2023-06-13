/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var flashcards = {
    load: function (index) {
        elements.flashcards.front.innerText = sessionData.studySetData.data[sessionData.flashcards.index][0];
        elements.flashcards.back.innerText = sessionData.studySetData.data[sessionData.flashcards.index][1];
        document.getElementById("mainActionsFlashcardoptionsIndex").innerText = "1/" + sessionData.studySetData.data.length.toString();
    },
    flip: function () {
        /*alerts.clear();*/
        elements.flashcards.card.classList.toggle("flip");
    },
    next: function () {
        if (sessionData.flashcards.index < sessionData.studySetData.data.length - 1) {
            /*alerts.clear();*/
            sessionData.flashcards.index += 1
            flashcards.load(sessionData.flashcards.index);
            var flashcardoptionsIndex = sessionData.flashcards.index + 1
            document.getElementById("mainActionsFlashcardoptionsIndex").innerText = flashcardoptionsIndex.toString() + "/" + sessionData.studySetData.data.length.toString();
        }/* else {
            alerts.show("flashcardsEnd");
        }*/
    },
    prev: function () {
        if (sessionData.flashcards.index >= 1) {
            /*alerts.clear();*/
            sessionData.flashcards.index -= 1
            flashcards.load(sessionData.flashcards.index);
            var flashcardoptionsIndex = sessionData.flashcards.index + 1
            document.getElementById("mainActionsFlashcardoptionsIndex").innerText = flashcardoptionsIndex.toString() + "/" + sessionData.studySetData.data.length.toString();
        }/* else {
            alerts.show("flashcardsEnd");
        }*/
    }
}
