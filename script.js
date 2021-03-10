const quizAPI = 'https://opentdb.com/api.php?amount=10&type=multiple';

const startButton = document.getElementById('start');
const header = document.getElementById('header');
const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
const question = document.getElementById('question');
const buttonElement =  document.getElementById('button');
const answerDiv = document.getElementById('answer');
const goHome = document.getElementById('gohome');

class Quiz {
  constructor(category, difficulty, question, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3){
    this.category = category;
    this.difficulty = difficulty;
    this.question = question;
    this.correct_answer = correct_answer;
    this.incorrect_answer1 = incorrect_answer1;
    this.incorrect_answer2 = incorrect_answer2;
    this.incorrect_answer3 = incorrect_answer3;
  }
}

let correctNum = 0;

goHome.style.display = "none";

const quizLoad = () => {
  header.innerHTML = '取得中';
  question.innerHTML = '少々お待ちください';
  startButton.style.display = "none";


  async function getQuiz() {
    const response = await fetch(quizAPI);
    const jsonData = await response.json();
    return jsonData;
  }
  getQuiz()
    .then(jsonData => {
      const quiz = jsonData.results;

      let quizNum = 1;
      let quizClass = new Quiz( quiz[quizNum - 1].category, quiz[quizNum - 1].difficulty, quiz[quizNum - 1].question, quiz[quizNum - 1].correct_answer, quiz[quizNum - 1].incorrect_answers[0], quiz[quizNum - 1].incorrect_answers[1], quiz[quizNum - 1].incorrect_answers[2]);

      nextQizu(quizClass, quizNum);

    })

  .catch(e => {
    console.log(e.message);
  });

};

const nextQizu = (quizClass, quizNum) => {
  header.innerHTML = `問題${quizNum}`;
  category.innerHTML = `[ジャンル]${quizClass.category}`;
  difficulty.innerHTML = `[難易度]${quizClass.difficulty}`;
  question.innerHTML = `${quizClass.question}`;

  const correctAnswer = quizClass.correct_answer;
  const incorrectAnswer1 = quizClass.incorrect_answer1;
  const incorrectAnswer2 = quizClass.incorrect_answer2;
  const incorrectAnswer3 = quizClass.incorrect_answer3;

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
      nextButton(answerDiv, quizClass, quizNum);
    });
  });
};

const nextButton = (answerDiv, quizClass, quizNum) => {
  quizNum++;
  while(answerDiv.firstChild){
    answerDiv.removeChild(answerDiv.firstChild);
  };

  if (quizNum <11) {
    nextQizu(quizClass, quizNum);
  } else {
    header.innerHTML = `あなたの正答数は${correctNum}です！！`;
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