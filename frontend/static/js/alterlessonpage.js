import {nav} from "./nav.js";
import {checkAuth} from "./auth.js";
document.addEventListener("DOMContentLoaded", async () => {
 const usernamePlaceholder = document.getElementById("username-placeholder"); //Element in dashboard.html to display username and check if user is authenticated
if (usernamePlaceholder) {
  const user = await checkAuth();
  if (!user) return;
  usernamePlaceholder.textContent = user.username;
}
const lessonId = localStorage.getItem("lessonId");
document.getElementById("lesson-title").textContent = lessonId;//provisorium um zu schauen ob es geht
nav();
});