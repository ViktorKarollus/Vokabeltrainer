import {nav} from "./nav.js";
import {checkAuth} from "./auth.js";
import {initLessons} from "./lessons.js";
import {startPracticeVocab} from "./practicelogic.js";
import {clearPracticeList} from "./practicelogic.js";
document.addEventListener("DOMContentLoaded", async () => {
 const usernamePlaceholder = document.getElementById("username-placeholder"); //Element in dashboard.html to display username and check if user is authenticated
if (usernamePlaceholder) {
  const user = await checkAuth();
  if (!user) return;
  usernamePlaceholder.textContent = user.username;
}
const startpracticing = document.getElementById('start-practice');
if (startpracticing) {
 startpracticing.addEventListener("click", (event) => {
  event.preventDefault();
        startPracticeVocab();
    });
}
const clearListForm = document.getElementById('clear-lesson');
if (clearListForm) {
 clearListForm.addEventListener("click", () => {
  event.preventDefault();
        clearPracticeList();
    });
}
nav();
initLessons();
});
