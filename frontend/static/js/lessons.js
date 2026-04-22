import {checkAuth} from "./auth.js";
const API_BASE_URL = window.location.origin;
export function initLessons() {
const addLessonForm = document.getElementById('add-lesson-form');
if (addLessonForm) {
addLessonForm.addEventListener("submit", handleAddLesson);
}
loadLessons();
}
async function handleAddLesson(e) {
const user= await checkAuth();
if(!user)return;
const username=user.username;
e.preventDefault();
const newLesson=document.getElementById("lesson-name").value;
const response= await fetch (`${API_BASE_URL}/api/users/${username}/lessons`,{
    method:"POST",
    headers: { "Content-Type": "application/json" },
    credentials:"include",
    body: JSON.stringify({lesson_name: newLesson})
});
if(response.ok){
document.getElementById("lesson-name").value="";
console.log(newLesson);
loadLessons();
}else{
alert("error adding lesson");
}
}
async function loadLessons() {
    const user= await checkAuth();
    if(!user)return;
const username=user.username;
const response= await fetch (`${API_BASE_URL}/api/users/${username}/lessons`,{
    credentials:"include"
});
if(!response.ok){
console.error("Failed to load lessons");
    return;
}
const lessons= await response.json();
const list=document.getElementById("lessons-list");
list.innerHTML="";
 lessons.forEach(lesson => {
    const li = document.createElement("li");
    li.textContent = lesson.lesson_name;
    list.appendChild(li);
  });
}
