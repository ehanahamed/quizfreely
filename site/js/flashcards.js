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
    },
    flip: function () {
        alerts.clear();
        elements.flashcards.card.classList.toggle("flip");
    },
    next: function () {
        if (sessionData.flashcards.index < sessionData.studySetData.data.length - 1) {
            alerts.clear();
            sessionData.flashcards.index += 1
            flashcards.load(sessionData.flashcards.index);
        } else {
            alerts.show("flashcardsEnd");
        }
    },
    prev: function () {
        if (sessionData.flashcards.index >= 1) {
            alerts.clear();
            sessionData.flashcards.index -= 1
            flashcards.load(sessionData.flashcards.index);
        } else {
            alerts.show("flashcardsEnd");
        }
    }
}
