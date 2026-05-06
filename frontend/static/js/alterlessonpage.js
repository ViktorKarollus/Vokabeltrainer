import {nav} from "./nav.js";
import {deleteLesson} from "./lessons.js";
import {checkAuth} from "./auth.js";
import {initVocab} from "./vocab.js";
document.addEventListener("DOMContentLoaded", async () => {
 const usernamePlaceholder = document.getElementById("username-placeholder"); //Element in dashboard.html to display username and check if user is authenticated
if (usernamePlaceholder) {
  const user = await checkAuth();
  if (!user) return;
  usernamePlaceholder.textContent = user.username;
}
const lessonName = localStorage.getItem("lessonName");
document.getElementById("lesson-title").textContent = lessonName;//shows the lesson name
nav();
deleteLesson();
initVocab();
});