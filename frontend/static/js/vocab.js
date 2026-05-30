import {checkAuth} from "./auth.js";
const API_BASE_URL = window.location.origin;
/**
  Initializes the vocabulary page by registering event
  handlers and loading all vocabulary of the selected lesson.
 */
export function initVocab() {
const addVocabForm = document.getElementById('add-vocab');
if (addVocabForm) {
addVocabForm.addEventListener("submit", handleAddVocab);
}
loadVocab();
}
/**
  Creates a new vocabulary entry in the currently selected lesson
  and refreshes the vocabulary list.
 */
async function handleAddVocab(e) {
e.preventDefault();
const user= await checkAuth();
if(!user)return;
const username=user.username;
const newVocabNative=document.getElementById("vocab-native").value;
const newVocabForeign=document.getElementById("vocab-foreign").value;
const lesson_name = localStorage.getItem("lessonName");
const response= await fetch (`${API_BASE_URL}/api/users/${username}/lessons/${lesson_name}/vocab`,{
    method:"POST",
    headers: { "Content-Type": "application/json" },
    credentials:"include",
    body: JSON.stringify({word_native:newVocabNative,word_foreign:newVocabForeign })
});
if(response.ok){
document.getElementById("vocab-native").value="";
document.getElementById("vocab-foreign").value="";
loadVocab();
}else{
alert("error adding Vocab");
}
}
/**
 Loads all vocabulary of the selected lesson and renders
  them in the vocabulary list.
 */
async function loadVocab() {
const user= await checkAuth();
if(!user)return;
const username=user.username;
const lesson_name = localStorage.getItem("lessonName");
const response= await fetch (`${API_BASE_URL}/api/users/${username}/lessons/${lesson_name}/vocab`,{
    credentials:"include"
});
if(!response.ok){
console.error("Failed to load lessons");
    return;
}
const vocabs= await response.json();
const list=document.getElementById("vocab-list");
list.innerHTML="";
vocabs.forEach(vocab => {
const li = document.createElement("li");
    li.textContent = vocab.word_foreign;
    const button=document.createElement("button");
    button.textContent="Delete";
    button.style.marginLeft = "10px";
    button.id="delete-button";
    button.addEventListener("click",async () => {
     await deleteVocab(vocab.word_foreign);
    });
    li.appendChild(button);
    list.appendChild(li);
});
}
async function deleteVocab(word_foreign){
    const user= await checkAuth();
    if(!user)return;
    const username=user.username;
    const lesson_name=localStorage.getItem("lessonName");
    const response= await fetch (`${API_BASE_URL}/api/users/${username}/lessons/${lesson_name}/vocab/${word_foreign}`,{
    method:"DELETE",
    credentials:"include"
});
await loadVocab();
}
/**
  Parses a CSV file and converts each line into a vocabulary object.
  Expected format: foreign_word,native_word
 */
async function getCsv(file){

    const text = await file.text();

    const lines = text.split("\n").filter(line => line.trim() !== "");

const vocabList = lines.map(line => {
    const [foreign, native] = line.split(",");

    return {
        word_foreign: foreign.trim(),
        word_native: native.trim()
    };
});
return vocabList;
}
/**
  Imports vocabulary from a CSV file and stores all entries
  in the currently selected lesson.
 */
export async function loadCsv(){
const user= await checkAuth();
if(!user)return;
const username=user.username;
const lesson_name=localStorage.getItem("lessonName");
const fileInput = document.getElementById("csvFile");
const file = fileInput.files[0];
if (!file) {
    console.log("Keine Datei ausgewählt");
    return;
}
 const vocabList= await getCsv(file);
 for (const vocabulary of vocabList) {
await fetch (`${API_BASE_URL}/api/users/${username}/lessons/${lesson_name}/vocab`,{
    method:"POST",
    headers: { "Content-Type": "application/json" },
    credentials:"include",
    body: JSON.stringify({word_native:vocabulary.word_native,word_foreign:vocabulary.word_foreign})
});
 }
await loadVocab();
}




export async function loadVocabsOfLesson(lesson_name) {
const user= await checkAuth();
if(!user)return;
const username=user.username;
const response= await fetch (`${API_BASE_URL}/api/users/${username}/lessons/${lesson_name}/vocab`,{
    credentials:"include"
});
if(!response.ok){
console.error("Failed to load vocabs");
    return;
}
 const vocabs = await response.json();
    return vocabs;
}





