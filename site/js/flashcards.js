/*!
Quizfreely (quizfreely.ehan.dev)
Copyright (c) 2022-present Ehan Ahamed and contributors
Licensed under the UPL-1.0 License
https://src.ehan.dev/quizfreely/LICENSE.txt
*/

var flashcards = {
    load: function (index) {
        elements.flashcards.cardFront.innerText = sessionData.studySetData.data[sessionData.flashcards.index][0];
        elements.flashcards.cardBack.innerText = sessionData.studySetData.data[sessionData.flashcards.index][1];
    },
    flip: function () {
        elements.flashcards.card.classList.toggle("flip");
    },
    next: function () {
        sessionData.flashcards += 1
        flashcards.load(sessionData.flashcards.index);
    },
    prev: function () {
        sessionData.flashcards -= 1
        flashcards.load(sessionData.flashcards.index);
    }
}
