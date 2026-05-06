import {checkAuth} from "./auth.js";
const API_BASE_URL = window.location.origin;
export function initVocab() {
const addVocabForm = document.getElementById('add-vocab');
if (addVocabForm) {
addVocabForm.addEventListener("submit", handleAddVocab);
}
loadVocab();
}

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
    localStorage.setItem("word_foreign", vocab.word_foreign);
    button.addEventListener("click",async () => {
     await deleteVocab();
    });
    li.appendChild(button);
    list.appendChild(li);
});
}
async function deleteVocab(){
    const user= await checkAuth();
    if(!user)return;
    const username=user.username;
    const lesson_name=localStorage.getItem("lessonName");
    const word_foreign=localStorage.getItem("word_foreign");
    const response= await fetch (`${API_BASE_URL}/api/users/${username}/lessons/${lesson_name}/vocab/${word_foreign}`,{
    method:"DELETE",
    credentials:"include"
});
await loadVocab();
}


