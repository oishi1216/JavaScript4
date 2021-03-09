const quizAPI = 'https://opentdb.com/api.php?amount=10&type=multiple';

const startButton = document.getElementById('start');
const header = document.getElementById('header');
const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
const question = document.getElementById('question');
const buttonElement =  document.getElementById('button');
const answerDiv = document.getElementById('answer');
const goHome = document.getElementById('gohome');

let correctNum = 0;

goHome.style.display = "none";

const quizLoad = () => {
  header.innerHTML = '取得中';
  question.innerHTML = '少々お待ちください';
  startButton.style.display = "none";

  fetch(quizAPI)
  .then((response) => response.json())
  .then((jsonData) => {
    const quiz = jsonData.results;
    console.log(quiz);
    let quizNum = 1;
    nextQizu(quiz, quizNum);

  });
};

const nextQizu = (quiz, quizNum) => {
  header.innerHTML = `問題${quizNum}`;
  category.innerHTML = `[ジャンル]${quiz[quizNum - 1].category}`;
  difficulty.innerHTML = `[難易度]${quiz[quizNum - 1].difficulty}`;
  question.innerHTML = `${quiz[quizNum - 1].question}`;

  const correctAnswer = quiz[quizNum - 1].correct_answer;
  const incorrectAnswer1 = quiz[quizNum - 1].incorrect_answers[0];
  const incorrectAnswer2 = quiz[quizNum - 1].incorrect_answers[1];
  const incorrectAnswer3 = quiz[quizNum - 1].incorrect_answers[2];

  let Answer = [correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3];
  let shuffleAnswer = shuffle(Answer);

  shuffleAnswer.forEach((value) => {
    const answerButton =  document.createElement('button');
    answerButton.textContent = value;
    const answerP = document.createElement('p');
    answerP.appendChild(answerButton);
    answerDiv.appendChild(answerP);

    answerButton.addEventListener('click', () => {
      if (value === correctAnswer){
        correctNum++;
      }
      nextButton(answerDiv, quiz, quizNum);
    });
  });

const nextButton = (answerDiv, quiz, quizNum) => {
  quizNum++;
  while(answerDiv.firstChild){
    answerDiv.removeChild(answerDiv.firstChild);
  };

  if (quizNum <11) {
    nextQizu(quiz, quizNum);
  } else {
    header.innerHTML = `あなたの正答数は${correctNum}です！！`;
    console.log(correctNum);
    category.innerHTML = '';
    difficulty.innerHTML = '';
    question.innerHTML = '再度チャレンジしたい場合は以下をクリック！！';
    goHome.style.display = "";
    goHome.addEventListener('click', () => {
      header.innerHTML = `ようこそ`;
      question.innerHTML = '以下のボタンをクリック';
      goHome.style.display = "none";
      startButton.style.display = "";
      quizNum = 0;
      correctNum = 0;
    });
  }
}

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startButton.addEventListener('click', () => quizLoad());