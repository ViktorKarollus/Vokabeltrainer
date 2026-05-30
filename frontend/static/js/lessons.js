import {checkAuth} from "./auth.js";
import {loadVocabsOfLesson} from "./vocab.js";
import {makePracticeList} from "./practicelogic.js";
const API_BASE_URL = window.location.origin;
/**
  Initializes the lesson page by registering event handlers
  and loading all available lessons.
 */
export function initLessons() {
const addLessonForm = document.getElementById('add-lesson-form');
if (addLessonForm) {
addLessonForm.addEventListener("submit", handleAddLesson);
}
loadLessons();
}
/*add a lesson to the backend and calls loadLessons
*/
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
loadLessons();
}else{
alert("error adding lesson");
}
}
/*
  Loads all lessons of the current user and renders them
 in the lesson list. Each lesson receives an "Alter" button
  for editing and an "Add" button for adding its vocabulary
  to the practice list.
 */
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
    const button=document.createElement("button");
    button.textContent="Alter";
    button.style.marginLeft = "10px";
    const addbutton=document.createElement("button");
    addbutton.textContent="add";
    addbutton.style.marginRight = "30px";
      addbutton.addEventListener("click", async () => {
      localStorage.setItem("lessonName", lesson.lesson_name);
   const vocabListForPractice= await loadVocabsOfLesson(lesson.lesson_name);
  makePracticeList(vocabListForPractice);
});
    button.addEventListener("click", () => {
      localStorage.setItem("lessonName", lesson.lesson_name);
    window.location.href = `${API_BASE_URL}/alterlesson`;
});
    li.appendChild(button);
    li.appendChild(addbutton);
    list.appendChild(li);
  });
}
/* deletes a lesson and redirects to the practice page
*/
export async function deleteLesson(){
    const deleteButton = document.getElementById("delete-lesson");
  if (deleteButton) {
    const user= await checkAuth();
    if(!user)return;
    const username=user.username;
    const lesson_name=localStorage.getItem("lessonName");
    deleteButton.addEventListener("click",async () => {
      const response= await fetch (`${API_BASE_URL}/api/users/${username}/lessons/${lesson_name}`,{
    method:"DELETE",
    credentials:"include"
    
});
      window.location.href = `${API_BASE_URL}/practice`;
    });
  }
}