import {nav} from "./nav.js";
import {checkAuth} from "./auth.js";
import {initLessons} from "./lessons.js";
import {practiceVocab} from "./practicelogic.js"
document.addEventListener("DOMContentLoaded", async () => {
 const usernamePlaceholder = document.getElementById("username-placeholder"); //Element in dashboard.html to display username and check if user is authenticated
if (usernamePlaceholder) {
  const user = await checkAuth();
  if (!user) return;
  usernamePlaceholder.textContent = user.username;
}
nav();
initLessons();
//practiceVocab();
});
