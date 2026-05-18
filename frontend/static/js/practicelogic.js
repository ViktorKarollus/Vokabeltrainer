import {checkAuth} from "./auth.js";
const API_BASE_URL = window.location.origin;
const practiceList=[];
export async function startPracticeVocab(){
if(practiceList.length===0){
alert("Please load a lesson");
}else{
await practiceVocab();
}
}
 async function practiceVocab(){
    const user= await checkAuth();
    if(!user)return;
    const username=user.username;
const vocabPlaceholder = document.getElementById("vocab-placeholder");
const foreignInput = document.getElementById("vocab-solution");
const practiceForm = document.getElementById('practice-form');
const feedback = document.getElementById('feedback');
const correctAnswer = document.getElementById('correct-answer');
if (!practiceForm) return;
   let currentIndex = 0;
function showVocabulary() {
    if (currentIndex >= practiceList.length) {
            vocabPlaceholder.textContent = "Done!";
            return;
        }
const vocabulary = practiceList[currentIndex];
        vocabPlaceholder.textContent = vocabulary.word_native;

        foreignInput.value = "";

        const handleSubmit = async (event) => {

            event.preventDefault();

            let correct = false;

            if (foreignInput.value.trim().toLowerCase() === vocabulary.word_foreign.toLowerCase()) {
                correct = true;
                 feedback.textContent = "Correct";
                 correctAnswer.textContent="";
            }else{
            feedback.textContent="False";
            correctAnswer.textContent=vocabulary.word_foreign;
            practiceList.push(vocabulary);
            }
                await fetch(`${API_BASE_URL}/api/vocab/answer`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        word_foreign: vocabulary.word_foreign,
                        username: username,
                        lesson_name: vocabulary.lesson_name,
                        correct: correct
                    })
                });
                currentIndex++;
                console.log(practiceList);
                practiceForm.removeEventListener(
                    "submit",
                    handleSubmit
                );

                showVocabulary();
        };

        practiceForm.addEventListener("submit", handleSubmit);
    }

    showVocabulary();
}

export  function makePracticeList(vocabs){
for (const vocabulary of vocabs) {
if(!practiceList.some(v => v.word_foreign === vocabulary.word_foreign)){
practiceList.push(vocabulary);
}
}
}

export function clearPracticeList(){
practiceList.length = 0;
}