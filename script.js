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
  constructor(quizData) {
      this._quizzes = quizData.results;
      this._correctAnswersNum = 0;
    }
  
    //Get API data elements
    getQuizCategory(index) {
      return this._quizzes[index - 1].category;
    }
  
    getQuizDifficulty(index) {
      return this._quizzes[index - 1].difficulty;
    }
  
    getQuizQuestion(index) {
      return this._quizzes[index - 1].question;
    }
  
    //Quiz Length
    getNumQuizzes() {
      return this._quizzes.length;
    }
  
    //Get CorrectAnswer
    getCorrectAnswer(index) {
      return this._quizzes[index - 1].correct_answer;
    }
  
    getIncorrectAnswers(index) {
      return this._quizzes[index - 1].incorrect_answers;
    }
  
    //CorrectAnswerCount
    countCorrectAnswers(index, answer) {
      const correctAnswer = this._quizzes[index - 1].correct_answer;
      if (answer === correctAnswer) {
        return this._correctAnswersNum++;
      }
    }
  
    //return CorrectAnswer
    getCorrectAnswersNum() {
      return this._correctAnswersNum;
    }
}

goHome.style.display = "none";

const quizLoad = async (index) => {
  header.innerHTML = '取得中';
  question.innerHTML = '少々お待ちください';
  startButton.style.display = "none";
  try {
    const response = await fetch(quizAPI);
    const quizData = await response.json();
    const quiz = new Quiz(quizData);

    nextQizu(quiz, index);
  }  catch(e) {
    console.log(e.message);
  };
};

const nextQizu = (quiz, index) => {
  header.innerHTML = `問題${index}`;
  category.innerHTML = `[ジャンル]${quiz.getQuizCategory(index)}`;
  difficulty.innerHTML = `[難易度]${quiz.getQuizDifficulty(index)}`;
  question.innerHTML = `${quiz.getQuizQuestion(index)}`;

  const correctAnswer = quiz.getCorrectAnswer(index);
  const incorrectAnswer = quiz.getIncorrectAnswers(index) ;

  let Answer = [correctAnswer, ...incorrectAnswer];
  let shuffleAnswer = shuffle(Answer);

  shuffleAnswer.forEach((answer) => {
    const answerButton =  document.createElement('button');
    answerButton.textContent = answer;
    const answerP = document.createElement('p');
    answerP.appendChild(answerButton);
    answerDiv.appendChild(answerP);

    answerButton.addEventListener('click', () => {
      quiz.countCorrectAnswers(index, answer)
      nextButton(answerDiv, quiz, index);
    });
  });
};

const nextButton = (answerDiv, quiz, index) => {
  index++;
  while(answerDiv.firstChild){
    answerDiv.removeChild(answerDiv.firstChild);
  };

  if (index <= quiz.getNumQuizzes()) {
    nextQizu(quiz, index);
  } else {
    header.innerHTML = `あなたの正答数は${quiz.getCorrectAnswersNum()}です！！`;
    category.innerHTML = '';
    difficulty.innerHTML = '';
    question.innerHTML = '再度チャレンジしたい場合は以下をクリック！！';
    goHome.style.display = "";
    goHome.addEventListener('click', () => {
      header.innerHTML = `ようこそ`;
      question.innerHTML = '以下のボタンをクリック';
      goHome.style.display = "none";
      startButton.style.display = "";
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

startButton.addEventListener('click', () => quizLoad(1));